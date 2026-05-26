using Application.Abstractions.Authentication;
using Application.Abstractions.Messaging;
using Domain.Access;
using FluentValidation;
using SharedKernel;

namespace Application.Access.Menu;

public sealed record BatchToggleMenusCommand(IReadOnlyList<ToggleMenuItem> Items)
    : ICommand<BatchToggleMenusResponse>;

internal sealed class BatchToggleMenusCommandHandler(
    IMenuRepository menuRepository,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider) : ICommandHandler<BatchToggleMenusCommand, BatchToggleMenusResponse>
{
    public async Task<Result<BatchToggleMenusResponse>> Handle(
        BatchToggleMenusCommand request,
        CancellationToken cancellationToken)
    {
        var updated = new List<MenuResponse>();
        var failures = new List<BatchMenuItemFailure>();
        DateTime utcNow = dateTimeProvider.UtcNow;

        for (int index = 0; index < request.Items.Count; index++)
        {
            ToggleMenuItem item = request.Items[index];
            AppMenu? menu = await menuRepository.GetByIdAsync(item.MenuId, cancellationToken);

            if (menu is null)
            {
                failures.Add(new BatchMenuItemFailure(index, MenuErrors.NotFound.Code, MenuErrors.NotFound.Description));
                continue;
            }

            if (!item.IsActive && await menuRepository.HasActiveChildrenAsync(item.MenuId, cancellationToken))
            {
                failures.Add(new BatchMenuItemFailure(index, MenuErrors.HasChildren.Code, MenuErrors.HasChildren.Description));
                continue;
            }

            menu.IsActive = item.IsActive;
            menu.UpdatedAt = utcNow;
            menu.UpdatedBy = userContext.UserId;

            await menuRepository.UpdateAsync(menu, cancellationToken);
            updated.Add(menu.ToResponse());
        }

        return new BatchToggleMenusResponse(updated, failures);
    }
}

internal sealed class BatchToggleMenusCommandValidator : AbstractValidator<BatchToggleMenusCommand>
{
    public BatchToggleMenusCommandValidator()
    {
        RuleFor(x => x.Items).NotEmpty();
        RuleFor(x => x.Items.Count).LessThanOrEqualTo(100);
        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(x => x.MenuId).GreaterThan(0);
        });
    }
}
