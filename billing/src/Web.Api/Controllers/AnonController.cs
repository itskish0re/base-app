using Web.Api.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Web.Api.Controllers;

[ApiController]
[Route("api/anon")]
public sealed class AnonController : ControllerBase
{
    [HttpGet("landing")]
    [EndpointAccess("anon.landing")]
    public IActionResult Landing() =>
        Ok(new { message = "Public landing endpoint for billing v3." });
}
