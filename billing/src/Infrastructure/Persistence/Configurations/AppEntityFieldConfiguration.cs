using Domain.Registry;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal sealed class AppEntityFieldConfiguration : IEntityTypeConfiguration<AppEntityField>
{
    public void Configure(EntityTypeBuilder<AppEntityField> builder)
    {
        builder.ToTable("app_entity_field");
        builder.HasKey(x => x.EntityFieldId);
        builder.Property(x => x.EntityFieldId).HasColumnName("entity_field_id");
        builder.Property(x => x.EntityId).HasColumnName("entity_id");
        builder.Property(x => x.FieldName).HasColumnName("field_name").HasMaxLength(128);
        builder.Property(x => x.DataType).HasColumnName("data_type").HasMaxLength(32);
        builder.Property(x => x.Filterable).HasColumnName("filterable");
        builder.Property(x => x.Sortable).HasColumnName("sortable");
        builder.Property(x => x.Selectable).HasColumnName("selectable");
        builder.Property(x => x.Writable).HasColumnName("writable");
        builder.Property(x => x.IsRequired).HasColumnName("is_required");
        builder.Property(x => x.MinLength).HasColumnName("min_length");
        builder.Property(x => x.MaxLength).HasColumnName("max_length");
        builder.Property(x => x.ValidationRegex).HasColumnName("validation_regex");
        builder.Property(x => x.DefaultValue).HasColumnName("default_value");
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");
        builder.HasIndex(x => new { x.EntityId, x.FieldName }).IsUnique();
        builder.HasOne(x => x.Entity).WithMany(x => x.Fields).HasForeignKey(x => x.EntityId);
    }
}
