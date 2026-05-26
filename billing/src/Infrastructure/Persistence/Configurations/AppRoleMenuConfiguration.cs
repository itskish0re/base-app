using Domain.Access;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal sealed class AppRoleMenuConfiguration : IEntityTypeConfiguration<AppRoleMenu>
{
    public void Configure(EntityTypeBuilder<AppRoleMenu> builder)
    {
        builder.ToTable("app_role_menu");

        builder.HasKey(x => new { x.RoleId, x.MenuId });

        builder.Property(x => x.RoleId).HasColumnName("role_id");
        builder.Property(x => x.MenuId).HasColumnName("menu_id");

        builder.Property(x => x.IsEnabled)
            .HasColumnName("is_enabled")
            .HasDefaultValue(true);

        builder.Property(x => x.IsDisplayed)
            .HasColumnName("is_displayed")
            .HasDefaultValue(true);

        builder.Property(x => x.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(x => x.UpdatedAt)
            .HasColumnName("updated_at")
            .IsRequired();

        builder.Property(x => x.CreatedBy).HasColumnName("created_by");
        builder.Property(x => x.UpdatedBy).HasColumnName("updated_by");
    }
}
