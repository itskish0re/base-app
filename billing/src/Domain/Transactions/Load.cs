using Domain.Platform;

namespace Domain.Transactions;

public sealed class Load : AuditableEntity
{
    public int LoadId { get; set; }

    public int BillId { get; set; }

    public int LoadNumber { get; set; }

    public int ConsignorId { get; set; }

    public int ConsigneeId { get; set; }

    public bool AsPerBill { get; set; }

    public int ToId { get; set; }

    public int GoodsId { get; set; }

    public int UnitId { get; set; }

    public decimal WeightOrQuantity { get; set; }

    public decimal RatePerUnit { get; set; }

    public decimal Freight { get; set; }

    public decimal Advance { get; set; }

    public decimal Topay { get; set; }

    public decimal Balance { get; set; }

    public int FinancialYearId { get; set; }

    public Bill? Bill { get; set; }
}
