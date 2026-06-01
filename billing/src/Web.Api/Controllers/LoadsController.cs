using Application.Transactions.Loads;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SharedKernel;
using Web.Api.Authorization;
using Web.Api.Extensions;

namespace Web.Api.Controllers;

[ApiController]
[Route("api/loads")]
[Authorize]
public sealed class LoadsController(ISender sender) : ControllerBase
{
    [HttpGet]
    [EndpointAccess("loads.list")]
    public async Task<IActionResult> List(
        [FromQuery] string? filter,
        [FromQuery] string? orderBy,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        Result<PagedLoadsResponse> result = await sender.Send(
            new ListLoadsQuery(filter, orderBy, page, pageSize),
            cancellationToken);

        return ToActionResult(result);
    }

    private IActionResult ToActionResult<T>(Result<T> result) =>
        result.Match<T, IActionResult>(
            value => Ok(value),
            ToFailureResult);

    private IActionResult ToFailureResult(Result result) =>
        Problem(
            title: result.Error.Code,
            detail: result.Error.Description,
            statusCode: result.Error.Type switch
            {
                ErrorType.NotFound => StatusCodes.Status404NotFound,
                ErrorType.Conflict => StatusCodes.Status409Conflict,
                ErrorType.Validation => StatusCodes.Status400BadRequest,
                _ => StatusCodes.Status400BadRequest,
            });
}
