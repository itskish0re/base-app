namespace Domain.Transactions;

/// <summary>Read model mapped to <c>v_loads</c>.</summary>
public sealed class LoadListRow
{
    public int LoadId { get; set; }

    public int BillId { get; set; }

    public string BillNumber { get; set; } = null!;

    public int LoadNumber { get; set; }

    public int ConsignorId { get; set; }

    public string ConsignorName { get; set; } = null!;

    public int ConsigneeId { get; set; }

    public string ConsigneeName { get; set; } = null!;

    public bool AsPerBill { get; set; }

    public int ToId { get; set; }

    public string ToLocationName { get; set; } = null!;

    public int GoodsId { get; set; }

    public string GoodsName { get; set; } = null!;

    public int UnitId { get; set; }

    public string UnitName { get; set; } = null!;

    public decimal WeightOrQuantity { get; set; }

    public decimal RatePerUnit { get; set; }

    public decimal Freight { get; set; }

    public decimal Advance { get; set; }

    public decimal Topay { get; set; }

    public decimal Balance { get; set; }

    public bool IsActive { get; set; }

    public int FinancialYearId { get; set; }
}
