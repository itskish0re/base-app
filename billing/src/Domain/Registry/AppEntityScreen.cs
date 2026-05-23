namespace Domain.Registry;

public sealed class AppEntityScreen
{
    public int EntityScreenId { get; set; }

    public int EntityId { get; set; }

    public int MenuId { get; set; }

    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public int? UpdatedBy { get; set; }

    public AppEntity Entity { get; set; } = null!;

    public ICollection<AppEntityScreenColumn> Columns { get; set; } = [];

    public ICollection<AppEntityScreenField> Fields { get; set; } = [];
}
