using Application.Abstractions.Context;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Context;

internal sealed class FinancialYearContext(IHttpContextAccessor httpContextAccessor) : IFinancialYearContext
{
    public int? FinancialYearId =>
        httpContextAccessor.HttpContext?.Items[FinancialYearContextKeys.HttpContextItemKey] is int id && id > 0
            ? id
            : null;
}
