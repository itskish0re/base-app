namespace Domain.Registry;

public sealed class AppFieldDataType
{
    public int FieldDataTypeId { get; set; }

    public string TypeCode { get; set; } = null!;

    public string DisplayName { get; set; } = null!;

    public string? Description { get; set; }

    public int SortOrder { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public ICollection<AppEntityField> EntityFields { get; set; } = [];
}
