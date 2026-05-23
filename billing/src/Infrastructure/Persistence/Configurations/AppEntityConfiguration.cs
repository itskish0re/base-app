using Domain.Registry;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal sealed class AppEntityConfiguration : IEntityTypeConfiguration<AppEntity>
{
    public void Configure(EntityTypeBuilder<AppEntity> builder)
    {
        builder.ToTable("app_entity");
        builder.HasKey(x => x.EntityId);
        builder.Property(x => x.EntityId).HasColumnName("entity_id");
        builder.Property(x => x.EntityName).HasColumnName("entity_name").HasMaxLength(128);
        builder.Property(x => x.EntityKind).HasColumnName("entity_kind").HasMaxLength(32);
        builder.Property(x => x.PersistMode).HasColumnName("persist_mode").HasMaxLength(32);
        builder.Property(x => x.TableName).HasColumnName("table_name").HasMaxLength(128);
        builder.Property(x => x.DisplayName).HasColumnName("display_name").HasMaxLength(256);
        builder.Property(x => x.Description).HasColumnName("description");
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");
        builder.Property(x => x.CreatedBy).HasColumnName("created_by");
        builder.Property(x => x.UpdatedBy).HasColumnName("updated_by");
        builder.HasIndex(x => x.EntityName).IsUnique();
        builder.HasIndex(x => x.TableName).IsUnique();
    }
}
