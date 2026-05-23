namespace Domain.Registry;

public sealed class AppEntity
{
    public int EntityId { get; set; }

    public string EntityName { get; set; } = null!;

    public string EntityKind { get; set; } = null!;

    public string PersistMode { get; set; } = "ef_core";

    public string TableName { get; set; } = null!;

    public string DisplayName { get; set; } = null!;

    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public int? UpdatedBy { get; set; }

    public ICollection<AppEntityField> Fields { get; set; } = [];
}
