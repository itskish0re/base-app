using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.GoodsItems;

public sealed record BatchToggleGoodssCommand(IReadOnlyList<ToggleGoodsItem> Items)
    : ICommand<BatchToggleGoodssResponse>;

internal sealed class BatchToggleGoodssCommandHandler(
    IGoodsRepository repository,
    IUnitOfWork unitOfWork,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider) : ICommandHandler<BatchToggleGoodssCommand, BatchToggleGoodssResponse>
{
    public async Task<Result<BatchToggleGoodssResponse>> Handle(
        BatchToggleGoodssCommand request,
        CancellationToken cancellationToken)
    {
        var updated = new List<GoodsResponse>();
        var failures = new List<BatchGoodsItemFailure>();
        var idsInBatch = new HashSet<int>();
        DateTime utcNow = dateTimeProvider.UtcNow;

        for (int index = 0; index < request.Items.Count; index++)
        {
            ToggleGoodsItem item = request.Items[index];

            if (!idsInBatch.Add(item.GoodsId))
            {
                failures.Add(new BatchGoodsItemFailure(
                    index,
                    "Goods.DuplicateId",
                    "Duplicate id in request batch."));
                continue;
            }

            Domain.Masters.Goods? entity = await repository.GetByIdAsync(item.GoodsId, cancellationToken);

            if (entity is null)
            {
                failures.Add(new BatchGoodsItemFailure(
                    index,
                    GoodsErrors.NotFound.Code,
                    GoodsErrors.NotFound.Description));
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

        return new BatchToggleGoodssResponse(updated, failures);
    }
}

internal sealed class BatchToggleGoodssCommandValidator : AbstractValidator<BatchToggleGoodssCommand>
{
    public BatchToggleGoodssCommandValidator()
    {
        RuleFor(x => x.Items).NotEmpty().WithMessage("At least one item is required.");
        RuleFor(x => x.Items.Count).LessThanOrEqualTo(100);

        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(x => x.GoodsId).GreaterThan(0);
        });
    }
}
