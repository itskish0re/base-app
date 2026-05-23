namespace Domain.Registry;

public sealed class AppEntityField
{
    public int EntityFieldId { get; set; }

    public int EntityId { get; set; }

    public string FieldName { get; set; } = null!;

    public string DataType { get; set; } = null!;

    public bool Filterable { get; set; } = true;

    public bool Sortable { get; set; } = true;

    public bool Selectable { get; set; } = true;

    public bool Writable { get; set; }

    public bool IsRequired { get; set; }

    public int? MinLength { get; set; }

    public int? MaxLength { get; set; }

    public string? ValidationRegex { get; set; }

    public string? DefaultValue { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public AppEntity Entity { get; set; } = null!;
}
