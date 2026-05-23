using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.OpenApi;

namespace Web.Api.Extensions;

internal static class SwaggerExtensions
{
    private const string SecuritySchemeName = "Bearer";

    public static IServiceCollection AddBillingSwagger(this IServiceCollection services)
    {
        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Billing v3 API",
                Version = "v1",
            });

            options.AddSecurityDefinition(SecuritySchemeName, new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Description =
                    "JWT from POST /api/auth/login. Click Authorize and paste only the token value (Swagger adds the Bearer prefix).",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.Http,
                Scheme = JwtBearerDefaults.AuthenticationScheme,
                BearerFormat = "JWT",
            });

            options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
            {
                [new OpenApiSecuritySchemeReference(SecuritySchemeName, document)] = [],
            });
        });

        return services;
    }

    public static WebApplication UseBillingSwaggerUi(this WebApplication app)
    {
        app.UseSwagger();
        app.UseSwaggerUI(options =>
        {
            options.SwaggerEndpoint("/swagger/v1/swagger.json", "Billing v3 API v1");
            options.EnablePersistAuthorization();
        });

        return app;
    }
}
