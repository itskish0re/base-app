using Web.Api.Authorization;
using Web.Api.Extensions;
using Application.Masters.Locations;
using SharedKernel;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Web.Api.Controllers;

[ApiController]
[Route("api/locations")]
[Authorize]
public sealed class LocationsController(ISender sender) : ControllerBase
{
    [HttpGet]
    [EndpointAccess("locations.list")]
    public async Task<IActionResult> List(
        [FromQuery] string? filter,
        [FromQuery] string? orderBy,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        Result<PagedLocationsResponse> result = await sender.Send(
            new ListLocationsQuery(filter, orderBy, page, pageSize),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpGet("{id:int}")]
    [EndpointAccess("locations.get")]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        Result<LocationResponse> result = await sender.Send(
            new GetLocationByIdQuery(id),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("lookup")]
    [EndpointAccess("locations.lookup")]
    public async Task<IActionResult> Lookup(
        [FromBody] LookupLocationsRequest request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<LocationLookupFieldMapping> fields = request.Fields ?? [];

        Result<LocationLookupResponse> result = await sender.Send(
            new LookupLocationsQuery(
                request.Value.Trim(),
                request.Label.Trim(),
                fields),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("create")]
    [EndpointAccess("locations.create")]
    public async Task<IActionResult> Create(
        [FromBody] BatchCreateLocationsRequest request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<CreateLocationItem> items = request.Items
            .Select(i => new CreateLocationItem(i.Code, i.Name))
            .ToList();

        Result<BatchCreateLocationsResponse> result = await sender.Send(
            new BatchCreateLocationsCommand(items),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("update")]
    [EndpointAccess("locations.update")]
    public async Task<IActionResult> Update(
        [FromBody] BatchUpdateLocationsRequest request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<UpdateLocationItem> items = request.Items
            .Select(i => new UpdateLocationItem(
                i.LocationId,
                i.Code,
                i.Name,
                i.IsEnabled,
                i.IsActive))
            .ToList();

        Result<BatchUpdateLocationsResponse> result = await sender.Send(
            new BatchUpdateLocationsCommand(items),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("delete")]
    [EndpointAccess("locations.delete")]
    public async Task<IActionResult> Delete(
        [FromBody] BatchDeleteLocationsRequest request,
        CancellationToken cancellationToken)
    {
        Result<BatchDeleteLocationsResponse> result = await sender.Send(
            new BatchDeleteLocationsCommand(request.Ids),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("toggle")]
    [EndpointAccess("locations.toggle")]
    public async Task<IActionResult> Toggle(
        [FromBody] BatchToggleLocationsRequest request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<ToggleLocationItem> items = request.Items
            .Select(i => new ToggleLocationItem(i.LocationId, i.IsEnabled))
            .ToList();

        Result<BatchToggleLocationsResponse> result = await sender.Send(
            new BatchToggleLocationsCommand(items),
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
