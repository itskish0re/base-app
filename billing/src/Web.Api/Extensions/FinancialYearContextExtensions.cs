using Web.Api.Middleware;

namespace Web.Api.Extensions;

internal static class FinancialYearContextExtensions
{
    public static WebApplication UseFinancialYearContext(this WebApplication app)
    {
        app.UseMiddleware<FinancialYearContextMiddleware>();
        return app;
    }
}
