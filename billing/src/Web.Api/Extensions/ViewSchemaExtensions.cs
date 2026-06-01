using Application.Abstractions.Data;

namespace Web.Api.Extensions;

internal static class ViewSchemaExtensions
{
    public static void ValidateRequiredDatabaseViews(this WebApplication app)
    {
        using IServiceScope scope = app.Services.CreateScope();
        IViewSchemaValidator validator = scope.ServiceProvider.GetRequiredService<IViewSchemaValidator>();
        validator.ValidateRequiredViews();
    }
}
