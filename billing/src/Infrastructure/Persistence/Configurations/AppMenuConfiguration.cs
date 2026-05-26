using Domain.Access;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal sealed class AppMenuConfiguration : IEntityTypeConfiguration<AppMenu>
{
    public void Configure(EntityTypeBuilder<AppMenu> builder)
    {
        builder.ToTable("app_menu");

        builder.HasKey(x => x.MenuId);

        builder.Property(x => x.MenuId)
            .HasColumnName("menu_id")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.MenuCode)
            .HasColumnName("menu_code")
            .HasMaxLength(64)
            .IsRequired();

        builder.HasIndex(x => x.MenuCode)
            .IsUnique()
            .HasDatabaseName("ix_app_menu_menu_code");

        builder.Property(x => x.DisplayName)
            .HasColumnName("display_name")
            .HasMaxLength(256)
            .IsRequired();

        builder.Property(x => x.RoutePath)
            .HasColumnName("route_path")
            .HasMaxLength(256)
            .IsRequired();

        builder.HasIndex(x => x.RoutePath)
            .IsUnique()
            .HasDatabaseName("ix_app_menu_route_path");

        builder.Property(x => x.Icon)
            .HasColumnName("icon")
            .HasMaxLength(64);

        builder.Property(x => x.ParentMenuId)
            .HasColumnName("parent_menu_id");

        builder.Property(x => x.SortOrder)
            .HasColumnName("sort_order")
            .HasDefaultValue(0);

        builder.Property(x => x.Badge)
            .HasColumnName("badge")
            .HasMaxLength(32);

        builder.Property(x => x.Tooltip)
            .HasColumnName("tooltip")
            .HasMaxLength(256);

        builder.Property(x => x.DefaultExpanded)
            .HasColumnName("default_expanded")
            .HasDefaultValue(true);

        builder.Property(x => x.MenuGroup)
            .HasColumnName("menu_group")
            .HasMaxLength(32)
            .HasDefaultValue(MenuGroups.Main)
            .IsRequired();

        builder.Property(x => x.IsActive)
            .HasColumnName("is_active")
            .HasDefaultValue(true);

        builder.Property(x => x.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(x => x.UpdatedAt)
            .HasColumnName("updated_at")
            .IsRequired();

        builder.Property(x => x.CreatedBy)
            .HasColumnName("created_by");

        builder.Property(x => x.UpdatedBy)
            .HasColumnName("updated_by");

        builder.HasOne<AppMenu>()
            .WithMany()
            .HasForeignKey(x => x.ParentMenuId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
