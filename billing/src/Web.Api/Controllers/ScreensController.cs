using Web.Api.Authorization;
using Web.Api.Extensions;
using Application.Registry.Screen;
using SharedKernel;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Web.Api.Controllers;

[ApiController]
[Route("api/screens")]
[Authorize]
public sealed class ScreensController(ISender sender) : ControllerBase
{
    [HttpGet("by-menu/{menuCode}")]
    [EndpointAccess("screens.get-by-menu")]
    public async Task<IActionResult> GetByMenuCode(string menuCode, CancellationToken cancellationToken)
    {
        Result<ScreenMetadataResponse> result = await sender.Send(
            new GetScreenByMenuCodeQuery(menuCode),
            cancellationToken);

        return result.Match<IActionResult>(
            Ok,
            failure => Problem(
                title: failure.Error.Code,
                detail: failure.Error.Description,
                statusCode: failure.Error.Type switch
                {
                    ErrorType.NotFound => StatusCodes.Status404NotFound,
                    ErrorType.Validation => StatusCodes.Status400BadRequest,
                    _ => StatusCodes.Status400BadRequest,
                }));
    }
}
