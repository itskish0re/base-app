namespace Application.Registry.Screen;

public sealed record ScreenMetadataResponse(
    ScreenMetadataDto Screen,
    IReadOnlyList<EntityScreenMetadataDto> Entities);

/// <summary>One entity bound to a screen with its grid columns, form fields, and field registry.</summary>
public sealed record EntityScreenMetadataDto(
    EntityMetadataDto Entity,
    IReadOnlyList<EntityFieldMetadataDto> EntityFields,
    IReadOnlyList<ScreenColumnMetadataDto> Columns,
    IReadOnlyList<ScreenFormFieldMetadataDto> FormFields);

public sealed record ScreenMetadataDto(
    int EntityScreenId,
    int MenuId,
    string MenuCode,
    string? Description,
    bool IsActive);

public sealed record EntityMetadataDto(
    int EntityId,
    string EntityName,
    string EntityKind,
    string PersistMode,
    string TableName,
    string DisplayName,
    string? Description);

public sealed record EntityFieldMetadataDto(
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

public sealed record ScreenColumnMetadataDto(
    int EntityScreenColumnId,
    int EntityFieldId,
    string FieldName,
    string DataType,
    string? DisplayLabel,
    bool IsVisible,
    bool IsImportant,
    int DisplayOrder,
    int? ColumnWidthPercent,
    bool IsPinned,
    string Align,
    string? ColumnComponent,
    bool? AllowSort,
    bool IsActive);

public sealed record ScreenFormFieldMetadataDto(
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
