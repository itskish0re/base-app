using Web.Api.Authorization;
using Web.Api.Extensions;
using Application.Masters.Units;
using SharedKernel;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Web.Api.Controllers;

[ApiController]
[Route("api/units")]
[Authorize]
public sealed class UnitsController(ISender sender) : ControllerBase
{
    [HttpGet]
    [EndpointAccess("units.list")]
    public async Task<IActionResult> List(
        [FromQuery] string? filter,
        [FromQuery] string? orderBy,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        Result<PagedUnitsResponse> result = await sender.Send(
            new ListUnitsQuery(filter, orderBy, page, pageSize),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpGet("{id:int}")]
    [EndpointAccess("units.get")]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        Result<UnitResponse> result = await sender.Send(
            new GetUnitByIdQuery(id),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("lookup")]
    [EndpointAccess("units.lookup")]
    public async Task<IActionResult> Lookup(
        [FromBody] LookupUnitsRequest request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<UnitLookupFieldMapping> fields = request.Fields ?? [];

        Result<UnitLookupResponse> result = await sender.Send(
            new LookupUnitsQuery(
                request.Value.Trim(),
                request.Label.Trim(),
                fields),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("create")]
    [EndpointAccess("units.create")]
    public async Task<IActionResult> Create(
        [FromBody] BatchCreateUnitsRequest request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<CreateUnitItem> items = request.Items
            .Select(i => new CreateUnitItem(i.Code, i.Name, i.IsFixed))
            .ToList();

        Result<BatchCreateUnitsResponse> result = await sender.Send(
            new BatchCreateUnitsCommand(items),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("update")]
    [EndpointAccess("units.update")]
    public async Task<IActionResult> Update(
        [FromBody] BatchUpdateUnitsRequest request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<UpdateUnitItem> items = request.Items
            .Select(i => new UpdateUnitItem(
                i.UnitId,
                i.Code,
                i.Name,
                i.IsFixed,
                i.IsEnabled,
                i.IsActive))
            .ToList();

        Result<BatchUpdateUnitsResponse> result = await sender.Send(
            new BatchUpdateUnitsCommand(items),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("delete")]
    [EndpointAccess("units.delete")]
    public async Task<IActionResult> Delete(
        [FromBody] BatchDeleteUnitsRequest request,
        CancellationToken cancellationToken)
    {
        Result<BatchDeleteUnitsResponse> result = await sender.Send(
            new BatchDeleteUnitsCommand(request.Ids),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("toggle")]
    [EndpointAccess("units.toggle")]
    public async Task<IActionResult> Toggle(
        [FromBody] BatchToggleUnitsRequest request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<ToggleUnitItem> items = request.Items
            .Select(i => new ToggleUnitItem(i.UnitId, i.IsEnabled))
            .ToList();

        Result<BatchToggleUnitsResponse> result = await sender.Send(
            new BatchToggleUnitsCommand(items),
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
