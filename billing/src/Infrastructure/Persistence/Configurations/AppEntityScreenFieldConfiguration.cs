using Domain.Registry;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal sealed class AppEntityScreenFieldConfiguration : IEntityTypeConfiguration<AppEntityScreenField>
{
    public void Configure(EntityTypeBuilder<AppEntityScreenField> builder)
    {
        builder.ToTable("app_entity_screen_field");
        builder.HasKey(x => x.EntityScreenFieldId);
        builder.Property(x => x.EntityScreenFieldId).HasColumnName("entity_screen_field_id");
        builder.Property(x => x.EntityScreenId).HasColumnName("entity_screen_id");
        builder.Property(x => x.EntityFieldId).HasColumnName("entity_field_id");
        builder.Property(x => x.DisplayLabel).HasColumnName("display_label");
        builder.Property(x => x.IsVisible).HasColumnName("is_visible");
        builder.Property(x => x.DisplayOrder).HasColumnName("display_order");
        builder.Property(x => x.FormatHint).HasColumnName("format_hint").HasMaxLength(32);
        builder.Property(x => x.IsReadOnly).HasColumnName("is_read_only");
        builder.Property(x => x.IsActive).HasColumnName("is_active");
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");
        builder.HasIndex(x => new { x.EntityScreenId, x.EntityFieldId }).IsUnique();
        builder.HasOne(x => x.Screen).WithMany(x => x.Fields).HasForeignKey(x => x.EntityScreenId);
        builder.HasOne(x => x.EntityField).WithMany().HasForeignKey(x => x.EntityFieldId);
    }
}
