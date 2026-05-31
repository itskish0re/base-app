using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.Parties;

public sealed record BatchUpdatePartysCommand(IReadOnlyList<UpdatePartyItem> Items)
    : ICommand<BatchUpdatePartysResponse>;

internal sealed class BatchUpdatePartysCommandHandler(
    IPartyRepository repository,
    IUnitOfWork unitOfWork,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider) : ICommandHandler<BatchUpdatePartysCommand, BatchUpdatePartysResponse>
{
    public async Task<Result<BatchUpdatePartysResponse>> Handle(
        BatchUpdatePartysCommand request,
        CancellationToken cancellationToken)
    {
        var updated = new List<PartyResponse>();
        var failures = new List<BatchPartyItemFailure>();
        var codesInBatch = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        DateTime utcNow = dateTimeProvider.UtcNow;

        for (int index = 0; index < request.Items.Count; index++)
        {
            UpdatePartyItem item = request.Items[index];
            string code = item.Code.Trim();

            if (!codesInBatch.Add(code))
            {
                failures.Add(new BatchPartyItemFailure(
                    index,
                    PartyErrors.CodeNotUnique.Code,
                    "Duplicate code in request batch."));
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

            if (await repository.ExistsByCodeAsync(code, item.PartyId, cancellationToken))
            {
                failures.Add(new BatchPartyItemFailure(
                    index,
                    PartyErrors.CodeNotUnique.Code,
                    PartyErrors.CodeNotUnique.Description));
                continue;
            }

            entity.Name = item.Name.Trim();
            entity.Code = code;
            entity.IsEnabled = item.IsEnabled;
            entity.IsActive = item.IsActive;
            entity.UpdatedAt = utcNow;
            entity.UpdatedBy = userContext.UserId;

            updated.Add(entity.ToResponse());
        }

        if (updated.Count > 0)
        {
            await unitOfWork.SaveChangesAsync(cancellationToken);
        }

        return new BatchUpdatePartysResponse(updated, failures);
    }
}

internal sealed class BatchUpdatePartysCommandValidator : AbstractValidator<BatchUpdatePartysCommand>
{
    public BatchUpdatePartysCommandValidator()
    {
        RuleFor(x => x.Items).NotEmpty().WithMessage("At least one item is required.");
        RuleFor(x => x.Items.Count).LessThanOrEqualTo(100);

        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(x => x.PartyId).GreaterThan(0);
            item.RuleFor(x => x.Name).NotEmpty().MaximumLength(256);
            item.RuleFor(x => x.Code).NotEmpty().MaximumLength(64);
            item.RuleFor(x => x.Name).NotEmpty().MaximumLength(256);
        });
    }
}
