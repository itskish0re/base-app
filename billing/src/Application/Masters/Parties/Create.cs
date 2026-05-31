using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.Parties;

public sealed record BatchCreatePartysCommand(IReadOnlyList<CreatePartyItem> Items)
    : ICommand<BatchCreatePartysResponse>;

internal sealed class BatchCreatePartysCommandHandler(
    IPartyRepository repository,
    IUnitOfWork unitOfWork,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider) : ICommandHandler<BatchCreatePartysCommand, BatchCreatePartysResponse>
{
    public async Task<Result<BatchCreatePartysResponse>> Handle(
        BatchCreatePartysCommand request,
        CancellationToken cancellationToken)
    {
        var entities = new List<Domain.Masters.Party>();
        var failures = new List<BatchPartyItemFailure>();
        var codesInBatch = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        DateTime utcNow = dateTimeProvider.UtcNow;

        for (int index = 0; index < request.Items.Count; index++)
        {
            CreatePartyItem item = request.Items[index];
            string code = item.Code.Trim();

            if (!codesInBatch.Add(code))
            {
                failures.Add(new BatchPartyItemFailure(
                    index,
                    PartyErrors.CodeNotUnique.Code,
                    "Duplicate code in request batch."));
                continue;
            }

            if (await repository.ExistsByCodeAsync(code, excludeId: null, cancellationToken))
            {
                failures.Add(new BatchPartyItemFailure(
                    index,
                    PartyErrors.CodeNotUnique.Code,
                    PartyErrors.CodeNotUnique.Description));
                continue;
            }

            var entity = new Domain.Masters.Party
            {
                Name = item.Name.Trim(),
                Code = code,
                CreatedAt = utcNow,
                UpdatedAt = utcNow,
                CreatedBy = userContext.UserId,
                UpdatedBy = userContext.UserId,
            };

            repository.Add(entity);
            entities.Add(entity);
        }

        if (entities.Count > 0)
        {
            await unitOfWork.SaveChangesAsync(cancellationToken);
        }

        IReadOnlyList<PartyResponse> created = entities.Select(x => x.ToResponse()).ToList();

        return new BatchCreatePartysResponse(created, failures);
    }
}

internal sealed class BatchCreatePartysCommandValidator : AbstractValidator<BatchCreatePartysCommand>
{
    public BatchCreatePartysCommandValidator()
    {
        RuleFor(x => x.Items).NotEmpty().WithMessage("At least one item is required.");
        RuleFor(x => x.Items.Count).LessThanOrEqualTo(100);

        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(x => x.Name).NotEmpty().MaximumLength(256);
            item.RuleFor(x => x.Code).NotEmpty().MaximumLength(64);
            item.RuleFor(x => x.Name).NotEmpty().MaximumLength(256);
        });
    }
}
