namespace Web.Api.Extensions;

internal static class CorsExtensions
{
    private const string DevelopmentPolicy = "BillingFrontend";

    public static IServiceCollection AddBillingCors(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        string[] origins = configuration
            .GetSection("Cors:AllowedOrigins")
            .Get<string[]>() ?? ["http://localhost:5173"];

        services.AddCors(options =>
        {
            options.AddPolicy(DevelopmentPolicy, policy =>
            {
                policy.WithOrigins(origins)
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
        });

        return services;
    }

    public static IApplicationBuilder UseBillingCors(this IApplicationBuilder app) =>
        app.UseCors(DevelopmentPolicy);
}
