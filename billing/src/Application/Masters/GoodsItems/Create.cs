using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.GoodsItems;

public sealed record BatchCreateGoodssCommand(IReadOnlyList<CreateGoodsItem> Items)
    : ICommand<BatchCreateGoodssResponse>;

internal sealed class BatchCreateGoodssCommandHandler(
    IGoodsRepository repository,
    IUnitOfWork unitOfWork,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider) : ICommandHandler<BatchCreateGoodssCommand, BatchCreateGoodssResponse>
{
    public async Task<Result<BatchCreateGoodssResponse>> Handle(
        BatchCreateGoodssCommand request,
        CancellationToken cancellationToken)
    {
        var entities = new List<Domain.Masters.Goods>();
        var failures = new List<BatchGoodsItemFailure>();
        var codesInBatch = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        DateTime utcNow = dateTimeProvider.UtcNow;

        for (int index = 0; index < request.Items.Count; index++)
        {
            CreateGoodsItem item = request.Items[index];
            string code = item.Code.Trim();

            if (!codesInBatch.Add(code))
            {
                failures.Add(new BatchGoodsItemFailure(
                    index,
                    GoodsErrors.CodeNotUnique.Code,
                    "Duplicate code in request batch."));
                continue;
            }

            if (await repository.ExistsByCodeAsync(code, excludeId: null, cancellationToken))
            {
                failures.Add(new BatchGoodsItemFailure(
                    index,
                    GoodsErrors.CodeNotUnique.Code,
                    GoodsErrors.CodeNotUnique.Description));
                continue;
            }

            var entity = new Domain.Masters.Goods
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

        IReadOnlyList<GoodsResponse> created = entities.Select(x => x.ToResponse()).ToList();

        return new BatchCreateGoodssResponse(created, failures);
    }
}

internal sealed class BatchCreateGoodssCommandValidator : AbstractValidator<BatchCreateGoodssCommand>
{
    public BatchCreateGoodssCommandValidator()
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
