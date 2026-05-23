using Web.Api.Authorization;
using Application.Access.GetNavigation;
using SharedKernel;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Web.Api.Controllers;

[ApiController]
[Route("api/access")]
[Authorize]
public sealed class AccessController(ISender sender) : ControllerBase
{
    [HttpGet("navigation")]
    [EndpointAccess("access.navigation")]
    public async Task<IActionResult> GetNavigation(CancellationToken cancellationToken)
    {
        Result<NavigationResponse> result = await sender.Send(new GetNavigationQuery(), cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : Problem(
            title: result.Error.Code,
            detail: result.Error.Description,
            statusCode: StatusCodes.Status400BadRequest);
    }
}
