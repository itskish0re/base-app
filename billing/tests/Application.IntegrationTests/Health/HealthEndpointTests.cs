using System.Net;
using Application.IntegrationTests.Infrastructure;
using FluentAssertions;

namespace Application.IntegrationTests.Health;

public class HealthEndpointTests : BaseIntegrationTest
{
    private readonly HttpClient _client;

    public HealthEndpointTests(IntegrationTestWebAppFactory factory)
        : base(factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Get_health_should_return_ok()
    {
        HttpResponseMessage response = await _client.GetAsync("/api/health");
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}
