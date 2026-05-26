using Application.Abstractions.Registry;
using Application.Registry.Screen;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

internal sealed class AppEntityScreenRepository(BillingDbContext context) : IAppEntityScreenRepository
{
    public async Task<ScreenMetadataResponse?> GetMetadataByMenuCodeAsync(
        string menuCode,
        CancellationToken cancellationToken = default)
    {
        string normalizedMenuCode = menuCode.Trim();

        var menu = await context.AppMenus
            .AsNoTracking()
            .Where(m => m.MenuCode == normalizedMenuCode && m.IsActive)
            .Select(m => new { m.MenuId, m.MenuCode })
            .FirstOrDefaultAsync(cancellationToken);

        if (menu is null)
        {
            return null;
        }

        var screen = await context.AppEntityScreens
            .AsNoTracking()
            .Where(s => s.MenuId == menu.MenuId && s.IsActive)
            .Select(s => new
            {
                s.EntityScreenId,
                s.MenuId,
                s.EntityId,
                s.Description,
                s.IsActive,
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (screen is null)
        {
            return null;
        }

        var entity = await context.AppEntities
            .AsNoTracking()
            .Where(e => e.EntityId == screen.EntityId)
            .Select(e => new EntitySummaryDto(
                e.EntityId,
                e.EntityName,
                e.EntityKind,
                e.PersistMode,
                e.TableName,
                e.DisplayName,
                e.Description))
            .FirstOrDefaultAsync(cancellationToken);

        if (entity is null)
        {
            return null;
        }

        Task<List<EntityFieldDto>> entityFieldsTask = context.AppEntityFields
            .AsNoTracking()
            .Where(f => f.EntityId == screen.EntityId)
            .OrderBy(f => f.FieldName)
            .Select(f => new EntityFieldDto(
                f.EntityFieldId,
                f.FieldName,
                f.FieldDataType.TypeCode,
                f.Filterable,
                f.Sortable,
                f.Selectable,
                f.Writable,
                f.IsRequired,
                f.MinLength,
                f.MaxLength,
                f.ValidationRegex,
                f.DefaultValue))
            .ToListAsync(cancellationToken);

        Task<List<ScreenColumnDto>> columnsTask = context.AppEntityScreenColumns
            .AsNoTracking()
            .Where(c => c.EntityScreenId == screen.EntityScreenId && c.IsActive)
            .OrderBy(c => c.DisplayOrder)
            .ThenBy(c => c.EntityScreenColumnId)
            .Select(c => new ScreenColumnDto(
                c.EntityScreenColumnId,
                c.EntityFieldId,
                c.EntityField.FieldName,
                c.EntityField.FieldDataType.TypeCode,
                c.DisplayLabel,
                c.IsVisible,
                c.DisplayOrder,
                c.ColumnWidth,
                c.MinWidth,
                c.IsPinned,
                c.Align,
                c.ColumnComponent,
                c.AllowSort,
                c.IsActive))
            .ToListAsync(cancellationToken);

        Task<List<ScreenFormFieldDto>> formFieldsTask = context.AppEntityScreenFields
            .AsNoTracking()
            .Where(f => f.EntityScreenId == screen.EntityScreenId && f.IsActive)
            .OrderBy(f => f.DisplayOrder)
            .ThenBy(f => f.EntityScreenFieldId)
            .Select(f => new ScreenFormFieldDto(
                f.EntityScreenFieldId,
                f.EntityFieldId,
                f.EntityField.FieldName,
                f.EntityField.FieldDataType.TypeCode,
                f.DisplayLabel,
                f.IsVisible,
                f.DisplayOrder,
                f.FieldComponent,
                f.IsReadOnly,
                f.IsActive))
            .ToListAsync(cancellationToken);

        await Task.WhenAll(entityFieldsTask, columnsTask, formFieldsTask);

        return new ScreenMetadataResponse(
            new ScreenSummaryDto(
                screen.EntityScreenId,
                screen.MenuId,
                menu.MenuCode,
                screen.Description,
                screen.IsActive),
            entity,
            await entityFieldsTask,
            await columnsTask,
            await formFieldsTask);
    }
}
