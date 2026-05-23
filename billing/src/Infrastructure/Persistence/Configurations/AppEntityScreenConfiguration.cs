using Domain.Registry;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal sealed class AppEntityScreenConfiguration : IEntityTypeConfiguration<AppEntityScreen>
{
    public void Configure(EntityTypeBuilder<AppEntityScreen> builder)
    {
        builder.ToTable("app_entity_screen");
        builder.HasKey(x => x.EntityScreenId);
        builder.Property(x => x.EntityScreenId).HasColumnName("entity_screen_id");
        builder.Property(x => x.EntityId).HasColumnName("entity_id");
        builder.Property(x => x.MenuId).HasColumnName("menu_id");
        builder.Property(x => x.Description).HasColumnName("description");
        builder.Property(x => x.IsActive).HasColumnName("is_active");
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");
        builder.Property(x => x.CreatedBy).HasColumnName("created_by");
        builder.Property(x => x.UpdatedBy).HasColumnName("updated_by");
        builder.HasIndex(x => x.MenuId).IsUnique();
        builder.HasIndex(x => new { x.EntityId, x.MenuId }).IsUnique();
        builder.HasOne(x => x.Entity).WithMany().HasForeignKey(x => x.EntityId);
    }
}
