namespace Domain.Transactions;

/// <summary>Read model mapped to <c>v_bills</c>.</summary>
public sealed class BillListRow
{
    public int BillId { get; set; }

    public string BillNumber { get; set; } = null!;

    public DateOnly BillDate { get; set; }

    public int FromId { get; set; }

    public string FromLocationName { get; set; } = null!;

    public int TruckId { get; set; }

    public string TruckNumber { get; set; } = null!;

    public string NameBoardName { get; set; } = null!;

    public string OwnerName { get; set; } = null!;

    public string? OwnerMobile { get; set; }

    public string DriverName { get; set; } = null!;

    public string? DriverMobile1 { get; set; }

    public string? DriverMobile2 { get; set; }

    public decimal TotalFreight { get; set; }

    public decimal Commission { get; set; }

    public decimal Crossing { get; set; }

    public decimal HandLoan { get; set; }

    public bool TruckLoan { get; set; }

    public string? PayBy { get; set; }

    public string? PaidName { get; set; }

    public string? PaidMobile { get; set; }

    public decimal OfficeMamul { get; set; }

    public decimal TapalMamul { get; set; }

    public decimal Diesel { get; set; }

    public decimal Others { get; set; }

    public decimal Total { get; set; }

    public bool IsCancelled { get; set; }

    public int FinancialYearId { get; set; }
}
