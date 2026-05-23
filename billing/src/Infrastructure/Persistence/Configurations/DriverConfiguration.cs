using Domain.Masters;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal sealed class DriverConfiguration : IEntityTypeConfiguration<Driver>
{
    public void Configure(EntityTypeBuilder<Driver> builder)
    {
        builder.ToTable("driver");

        builder.HasKey(x => x.DriverId);

        builder.Property(x => x.DriverId)
            .HasColumnName("driver_id")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.Name)
            .HasColumnName("name")
            .HasMaxLength(256)
            .IsRequired();

        builder.Property(x => x.Mobile)
            .HasColumnName("mobile")
            .HasMaxLength(32)
            .IsRequired();

        builder.Property(x => x.TruckId)
            .HasColumnName("truck_id");

        builder.HasOne(x => x.Truck)
            .WithMany(x => x.Drivers)
            .HasForeignKey(x => x.TruckId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_driver_truck_truck_id");

        builder.HasIndex(x => x.TruckId)
            .HasDatabaseName("ix_driver_truck_id");

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
