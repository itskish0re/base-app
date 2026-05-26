namespace Application.Registry.Screen;

public sealed record ScreenMetadataResponse(
    ScreenSummaryDto Screen,
    EntitySummaryDto Entity,
    IReadOnlyList<EntityFieldDto> EntityFields,
    IReadOnlyList<ScreenColumnDto> Columns,
    IReadOnlyList<ScreenFormFieldDto> FormFields);

public sealed record ScreenSummaryDto(
    int EntityScreenId,
    int MenuId,
    string MenuCode,
    string? Description,
    bool IsActive);

public sealed record EntitySummaryDto(
    int EntityId,
    string EntityName,
    string EntityKind,
    string PersistMode,
    string TableName,
    string DisplayName,
    string? Description);

public sealed record EntityFieldDto(
    int EntityFieldId,
    string FieldName,
    string DataType,
    bool Filterable,
    bool Sortable,
    bool Selectable,
    bool Writable,
    bool IsRequired,
    int? MinLength,
    int? MaxLength,
    string? ValidationRegex,
    string? DefaultValue);

public sealed record ScreenColumnDto(
    int EntityScreenColumnId,
    int EntityFieldId,
    string FieldName,
    string DataType,
    string? DisplayLabel,
    bool IsVisible,
    int DisplayOrder,
    int? ColumnWidth,
    int? MinWidth,
    bool IsPinned,
    string Align,
    string? ColumnComponent,
    bool? AllowSort,
    bool IsActive);

public sealed record ScreenFormFieldDto(
    int EntityScreenFieldId,
    int EntityFieldId,
    string FieldName,
    string DataType,
    string? DisplayLabel,
    bool IsVisible,
    int DisplayOrder,
    string? FieldComponent,
    bool IsReadOnly,
    bool IsActive);
