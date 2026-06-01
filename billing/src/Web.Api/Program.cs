using Web.Api.Extensions;
using Web.Api.Filters;
using Application;
using Infrastructure;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Serilog;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((context, loggerConfig) =>
    loggerConfig.ReadFrom.Configuration(context.Configuration));

builder.Services.AddControllers(options =>
{
    options.Filters.AddService<EndpointAccessFilter>();
});
builder.Services.AddScoped<EndpointAccessFilter>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddBillingSwagger();
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddBillingCors(builder.Configuration);

WebApplication app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseBillingSwaggerUi();
    app.ApplyMigrations();
}

app.ValidateRequiredDatabaseViews();

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseBillingCors();
app.UseRequestContextLogging();
app.UseSerilogRequestLogging();
app.UseRouting();
app.UseAuthentication();
app.UseFinancialYearContext();
app.UseAuthorization();
app.MapControllers();
app.MapHealthChecks("health", new HealthCheckOptions
{
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});

app.Run();

public partial class Program;
