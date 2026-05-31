using Application.Abstractions.Context;

namespace Web.Api.Middleware;

internal sealed class FinancialYearContextMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context)
    {
        if (context.Request.Headers.TryGetValue(FinancialYearContextKeys.HeaderName, out Microsoft.Extensions.Primitives.StringValues values))
        {
            string raw = values.ToString().Trim();
            if (int.TryParse(raw, out int financialYearId) && financialYearId > 0)
            {
                context.Items[FinancialYearContextKeys.HttpContextItemKey] = financialYearId;
            }
        }

        await next(context);
    }
}
