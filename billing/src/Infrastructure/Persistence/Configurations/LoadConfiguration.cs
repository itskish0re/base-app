using Domain.Transactions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal sealed class LoadConfiguration : IEntityTypeConfiguration<Load>
{
    public void Configure(EntityTypeBuilder<Load> builder)
    {
        builder.ToTable("loads");

        builder.HasKey(x => x.LoadId);

        builder.Property(x => x.LoadId)
            .HasColumnName("load_id")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.BillId).HasColumnName("bill_id");
        builder.Property(x => x.LoadNumber).HasColumnName("load_number");

        builder.Property(x => x.PartyId).HasColumnName("party_id");
        builder.Property(x => x.ToId).HasColumnName("to_id");
        builder.Property(x => x.GoodsId).HasColumnName("goods_id");
        builder.Property(x => x.UnitId).HasColumnName("unit_id");

        builder.Property(x => x.WeightOrQuantity)
            .HasColumnName("weight_or_quantity")
            .HasPrecision(18, 3);

        ConfigureMoney(builder.Property(x => x.RatePerUnit), "rate_per_unit");
        ConfigureMoney(builder.Property(x => x.Freight), "freight");
        ConfigureMoney(builder.Property(x => x.Advance), "advance");
        ConfigureMoney(builder.Property(x => x.Topay), "topay");
        ConfigureMoney(builder.Property(x => x.Balance), "balance");

        builder.Property(x => x.FinancialYearId).HasColumnName("financial_year_id");

        builder.HasIndex(x => x.BillId).HasDatabaseName("ix_loads_bill_id");
        builder.HasIndex(x => x.FinancialYearId).HasDatabaseName("ix_loads_financial_year_id");

        builder.HasIndex(x => new { x.BillId, x.LoadNumber })
            .IsUnique()
            .HasFilter("is_active = true")
            .HasDatabaseName("ux_loads_bill_id_load_number_active");

        ConfigureAudit(builder);
    }

    private static void ConfigureMoney(PropertyBuilder<decimal> property, string columnName)
    {
        property.HasColumnName(columnName).HasPrecision(18, 2);
    }

    private static void ConfigureAudit(EntityTypeBuilder<Load> builder)
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
