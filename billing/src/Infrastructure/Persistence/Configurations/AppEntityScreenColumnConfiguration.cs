using Domain.Registry;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal sealed class AppEntityScreenColumnConfiguration : IEntityTypeConfiguration<AppEntityScreenColumn>
{
    public void Configure(EntityTypeBuilder<AppEntityScreenColumn> builder)
    {
        builder.ToTable("app_entity_screen_column");
        builder.HasKey(x => x.EntityScreenColumnId);
        builder.Property(x => x.EntityScreenColumnId).HasColumnName("entity_screen_column_id");
        builder.Property(x => x.EntityScreenId).HasColumnName("entity_screen_id");
        builder.Property(x => x.EntityFieldId).HasColumnName("entity_field_id");
        builder.Property(x => x.DisplayLabel).HasColumnName("display_label");
        builder.Property(x => x.IsVisible).HasColumnName("is_visible");
        builder.Property(x => x.DisplayOrder).HasColumnName("display_order");
        builder.Property(x => x.ColumnWidth).HasColumnName("column_width");
        builder.Property(x => x.MinWidth).HasColumnName("min_width");
        builder.Property(x => x.IsPinned).HasColumnName("is_pinned");
        builder.Property(x => x.Align).HasColumnName("align").HasMaxLength(16);
        builder.Property(x => x.FormatHint).HasColumnName("format_hint").HasMaxLength(32);
        builder.Property(x => x.AllowSort).HasColumnName("allow_sort");
        builder.Property(x => x.IsActive).HasColumnName("is_active");
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");
        builder.HasIndex(x => new { x.EntityScreenId, x.EntityFieldId }).IsUnique();
        builder.HasOne(x => x.Screen).WithMany(x => x.Columns).HasForeignKey(x => x.EntityScreenId);
        builder.HasOne(x => x.EntityField).WithMany().HasForeignKey(x => x.EntityFieldId);
    }
}
