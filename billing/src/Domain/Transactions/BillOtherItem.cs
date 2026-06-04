using System.Text.Json.Serialization;

namespace Domain.Transactions;

/** Key/value charge line stored in bills.others (jsonb array). */
public sealed class BillOtherItem
{
    [JsonPropertyName("key")]
    public string Key { get; set; } = string.Empty;

    [JsonPropertyName("value")]
    public decimal Value { get; set; }
}

public static class BillOtherItems
{
    public static decimal Sum(IReadOnlyList<BillOtherItem>? items) =>
        items?.Sum(static x => x.Value) ?? 0;
}
