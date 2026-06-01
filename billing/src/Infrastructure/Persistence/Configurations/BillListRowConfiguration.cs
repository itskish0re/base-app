using Domain.Transactions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal sealed class BillListRowConfiguration : IEntityTypeConfiguration<BillListRow>
{
    public void Configure(EntityTypeBuilder<BillListRow> builder)
    {
        builder.HasNoKey();
        builder.ToView("v_bills");

        builder.Property(x => x.BillId).HasColumnName("bill_id");
        builder.Property(x => x.BillNumber).HasColumnName("bill_number");
        builder.Property(x => x.BillDate).HasColumnName("bill_date");
        builder.Property(x => x.FromId).HasColumnName("from_id");
        builder.Property(x => x.FromLocationName).HasColumnName("from_location_name");
        builder.Property(x => x.TruckId).HasColumnName("truck_id");
        builder.Property(x => x.TruckNumber).HasColumnName("truck_number");
        builder.Property(x => x.NameBoardName).HasColumnName("name_board_name");
        builder.Property(x => x.OwnerName).HasColumnName("owner_name");
        builder.Property(x => x.OwnerMobile).HasColumnName("owner_mobile");
        builder.Property(x => x.DriverName).HasColumnName("driver_name");
        builder.Property(x => x.DriverMobile).HasColumnName("driver_mobile");
        builder.Property(x => x.TotalFreight).HasColumnName("total_freight");
        builder.Property(x => x.Commission).HasColumnName("commission");
        builder.Property(x => x.Crossing).HasColumnName("crossing");
        builder.Property(x => x.HandLoan).HasColumnName("hand_loan");
        builder.Property(x => x.TruckLoan).HasColumnName("truck_loan");
        builder.Property(x => x.OfficeMamul).HasColumnName("office_mamul");
        builder.Property(x => x.TapalMamul).HasColumnName("tapal_mamul");
        builder.Property(x => x.Diesel).HasColumnName("diesel");
        builder.Property(x => x.Others).HasColumnName("others");
        builder.Property(x => x.Total).HasColumnName("total");
        builder.Property(x => x.IsCancelled).HasColumnName("is_cancelled");
        builder.Property(x => x.FinancialYearId).HasColumnName("financial_year_id");
    }
}
