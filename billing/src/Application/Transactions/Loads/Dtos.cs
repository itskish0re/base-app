namespace Application.Transactions.Loads;

public sealed record LoadListRowResponse(
    int LoadId,
    int BillId,
    string BillNumber,
    int LoadNumber,
    int PartyId,
    string PartyName,
    int ToId,
    string ToLocationName,
    int GoodsId,
    string GoodsName,
    int UnitId,
    string UnitName,
    decimal WeightOrQuantity,
    decimal RatePerUnit,
    decimal Freight,
    decimal Advance,
    decimal Topay,
    decimal Balance,
    bool IsActive,
    int FinancialYearId);

public sealed record PagedLoadsResponse(
    IReadOnlyList<LoadListRowResponse> Items,
    int Page,
    int PageSize,
    int TotalCount);
