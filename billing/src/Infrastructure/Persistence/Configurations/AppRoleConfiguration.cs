using Domain.Access;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal sealed class AppRoleConfiguration : IEntityTypeConfiguration<AppRole>
{
    public void Configure(EntityTypeBuilder<AppRole> builder)
    {
        builder.ToTable("app_role");

        builder.HasKey(x => x.RoleId);

        builder.Property(x => x.RoleId)
            .HasColumnName("role_id")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.RoleCode)
            .HasColumnName("role_code")
            .HasMaxLength(64)
            .IsRequired();

        builder.Property(x => x.DisplayName)
            .HasColumnName("display_name")
            .HasMaxLength(256)
            .IsRequired();
    }
}
