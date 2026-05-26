using Application.Abstractions.Authentication;
using Application.Abstractions.Messaging;
using Domain.Access;
using FluentValidation;
using SharedKernel;

namespace Application.Access.Menu;

public sealed record BatchDeleteMenusCommand(IReadOnlyList<int> Ids) : ICommand<BatchDeleteMenusResponse>;

internal sealed class BatchDeleteMenusCommandHandler(
    IMenuRepository menuRepository,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider) : ICommandHandler<BatchDeleteMenusCommand, BatchDeleteMenusResponse>
{
    public async Task<Result<BatchDeleteMenusResponse>> Handle(
        BatchDeleteMenusCommand request,
        CancellationToken cancellationToken)
    {
        var deletedIds = new List<int>();
        var failures = new List<BatchMenuItemFailure>();
        DateTime utcNow = dateTimeProvider.UtcNow;

        for (int index = 0; index < request.Ids.Count; index++)
        {
            int id = request.Ids[index];
            AppMenu? menu = await menuRepository.GetByIdAsync(id, cancellationToken);

            if (menu is null)
            {
                failures.Add(new BatchMenuItemFailure(index, MenuErrors.NotFound.Code, MenuErrors.NotFound.Description));
                continue;
            }

            if (await menuRepository.HasActiveChildrenAsync(id, cancellationToken))
            {
                failures.Add(new BatchMenuItemFailure(index, MenuErrors.HasChildren.Code, MenuErrors.HasChildren.Description));
                continue;
            }

            menu.IsActive = false;
            menu.UpdatedAt = utcNow;
            menu.UpdatedBy = userContext.UserId;

            await menuRepository.UpdateAsync(menu, cancellationToken);
            deletedIds.Add(id);
        }

        return new BatchDeleteMenusResponse(deletedIds, failures);
    }
}

internal sealed class BatchDeleteMenusCommandValidator : AbstractValidator<BatchDeleteMenusCommand>
{
    public BatchDeleteMenusCommandValidator()
    {
        RuleFor(x => x.Ids).NotEmpty();
        RuleFor(x => x.Ids.Count).LessThanOrEqualTo(100);
        RuleForEach(x => x.Ids).GreaterThan(0);
    }
}
