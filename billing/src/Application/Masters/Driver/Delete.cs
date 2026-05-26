using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.Driver;

public sealed record BatchDeleteDriversCommand(IReadOnlyList<int> Ids) : ICommand<BatchDeleteDriversResponse>;

internal sealed class BatchDeleteDriversCommandHandler(
    IDriverRepository driverRepository,
    IUnitOfWork unitOfWork,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider) : ICommandHandler<BatchDeleteDriversCommand, BatchDeleteDriversResponse>
{
    public async Task<Result<BatchDeleteDriversResponse>> Handle(
        BatchDeleteDriversCommand request,
        CancellationToken cancellationToken)
    {
        var deletedIds = new List<int>();
        var failures = new List<BatchDriverItemFailure>();
        DateTime utcNow = dateTimeProvider.UtcNow;

        for (int index = 0; index < request.Ids.Count; index++)
        {
            int id = request.Ids[index];
            Domain.Masters.Driver? entity = await driverRepository.GetByIdAsync(id, cancellationToken);

            if (entity is null)
            {
                failures.Add(new BatchDriverItemFailure(
                    index,
                    DriverErrors.NotFound.Code,
                    DriverErrors.NotFound.Description));
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

        return new BatchDeleteDriversResponse(deletedIds, failures);
    }
}

internal sealed class BatchDeleteDriversCommandValidator : AbstractValidator<BatchDeleteDriversCommand>
{
    public BatchDeleteDriversCommandValidator()
    {
        RuleFor(x => x.Ids).NotEmpty().WithMessage("At least one id is required.");
        RuleFor(x => x.Ids.Count).LessThanOrEqualTo(100);
        RuleForEach(x => x.Ids).GreaterThan(0);
    }
}
