using Application.Abstractions.Authentication;
using Application.Abstractions.Messaging;
using Domain.Access;
using FluentValidation;
using SharedKernel;

namespace Application.Access.Menu;

public sealed record BatchUpdateMenusCommand(IReadOnlyList<UpdateMenuItem> Items)
    : ICommand<BatchUpdateMenusResponse>;

internal sealed class BatchUpdateMenusCommandHandler(
    IMenuRepository menuRepository,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider) : ICommandHandler<BatchUpdateMenusCommand, BatchUpdateMenusResponse>
{
    public async Task<Result<BatchUpdateMenusResponse>> Handle(
        BatchUpdateMenusCommand request,
        CancellationToken cancellationToken)
    {
        var updated = new List<MenuResponse>();
        var failures = new List<BatchMenuItemFailure>();
        DateTime utcNow = dateTimeProvider.UtcNow;

        for (int index = 0; index < request.Items.Count; index++)
        {
            UpdateMenuItem item = request.Items[index];
            AppMenu? menu = await menuRepository.GetByIdAsync(item.MenuId, cancellationToken);

            if (menu is null)
            {
                failures.Add(new BatchMenuItemFailure(index, MenuErrors.NotFound.Code, MenuErrors.NotFound.Description));
                continue;
            }

            string menuCode = item.MenuCode.Trim();
            string routePath = item.RoutePath.Trim();

            Result? validation = await BatchCreateMenusCommandHandler.ValidateMenuAsync(
                menuRepository,
                menuCode,
                routePath,
                item.ParentMenuId,
                item.MenuId,
                cancellationToken);

            if (validation is not null)
            {
                failures.Add(new BatchMenuItemFailure(index, validation.Error.Code, validation.Error.Description));
                continue;
            }

            menu.MenuCode = menuCode;
            menu.DisplayName = item.DisplayName.Trim();
            menu.RoutePath = routePath;
            menu.Icon = string.IsNullOrWhiteSpace(item.Icon) ? null : item.Icon.Trim();
            menu.ParentMenuId = item.ParentMenuId;
            menu.SortOrder = item.SortOrder;
            menu.Badge = string.IsNullOrWhiteSpace(item.Badge) ? null : item.Badge.Trim();
            menu.Tooltip = string.IsNullOrWhiteSpace(item.Tooltip) ? null : item.Tooltip.Trim();
            menu.DefaultExpanded = item.DefaultExpanded;
            menu.MenuGroup = BatchCreateMenusCommandHandler.NormalizeMenuGroup(item.MenuGroup);
            menu.IsActive = item.IsActive;
            menu.UpdatedAt = utcNow;
            menu.UpdatedBy = userContext.UserId;

            await menuRepository.UpdateAsync(menu, cancellationToken);
            updated.Add(menu.ToResponse());
        }

        return new BatchUpdateMenusResponse(updated, failures);
    }
}

internal sealed class BatchUpdateMenusCommandValidator : AbstractValidator<BatchUpdateMenusCommand>
{
    public BatchUpdateMenusCommandValidator()
    {
        RuleFor(x => x.Items).NotEmpty();
        RuleFor(x => x.Items.Count).LessThanOrEqualTo(100);
        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(x => x.MenuId).GreaterThan(0);
            item.RuleFor(x => x.MenuCode).NotEmpty().MaximumLength(64);
            item.RuleFor(x => x.DisplayName).NotEmpty().MaximumLength(256);
            item.RuleFor(x => x.RoutePath).NotEmpty().MaximumLength(256);
            item.RuleFor(x => x.Icon).MaximumLength(64);
            item.RuleFor(x => x.Badge).MaximumLength(32);
            item.RuleFor(x => x.Tooltip).MaximumLength(256);
            item.RuleFor(x => x.SortOrder).GreaterThanOrEqualTo(0);
            item.RuleFor(x => x.MenuGroup)
                .Must(MenuGroups.IsValid)
                .WithMessage($"Menu group must be one of: {MenuGroups.Main}, {MenuGroups.Secondary}, {MenuGroups.Config}.");
        });
    }
}
