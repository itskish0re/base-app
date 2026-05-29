namespace Domain.Registry;

public sealed class AppEntityScreenColumn
{
    public int EntityScreenColumnId { get; set; }

    public int EntityScreenId { get; set; }

    public int EntityFieldId { get; set; }

    public string? DisplayLabel { get; set; }

    public bool IsVisible { get; set; } = true;

    public int DisplayOrder { get; set; }

    /// <summary>Share of the grid base width (100). Sum across columns may exceed 100 for horizontal scroll.</summary>
    public int? ColumnWidthPercent { get; set; }

    public bool IsPinned { get; set; }

    public string Align { get; set; } = "left";

    public string? ColumnComponent { get; set; }

    public bool? AllowSort { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public AppEntityScreen Screen { get; set; } = null!;

    public AppEntityField EntityField { get; set; } = null!;
}
