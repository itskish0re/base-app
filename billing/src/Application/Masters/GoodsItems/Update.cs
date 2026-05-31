using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.GoodsItems;

public sealed record BatchUpdateGoodssCommand(IReadOnlyList<UpdateGoodsItem> Items)
    : ICommand<BatchUpdateGoodssResponse>;

internal sealed class BatchUpdateGoodssCommandHandler(
    IGoodsRepository repository,
    IUnitOfWork unitOfWork,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider) : ICommandHandler<BatchUpdateGoodssCommand, BatchUpdateGoodssResponse>
{
    public async Task<Result<BatchUpdateGoodssResponse>> Handle(
        BatchUpdateGoodssCommand request,
        CancellationToken cancellationToken)
    {
        var updated = new List<GoodsResponse>();
        var failures = new List<BatchGoodsItemFailure>();
        var codesInBatch = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        DateTime utcNow = dateTimeProvider.UtcNow;

        for (int index = 0; index < request.Items.Count; index++)
        {
            UpdateGoodsItem item = request.Items[index];
            string code = item.Code.Trim();

            if (!codesInBatch.Add(code))
            {
                failures.Add(new BatchGoodsItemFailure(
                    index,
                    GoodsErrors.CodeNotUnique.Code,
                    "Duplicate code in request batch."));
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

            if (await repository.ExistsByCodeAsync(code, item.GoodsId, cancellationToken))
            {
                failures.Add(new BatchGoodsItemFailure(
                    index,
                    GoodsErrors.CodeNotUnique.Code,
                    GoodsErrors.CodeNotUnique.Description));
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

        return new BatchUpdateGoodssResponse(updated, failures);
    }
}

internal sealed class BatchUpdateGoodssCommandValidator : AbstractValidator<BatchUpdateGoodssCommand>
{
    public BatchUpdateGoodssCommandValidator()
    {
        RuleFor(x => x.Items).NotEmpty().WithMessage("At least one item is required.");
        RuleFor(x => x.Items.Count).LessThanOrEqualTo(100);

        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(x => x.GoodsId).GreaterThan(0);
            item.RuleFor(x => x.Name).NotEmpty().MaximumLength(256);
            item.RuleFor(x => x.Code).NotEmpty().MaximumLength(64);
            item.RuleFor(x => x.Name).NotEmpty().MaximumLength(256);
        });
    }
}
