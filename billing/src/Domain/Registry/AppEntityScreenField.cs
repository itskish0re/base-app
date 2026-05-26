namespace Domain.Registry;

public sealed class AppEntityScreenField
{
    public int EntityScreenFieldId { get; set; }

    public int EntityScreenId { get; set; }

    public int EntityFieldId { get; set; }

    public string? DisplayLabel { get; set; }

    public bool IsVisible { get; set; } = true;

    public int DisplayOrder { get; set; }

    public string? FieldComponent { get; set; }

    public bool IsReadOnly { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public AppEntityScreen Screen { get; set; } = null!;

    public AppEntityField EntityField { get; set; } = null!;
}
