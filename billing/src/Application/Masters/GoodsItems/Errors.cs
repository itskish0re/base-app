using SharedKernel;

namespace Application.Masters.GoodsItems;

internal static class GoodsErrors
{
    public static readonly Error NotFound = Error.NotFound(
        "Goods.NotFound",
        "Goods was not found.");

    public static readonly Error CodeNotUnique = Error.Conflict(
        "Goods.CodeNotUnique",
        "A goods with this code already exists.");
}
