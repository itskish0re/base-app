using System.Net;
using Api.FunctionalTests.Infrastructure;
using FluentAssertions;

namespace Api.FunctionalTests.Health;

public class HealthTests(FunctionalTestWebAppFactory factory) : BaseFunctionalTest(factory)
{
    [Fact]
    public async Task Get_health_should_return_ok()
    {
        HttpResponseMessage response = await HttpClient.GetAsync("/api/health");
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}
