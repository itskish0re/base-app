using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.Locations;

public sealed record BatchDeleteLocationsCommand(IReadOnlyList<int> Ids) : ICommand<BatchDeleteLocationsResponse>;

internal sealed class BatchDeleteLocationsCommandHandler(
    ILocationRepository repository,
    IUnitOfWork unitOfWork,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider) : ICommandHandler<BatchDeleteLocationsCommand, BatchDeleteLocationsResponse>
{
    public async Task<Result<BatchDeleteLocationsResponse>> Handle(
        BatchDeleteLocationsCommand request,
        CancellationToken cancellationToken)
    {
        var deletedIds = new List<int>();
        var failures = new List<BatchLocationItemFailure>();
        DateTime utcNow = dateTimeProvider.UtcNow;

        for (int index = 0; index < request.Ids.Count; index++)
        {
            int id = request.Ids[index];
            Domain.Masters.Location? entity = await repository.GetByIdAsync(id, cancellationToken);

            if (entity is null)
            {
                failures.Add(new BatchLocationItemFailure(
                    index,
                    LocationErrors.NotFound.Code,
                    LocationErrors.NotFound.Description));
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

        return new BatchDeleteLocationsResponse(deletedIds, failures);
    }
}

internal sealed class BatchDeleteLocationsCommandValidator : AbstractValidator<BatchDeleteLocationsCommand>
{
    public BatchDeleteLocationsCommandValidator()
    {
        RuleFor(x => x.Ids).NotEmpty().WithMessage("At least one id is required.");
        RuleFor(x => x.Ids.Count).LessThanOrEqualTo(100);
        RuleForEach(x => x.Ids).GreaterThan(0);
    }
}
