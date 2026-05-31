using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.GoodsItems;

public sealed record BatchDeleteGoodssCommand(IReadOnlyList<int> Ids) : ICommand<BatchDeleteGoodssResponse>;

internal sealed class BatchDeleteGoodssCommandHandler(
    IGoodsRepository repository,
    IUnitOfWork unitOfWork,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider) : ICommandHandler<BatchDeleteGoodssCommand, BatchDeleteGoodssResponse>
{
    public async Task<Result<BatchDeleteGoodssResponse>> Handle(
        BatchDeleteGoodssCommand request,
        CancellationToken cancellationToken)
    {
        var deletedIds = new List<int>();
        var failures = new List<BatchGoodsItemFailure>();
        DateTime utcNow = dateTimeProvider.UtcNow;

        for (int index = 0; index < request.Ids.Count; index++)
        {
            int id = request.Ids[index];
            Domain.Masters.Goods? entity = await repository.GetByIdAsync(id, cancellationToken);

            if (entity is null)
            {
                failures.Add(new BatchGoodsItemFailure(
                    index,
                    GoodsErrors.NotFound.Code,
                    GoodsErrors.NotFound.Description));
                continue;
            }

            entity.IsDeleted = true;
            entity.DeletedAt = utcNow;
            entity.UpdatedAt = utcNow;
            entity.UpdatedBy = userContext.UserId;
            deletedIds.Add(id);
        }

        if (deletedIds.Count > 0)
        {
            await unitOfWork.SaveChangesAsync(cancellationToken);
        }

        return new BatchDeleteGoodssResponse(deletedIds, failures);
    }
}

internal sealed class BatchDeleteGoodssCommandValidator : AbstractValidator<BatchDeleteGoodssCommand>
{
    public BatchDeleteGoodssCommandValidator()
    {
        RuleFor(x => x.Ids).NotEmpty().WithMessage("At least one id is required.");
        RuleFor(x => x.Ids.Count).LessThanOrEqualTo(100);
        RuleForEach(x => x.Ids).GreaterThan(0);
    }
}
