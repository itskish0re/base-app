using Domain.Masters;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal sealed class TruckConfiguration : IEntityTypeConfiguration<Truck>
{
    public void Configure(EntityTypeBuilder<Truck> builder)
    {
        builder.ToTable("truck");

        builder.HasKey(x => x.TruckId);

        builder.Property(x => x.TruckId)
            .HasColumnName("truck_id")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.TruckNumber)
            .HasColumnName("truck_number")
            .HasMaxLength(64)
            .IsRequired();

        builder.HasIndex(x => x.TruckNumber)
            .IsUnique()
            .HasDatabaseName("ix_truck_truck_number");

        builder.Property(x => x.NameBoardId)
            .HasColumnName("name_board_id");

        builder.HasOne(x => x.NameBoard)
            .WithMany(x => x.Trucks)
            .HasForeignKey(x => x.NameBoardId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_truck_name_board_name_board_id");

        builder.HasIndex(x => x.NameBoardId)
            .HasDatabaseName("ix_truck_name_board_id");

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
