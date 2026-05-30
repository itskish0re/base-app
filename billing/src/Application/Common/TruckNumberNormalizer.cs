namespace Application.Common;

public static class TruckNumberNormalizer
{
    public static string Normalize(string truckNumber) =>
        string.Concat(truckNumber.Trim().Where(static c => !char.IsWhiteSpace(c)));
}
