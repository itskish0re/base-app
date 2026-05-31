using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.Parties;

public sealed record BatchTogglePartysCommand(IReadOnlyList<TogglePartyItem> Items)
    : ICommand<BatchTogglePartysResponse>;

internal sealed class BatchTogglePartysCommandHandler(
    IPartyRepository repository,
    IUnitOfWork unitOfWork,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider) : ICommandHandler<BatchTogglePartysCommand, BatchTogglePartysResponse>
{
    public async Task<Result<BatchTogglePartysResponse>> Handle(
        BatchTogglePartysCommand request,
        CancellationToken cancellationToken)
    {
        var updated = new List<PartyResponse>();
        var failures = new List<BatchPartyItemFailure>();
        var idsInBatch = new HashSet<int>();
        DateTime utcNow = dateTimeProvider.UtcNow;

        for (int index = 0; index < request.Items.Count; index++)
        {
            TogglePartyItem item = request.Items[index];

            if (!idsInBatch.Add(item.PartyId))
            {
                failures.Add(new BatchPartyItemFailure(
                    index,
                    "Party.DuplicateId",
                    "Duplicate id in request batch."));
                continue;
            }

            Domain.Masters.Party? entity = await repository.GetByIdAsync(item.PartyId, cancellationToken);

            if (entity is null)
            {
                failures.Add(new BatchPartyItemFailure(
                    index,
                    PartyErrors.NotFound.Code,
                    PartyErrors.NotFound.Description));
                continue;
            }

            entity.IsEnabled = item.IsEnabled;
            entity.UpdatedAt = utcNow;
            entity.UpdatedBy = userContext.UserId;

            updated.Add(entity.ToResponse());
        }

        if (updated.Count > 0)
        {
            await unitOfWork.SaveChangesAsync(cancellationToken);
        }

        return new BatchTogglePartysResponse(updated, failures);
    }
}

internal sealed class BatchTogglePartysCommandValidator : AbstractValidator<BatchTogglePartysCommand>
{
    public BatchTogglePartysCommandValidator()
    {
        RuleFor(x => x.Items).NotEmpty().WithMessage("At least one item is required.");
        RuleFor(x => x.Items.Count).LessThanOrEqualTo(100);

        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(x => x.PartyId).GreaterThan(0);
        });
    }
}
