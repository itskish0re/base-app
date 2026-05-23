using Domain.Masters;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal sealed class NameBoardConfiguration : IEntityTypeConfiguration<NameBoard>
{
    public void Configure(EntityTypeBuilder<NameBoard> builder)
    {
        builder.ToTable("name_board");

        builder.HasKey(x => x.NameBoardId);

        builder.Property(x => x.NameBoardId)
            .HasColumnName("name_board_id")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.Name)
            .HasColumnName("name")
            .HasMaxLength(256)
            .IsRequired();

        builder.Property(x => x.Code)
            .HasColumnName("code")
            .HasMaxLength(64)
            .IsRequired();

        builder.HasIndex(x => x.Code)
            .IsUnique()
            .HasDatabaseName("ix_name_board_code");

        builder.Property(x => x.OwnerName)
            .HasColumnName("owner_name")
            .HasMaxLength(256)
            .IsRequired();

        builder.Property(x => x.OwnerPhone)
            .HasColumnName("owner_phone")
            .HasMaxLength(32);

        builder.Property(x => x.IsEnabled).HasColumnName("is_enabled").HasDefaultValue(true);
        builder.Property(x => x.IsActive).HasColumnName("is_active").HasDefaultValue(true);
        builder.Property(x => x.IsDeleted).HasColumnName("is_deleted").HasDefaultValue(false);
        builder.Property(x => x.DeletedAt).HasColumnName("deleted_at");
        builder.Property(x => x.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at").IsRequired();
        builder.Property(x => x.CreatedBy).HasColumnName("created_by");
        builder.Property(x => x.UpdatedBy).HasColumnName("updated_by");
    }
}
