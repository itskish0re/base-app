using Application.Abstractions.Authentication;
using Application.Abstractions.Messaging;
using Domain.Access;
using FluentValidation;
using SharedKernel;

namespace Application.Access.Menu;

public sealed record BatchCreateMenusCommand(IReadOnlyList<CreateMenuItem> Items)
    : ICommand<BatchCreateMenusResponse>;

internal sealed class BatchCreateMenusCommandHandler(
    IMenuRepository menuRepository,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider) : ICommandHandler<BatchCreateMenusCommand, BatchCreateMenusResponse>
{
    public async Task<Result<BatchCreateMenusResponse>> Handle(
        BatchCreateMenusCommand request,
        CancellationToken cancellationToken)
    {
        var created = new List<MenuResponse>();
        var failures = new List<BatchMenuItemFailure>();
        var codesInBatch = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var routesInBatch = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        DateTime utcNow = dateTimeProvider.UtcNow;

        for (int index = 0; index < request.Items.Count; index++)
        {
            CreateMenuItem item = request.Items[index];
            string menuCode = item.MenuCode.Trim();
            string routePath = item.RoutePath.Trim();

            if (!codesInBatch.Add(menuCode))
            {
                failures.Add(new BatchMenuItemFailure(index, MenuErrors.MenuCodeNotUnique.Code, "Duplicate menu code in request batch."));
                continue;
            }

            if (!routesInBatch.Add(routePath))
            {
                failures.Add(new BatchMenuItemFailure(index, MenuErrors.RoutePathNotUnique.Code, "Duplicate route path in request batch."));
                continue;
            }

            Result? validation = await ValidateMenuAsync(
                menuRepository,
                menuCode,
                routePath,
                item.ParentMenuId,
                excludeMenuId: null,
                cancellationToken);

            if (validation is not null)
            {
                failures.Add(new BatchMenuItemFailure(index, validation.Error.Code, validation.Error.Description));
                continue;
            }

            var menu = new AppMenu
            {
                MenuCode = menuCode,
                DisplayName = item.DisplayName.Trim(),
                RoutePath = routePath,
                Icon = string.IsNullOrWhiteSpace(item.Icon) ? null : item.Icon.Trim(),
                ParentMenuId = item.ParentMenuId,
                SortOrder = item.SortOrder,
                Badge = string.IsNullOrWhiteSpace(item.Badge) ? null : item.Badge.Trim(),
                Tooltip = string.IsNullOrWhiteSpace(item.Tooltip) ? null : item.Tooltip.Trim(),
                DefaultExpanded = item.DefaultExpanded,
                MenuGroup = NormalizeMenuGroup(item.MenuGroup),
                IsActive = true,
                CreatedAt = utcNow,
                UpdatedAt = utcNow,
                CreatedBy = userContext.UserId,
                UpdatedBy = userContext.UserId,
            };

            menu.MenuId = await menuRepository.InsertAsync(menu, cancellationToken);
            created.Add(menu.ToResponse());
        }

        return new BatchCreateMenusResponse(created, failures);
    }

    internal static async Task<Result?> ValidateMenuAsync(
        IMenuRepository menuRepository,
        string menuCode,
        string routePath,
        int? parentMenuId,
        int? excludeMenuId,
        CancellationToken cancellationToken)
    {
        if (await menuRepository.ExistsByMenuCodeAsync(menuCode, excludeMenuId, cancellationToken))
        {
            return Result.Failure(MenuErrors.MenuCodeNotUnique);
        }

        if (await menuRepository.ExistsByRoutePathAsync(routePath, excludeMenuId, cancellationToken))
        {
            return Result.Failure(MenuErrors.RoutePathNotUnique);
        }

        if (parentMenuId is int parentId)
        {
            if (excludeMenuId == parentId)
            {
                return Result.Failure(MenuErrors.InvalidParent);
            }

            if (!await menuRepository.ExistsParentAsync(parentId, cancellationToken))
            {
                return Result.Failure(MenuErrors.ParentNotFound);
            }
        }

        return null;
    }

    internal static string NormalizeMenuGroup(string? menuGroup)
    {
        if (string.IsNullOrWhiteSpace(menuGroup))
        {
            return MenuGroups.Main;
        }

        string normalized = menuGroup.Trim().ToLowerInvariant();
        if (normalized == "projects")
        {
            return MenuGroups.Config;
        }

        return MenuGroups.IsValid(normalized) ? normalized : MenuGroups.Main;
    }
}

internal sealed class BatchCreateMenusCommandValidator : AbstractValidator<BatchCreateMenusCommand>
{
    public BatchCreateMenusCommandValidator()
    {
        RuleFor(x => x.Items).NotEmpty().WithMessage("At least one menu is required.");
        RuleFor(x => x.Items.Count).LessThanOrEqualTo(100);
        RuleForEach(x => x.Items).ChildRules(item =>
        {
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
