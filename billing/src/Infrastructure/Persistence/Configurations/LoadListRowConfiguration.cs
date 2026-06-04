using Domain.Transactions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal sealed class LoadListRowConfiguration : IEntityTypeConfiguration<LoadListRow>
{
    public void Configure(EntityTypeBuilder<LoadListRow> builder)
    {
        builder.HasNoKey();
        builder.ToView("v_loads");

        builder.Property(x => x.LoadId).HasColumnName("load_id");
        builder.Property(x => x.BillId).HasColumnName("bill_id");
        builder.Property(x => x.BillNumber).HasColumnName("bill_number");
        builder.Property(x => x.LoadNumber).HasColumnName("load_number");
        builder.Property(x => x.ConsignorId).HasColumnName("consignor_id");
        builder.Property(x => x.ConsignorName).HasColumnName("consignor_name");
        builder.Property(x => x.ConsigneeId).HasColumnName("consignee_id");
        builder.Property(x => x.ConsigneeName).HasColumnName("consignee_name");
        builder.Property(x => x.AsPerBill).HasColumnName("as_per_bill");
        builder.Property(x => x.ToId).HasColumnName("to_id");
        builder.Property(x => x.ToLocationName).HasColumnName("to_location_name");
        builder.Property(x => x.GoodsId).HasColumnName("goods_id");
        builder.Property(x => x.GoodsName).HasColumnName("goods_name");
        builder.Property(x => x.UnitId).HasColumnName("unit_id");
        builder.Property(x => x.UnitName).HasColumnName("unit_name");
        builder.Property(x => x.WeightOrQuantity).HasColumnName("weight_or_quantity");
        builder.Property(x => x.RatePerUnit).HasColumnName("rate_per_unit");
        builder.Property(x => x.Freight).HasColumnName("freight");
        builder.Property(x => x.Advance).HasColumnName("advance");
        builder.Property(x => x.Topay).HasColumnName("topay");
        builder.Property(x => x.Balance).HasColumnName("balance");
        builder.Property(x => x.IsActive).HasColumnName("is_active");
        builder.Property(x => x.FinancialYearId).HasColumnName("financial_year_id");
    }
}
