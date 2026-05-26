using Domain.Registry;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal sealed class AppFieldDataTypeConfiguration : IEntityTypeConfiguration<AppFieldDataType>
{
    public void Configure(EntityTypeBuilder<AppFieldDataType> builder)
    {
        builder.ToTable("app_field_data_type");
        builder.HasKey(x => x.FieldDataTypeId);
        builder.Property(x => x.FieldDataTypeId).HasColumnName("field_data_type_id");
        builder.Property(x => x.TypeCode).HasColumnName("type_code").HasMaxLength(32);
        builder.Property(x => x.DisplayName).HasColumnName("display_name").HasMaxLength(128);
        builder.Property(x => x.Description).HasColumnName("description");
        builder.Property(x => x.SortOrder).HasColumnName("sort_order");
        builder.Property(x => x.IsActive).HasColumnName("is_active");
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");
        builder.HasIndex(x => x.TypeCode).IsUnique();
    }
}
