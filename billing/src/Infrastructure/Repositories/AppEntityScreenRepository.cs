using Application.Abstractions.Registry;
using Application.Common;
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

        EntityMetadataDto? entity = await context.AppEntities
            .AsNoTracking()
            .Where(e => e.EntityId == screen.EntityId)
            .Select(e => new EntityMetadataDto(
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

        List<EntityFieldMetadataDto> entityFields = await context.AppEntityFields
            .AsNoTracking()
            .Where(f => f.EntityId == screen.EntityId)
            .OrderBy(f => f.FieldName)
            .Select(f => new EntityFieldMetadataDto(
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

        entityFields = entityFields
            .Select(f => f with { FieldName = FieldNameConverter.ToCamelCase(f.FieldName) })
            .ToList();

        List<ScreenColumnMetadataDto> columns = await context.AppEntityScreenColumns
            .AsNoTracking()
            .Where(c => c.EntityScreenId == screen.EntityScreenId && c.IsActive)
            .OrderBy(c => c.DisplayOrder)
            .ThenBy(c => c.EntityScreenColumnId)
            .Select(c => new ScreenColumnMetadataDto(
                c.EntityScreenColumnId,
                c.EntityFieldId,
                c.EntityField.FieldName,
                c.EntityField.FieldDataType.TypeCode,
                c.DisplayLabel,
                c.IsVisible,
                c.DisplayOrder,
                c.ColumnWidthPercent,
                c.IsPinned,
                c.Align,
                c.ColumnComponent,
                c.AllowSort,
                c.IsActive))
            .ToListAsync(cancellationToken);

        columns = columns
            .Select(c => c with { FieldName = FieldNameConverter.ToCamelCase(c.FieldName) })
            .ToList();

        List<ScreenFormFieldMetadataDto> formFields = await context.AppEntityScreenFields
            .AsNoTracking()
            .Where(f => f.EntityScreenId == screen.EntityScreenId && f.IsActive)
            .OrderBy(f => f.DisplayOrder)
            .ThenBy(f => f.EntityScreenFieldId)
            .Select(f => new ScreenFormFieldMetadataDto(
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

        formFields = formFields
            .Select(f => f with { FieldName = FieldNameConverter.ToCamelCase(f.FieldName) })
            .ToList();

        var entityBundle = new EntityScreenMetadataDto(entity, entityFields, columns, formFields);

        return new ScreenMetadataResponse(
            new ScreenMetadataDto(
                screen.EntityScreenId,
                screen.MenuId,
                menu.MenuCode,
                screen.Description,
                screen.IsActive),
            [entityBundle]);
    }
}
