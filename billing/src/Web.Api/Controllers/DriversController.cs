using Web.Api.Authorization;
using Web.Api.Extensions;
using Application.Masters.Driver;
using SharedKernel;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Web.Api.Controllers;

[ApiController]
[Route("api/drivers")]
[Authorize]
public sealed class DriversController(ISender sender) : ControllerBase
{
    [HttpGet]
    [EndpointAccess("drivers.list")]
    public async Task<IActionResult> List(
        [FromQuery] string? filter,
        [FromQuery] string? orderBy,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        Result<PagedDriversResponse> result = await sender.Send(
            new ListDriversQuery(filter, orderBy, page, pageSize),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpGet("{id:int}")]
    [EndpointAccess("drivers.get")]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        Result<DriverResponse> result = await sender.Send(new GetDriverByIdQuery(id), cancellationToken);
        return ToActionResult(result);
    }

    [HttpPost("lookup")]
    [EndpointAccess("drivers.lookup")]
    public async Task<IActionResult> Lookup(
        [FromBody] LookupDriversRequest request,
        CancellationToken cancellationToken)
    {
        Result<DriverLookupResponse> result = await sender.Send(
            new LookupDriversQuery(
                request.Value.Trim(),
                request.Label.Trim(),
                request.Fields ?? []),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("create")]
    [EndpointAccess("drivers.create")]
    public async Task<IActionResult> Create(
        [FromBody] BatchCreateDriversRequest request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<CreateDriverItem> items = request.Items
            .Select(i => new CreateDriverItem(i.Name, i.Mobile, i.TruckId))
            .ToList();

        Result<BatchCreateDriversResponse> result = await sender.Send(
            new BatchCreateDriversCommand(items),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("update")]
    [EndpointAccess("drivers.update")]
    public async Task<IActionResult> Update(
        [FromBody] BatchUpdateDriversRequest request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<UpdateDriverItem> items = request.Items
            .Select(i => new UpdateDriverItem(
                i.DriverId,
                i.Name,
                i.Mobile,
                i.TruckId,
                i.IsEnabled,
                i.IsActive))
            .ToList();

        Result<BatchUpdateDriversResponse> result = await sender.Send(
            new BatchUpdateDriversCommand(items),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("delete")]
    [EndpointAccess("drivers.delete")]
    public async Task<IActionResult> Delete(
        [FromBody] BatchDeleteDriversRequest request,
        CancellationToken cancellationToken)
    {
        Result<BatchDeleteDriversResponse> result = await sender.Send(
            new BatchDeleteDriversCommand(request.Ids),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("toggle")]
    [EndpointAccess("drivers.toggle")]
    public async Task<IActionResult> Toggle(
        [FromBody] BatchToggleDriversRequest request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<ToggleDriverItem> items = request.Items
            .Select(i => new ToggleDriverItem(i.DriverId, i.IsEnabled))
            .ToList();

        Result<BatchToggleDriversResponse> result = await sender.Send(
            new BatchToggleDriversCommand(items),
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
