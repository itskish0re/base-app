using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.Driver;

public sealed record BatchCreateDriversCommand(IReadOnlyList<CreateDriverItem> Items)
    : ICommand<BatchCreateDriversResponse>;

internal sealed class BatchCreateDriversCommandHandler(
    IDriverRepository driverRepository,
    IUnitOfWork unitOfWork,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider) : ICommandHandler<BatchCreateDriversCommand, BatchCreateDriversResponse>
{
    public async Task<Result<BatchCreateDriversResponse>> Handle(
        BatchCreateDriversCommand request,
        CancellationToken cancellationToken)
    {
        var entities = new List<Domain.Masters.Driver>();
        var failures = new List<BatchDriverItemFailure>();
        DateTime utcNow = dateTimeProvider.UtcNow;

        for (int index = 0; index < request.Items.Count; index++)
        {
            CreateDriverItem item = request.Items[index];

            if (!await driverRepository.TruckExistsAsync(item.TruckId, cancellationToken))
            {
                failures.Add(new BatchDriverItemFailure(
                    index,
                    DriverErrors.TruckNotFound.Code,
                    DriverErrors.TruckNotFound.Description));
                continue;
            }

            var entity = new Domain.Masters.Driver
            {
                Name = item.Name.Trim(),
                Mobile = item.Mobile.Trim(),
                TruckId = item.TruckId,
                CreatedAt = utcNow,
                UpdatedAt = utcNow,
                CreatedBy = userContext.UserId,
                UpdatedBy = userContext.UserId,
            };

            driverRepository.Add(entity);
            entities.Add(entity);
        }

        if (entities.Count > 0)
        {
            await unitOfWork.SaveChangesAsync(cancellationToken);
        }

        IReadOnlyList<DriverResponse> created = entities.Select(e => e.ToResponse()).ToList();

        return new BatchCreateDriversResponse(created, failures);
    }
}

internal sealed class BatchCreateDriversCommandValidator : AbstractValidator<BatchCreateDriversCommand>
{
    public BatchCreateDriversCommandValidator()
    {
        RuleFor(x => x.Items).NotEmpty().WithMessage("At least one item is required.");
        RuleFor(x => x.Items.Count).LessThanOrEqualTo(100);

        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(x => x.Name).NotEmpty().MaximumLength(256);
            item.RuleFor(x => x.Mobile).NotEmpty().MaximumLength(32);
            item.RuleFor(x => x.TruckId).GreaterThan(0);
        });
    }
}
