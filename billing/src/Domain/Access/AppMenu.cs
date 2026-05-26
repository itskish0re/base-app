namespace Domain.Access;

public sealed class AppMenu
{
    public int MenuId { get; set; }

    public string MenuCode { get; set; } = null!;

    public string DisplayName { get; set; } = null!;

    public string RoutePath { get; set; } = null!;

    public string? Icon { get; set; }

    public int? ParentMenuId { get; set; }

    public int SortOrder { get; set; }

    public string? Badge { get; set; }

    public string? Tooltip { get; set; }

    public bool DefaultExpanded { get; set; } = true;

    /// <summary>Sidebar section: main, secondary, or config.</summary>
    public string MenuGroup { get; set; } = MenuGroups.Main;

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public int? UpdatedBy { get; set; }
}
