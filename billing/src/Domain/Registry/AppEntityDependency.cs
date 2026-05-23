namespace Domain.Registry;

public sealed class AppEntityDependency
{
    public int EntityDependencyId { get; set; }

    public int ParentEntityId { get; set; }

    public int ChildEntityId { get; set; }

    public string ChildFkColumn { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public AppEntity ParentEntity { get; set; } = null!;

    public AppEntity ChildEntity { get; set; } = null!;
}
