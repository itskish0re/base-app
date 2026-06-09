using Domain.Transactions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal sealed class BillConfiguration : IEntityTypeConfiguration<Bill>
{
    public void Configure(EntityTypeBuilder<Bill> builder)
    {
        builder.ToTable("bills");

        builder.HasKey(x => x.BillId);

        builder.Property(x => x.BillId)
            .HasColumnName("bill_id")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.BillNumber)
            .HasColumnName("bill_number")
            .HasMaxLength(64)
            .IsRequired();

        builder.Property(x => x.BillDate)
            .HasColumnName("bill_date")
            .IsRequired();

        builder.Property(x => x.FromId).HasColumnName("from_id");
        builder.Property(x => x.TruckId).HasColumnName("truck_id");

        builder.Property(x => x.DriverName)
            .HasColumnName("driver_name")
            .HasMaxLength(256)
            .IsRequired();

        builder.Property(x => x.DriverMobile)
            .HasColumnName("driver_mobile")
            .HasMaxLength(32);

        ConfigureMoney(builder.Property(x => x.TotalFreight), "total_freight");
        ConfigureMoney(builder.Property(x => x.Commission), "commission");
        ConfigureMoney(builder.Property(x => x.Crossing), "crossing");
        ConfigureMoney(builder.Property(x => x.HandLoan), "hand_loan");
        builder.Property(x => x.TruckLoan)
            .HasColumnName("truck_loan")
            .HasDefaultValue(false);
        builder.Property(x => x.PayBy)
            .HasColumnName("pay_by")
            .HasMaxLength(16);
        builder.Property(x => x.PaidName)
            .HasColumnName("paid_name")
            .HasMaxLength(256);
        builder.Property(x => x.PaidMobile)
            .HasColumnName("paid_mobile")
            .HasMaxLength(32);
        ConfigureMoney(builder.Property(x => x.OfficeMamul), "office_mamul");
        ConfigureMoney(builder.Property(x => x.TapalMamul), "tapal_mamul");
        ConfigureMoney(builder.Property(x => x.Diesel), "diesel");
        builder.Property(x => x.Others)
            .HasColumnName("others")
            .HasColumnType("jsonb")
            .HasDefaultValueSql("'[]'::jsonb");
        ConfigureMoney(builder.Property(x => x.Total), "total");

        builder.Property(x => x.IsCancelled)
            .HasColumnName("is_cancelled")
            .HasDefaultValue(false);

        builder.Property(x => x.FinancialYearId).HasColumnName("financial_year_id");

        builder.HasIndex(x => new { x.FinancialYearId, x.BillNumber })
            .IsUnique()
            .HasDatabaseName("ux_bills_financial_year_id_bill_number");

        builder.HasIndex(x => x.FinancialYearId)
            .HasDatabaseName("ix_bills_financial_year_id");

        builder.HasIndex(x => x.FromId).HasDatabaseName("ix_bills_from_id");
        builder.HasIndex(x => x.TruckId).HasDatabaseName("ix_bills_truck_id");

        builder.HasMany(x => x.Loads)
            .WithOne(x => x.Bill)
            .HasForeignKey(x => x.BillId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("fk_loads_bills_bill_id");

        ConfigureAudit(builder);
    }

    private static void ConfigureMoney(PropertyBuilder<decimal> property, string columnName)
    {
        property.HasColumnName(columnName).HasPrecision(18, 2);
    }

    private static void ConfigureAudit(EntityTypeBuilder<Bill> builder)
    {
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
