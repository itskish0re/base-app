namespace Application.Transactions.Bills;

public sealed record BillResponse(
    int BillId,
    string BillNumber,
    DateOnly BillDate,
    int FromId,
    int TruckId,
    string DriverName,
    string? DriverMobile,
    decimal TotalFreight,
    decimal Commission,
    decimal Crossing,
    decimal HandLoan,
    decimal TruckLoan,
    decimal OfficeMamul,
    decimal TapalMamul,
    decimal Diesel,
    IReadOnlyList<BillOtherItemDto> Others,
    decimal Total,
    bool IsCancelled,
    int FinancialYearId,
    DateTime CreatedAt,
    DateTime UpdatedAt);

public sealed record LoadLineResponse(
    int LoadId,
    int BillId,
    int LoadNumber,
    int ConsignorId,
    int? ConsigneeId,
    bool AsPerBill,
    int ToId,
    int GoodsId,
    int UnitId,
    decimal WeightOrQuantity,
    decimal RatePerUnit,
    decimal Freight,
    decimal Advance,
    decimal Topay,
    decimal Balance,
    bool IsActive,
    int FinancialYearId);

public sealed record BillDetailResponse(
    BillResponse Bill,
    IReadOnlyList<LoadLineResponse> Loads);

public sealed record BillListRowResponse(
    int BillId,
    string BillNumber,
    DateOnly BillDate,
    int FromId,
    string FromLocationName,
    int TruckId,
    string TruckNumber,
    string NameBoardName,
    string OwnerName,
    string? OwnerMobile,
    string DriverName,
    string? DriverMobile,
    decimal TotalFreight,
    decimal Commission,
    decimal Crossing,
    decimal HandLoan,
    decimal TruckLoan,
    decimal OfficeMamul,
    decimal TapalMamul,
    decimal Diesel,
    decimal Others,
    decimal Total,
    bool IsCancelled,
    int FinancialYearId);

public sealed record PagedBillsResponse(
    IReadOnlyList<BillListRowResponse> Items,
    int Page,
    int PageSize,
    int TotalCount);

public sealed record NextBillNumberResponse(string BillNumber);

public sealed record SaveBillLoadItem(
    int? LoadId,
    int ConsignorId,
    int? ConsigneeId,
    bool AsPerBill,
    int ToId,
    int GoodsId,
    int UnitId,
    decimal WeightOrQuantity,
    decimal RatePerUnit,
    decimal Freight,
    decimal Advance,
    decimal Topay,
    decimal Balance);

public sealed record SaveBillItem(
    int? BillId,
    string BillNumber,
    DateOnly BillDate,
    int FromId,
    int TruckId,
    string DriverName,
    string? DriverMobile,
    decimal TotalFreight,
    decimal Commission,
    decimal Crossing,
    decimal HandLoan,
    decimal TruckLoan,
    decimal OfficeMamul,
    decimal TapalMamul,
    decimal Diesel,
    IReadOnlyList<BillOtherItemDto> Others,
    decimal Total,
    bool IsCancelled);

public sealed record SaveBillRequest(SaveBillItem Bill, IReadOnlyList<SaveBillLoadItem> Loads);

public sealed record SaveBillResponse(BillDetailResponse Bill);

public sealed record CancelBillRequest(int BillId);

public sealed record CancelBillResponse(BillResponse Bill);
