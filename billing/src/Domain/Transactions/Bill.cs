using Domain.Platform;

namespace Domain.Transactions;

public sealed class Bill : AuditableEntity
{
    public int BillId { get; set; }

    public string BillNumber { get; set; } = null!;

    public DateOnly BillDate { get; set; }

    public int FromId { get; set; }

    public int TruckId { get; set; }

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

    public List<BillOtherItem> Others { get; set; } = [];

    public decimal Total { get; set; }

    public bool IsCancelled { get; set; }

    public int FinancialYearId { get; set; }

    public ICollection<Load> Loads { get; set; } = [];
}
