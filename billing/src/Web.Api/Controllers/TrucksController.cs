using Web.Api.Authorization;
using Web.Api.Extensions;
using Application.Masters.Truck;
using SharedKernel;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Web.Api.Controllers;

[ApiController]
[Route("api/trucks")]
[Authorize]
public sealed class TrucksController(ISender sender) : ControllerBase
{
    [HttpGet]
    [EndpointAccess("trucks.list")]
    public async Task<IActionResult> List(
        [FromQuery] string? filter,
        [FromQuery] string? orderBy,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        Result<PagedTrucksResponse> result = await sender.Send(
            new ListTrucksQuery(filter, orderBy, page, pageSize),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpGet("{id:int}")]
    [EndpointAccess("trucks.get")]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        Result<TruckResponse> result = await sender.Send(new GetTruckByIdQuery(id), cancellationToken);
        return ToActionResult(result);
    }

    [HttpPost("lookup")]
    [EndpointAccess("trucks.lookup")]
    public async Task<IActionResult> Lookup(
        [FromBody] LookupTrucksRequest request,
        CancellationToken cancellationToken)
    {
        Result<TruckLookupResponse> result = await sender.Send(
            new LookupTrucksQuery(
                request.Value.Trim(),
                request.Label.Trim(),
                request.Fields ?? []),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("create")]
    [EndpointAccess("trucks.create")]
    public async Task<IActionResult> Create(
        [FromBody] BatchCreateTrucksRequest request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<CreateTruckItem> items = request.Items
            .Select(i => new CreateTruckItem(i.TruckNumber, i.NameBoardId))
            .ToList();

        Result<BatchCreateTrucksResponse> result = await sender.Send(
            new BatchCreateTrucksCommand(items),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("update")]
    [EndpointAccess("trucks.update")]
    public async Task<IActionResult> Update(
        [FromBody] BatchUpdateTrucksRequest request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<UpdateTruckItem> items = request.Items
            .Select(i => new UpdateTruckItem(
                i.TruckId,
                i.TruckNumber,
                i.NameBoardId,
                i.IsEnabled,
                i.IsActive))
            .ToList();

        Result<BatchUpdateTrucksResponse> result = await sender.Send(
            new BatchUpdateTrucksCommand(items),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("delete")]
    [EndpointAccess("trucks.delete")]
    public async Task<IActionResult> Delete(
        [FromBody] BatchDeleteTrucksRequest request,
        CancellationToken cancellationToken)
    {
        Result<BatchDeleteTrucksResponse> result = await sender.Send(
            new BatchDeleteTrucksCommand(request.Ids),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("toggle")]
    [EndpointAccess("trucks.toggle")]
    public async Task<IActionResult> Toggle(
        [FromBody] BatchToggleTrucksRequest request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<ToggleTruckItem> items = request.Items
            .Select(i => new ToggleTruckItem(i.TruckId, i.IsEnabled))
            .ToList();

        Result<BatchToggleTrucksResponse> result = await sender.Send(
            new BatchToggleTrucksCommand(items),
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
