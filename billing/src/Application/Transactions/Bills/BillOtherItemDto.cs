namespace Application.Transactions.Bills;

public sealed record BillOtherItemDto(string Key, decimal Value);

public static class BillOtherItemDtoExtensions
{
    public static decimal Sum(IReadOnlyList<BillOtherItemDto>? items) =>
        items?.Sum(static x => x.Value) ?? 0;

    public static IReadOnlyList<BillOtherItemDto> FromDomain(IReadOnlyList<Domain.Transactions.BillOtherItem>? items) =>
        items?.Select(static x => new BillOtherItemDto(x.Key, x.Value)).ToList()
        ?? [];

    public static List<Domain.Transactions.BillOtherItem> ToDomain(IReadOnlyList<BillOtherItemDto>? items) =>
        items?.Select(static x => new Domain.Transactions.BillOtherItem
        {
            Key = x.Key.Trim(),
            Value = x.Value,
        }).ToList() ?? [];
}
