using Domain.Registry;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal sealed class AppEntityDependencyConfiguration : IEntityTypeConfiguration<AppEntityDependency>
{
    public void Configure(EntityTypeBuilder<AppEntityDependency> builder)
    {
        builder.ToTable("app_entity_dependency");
        builder.HasKey(x => x.EntityDependencyId);
        builder.Property(x => x.EntityDependencyId).HasColumnName("entity_dependency_id");
        builder.Property(x => x.ParentEntityId).HasColumnName("parent_entity_id");
        builder.Property(x => x.ChildEntityId).HasColumnName("child_entity_id");
        builder.Property(x => x.ChildFkColumn).HasColumnName("child_fk_column").HasMaxLength(128);
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.HasIndex(x => new { x.ParentEntityId, x.ChildEntityId }).IsUnique();
        builder.HasOne(x => x.ParentEntity).WithMany().HasForeignKey(x => x.ParentEntityId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(x => x.ChildEntity).WithMany().HasForeignKey(x => x.ChildEntityId).OnDelete(DeleteBehavior.Restrict);
    }
}
