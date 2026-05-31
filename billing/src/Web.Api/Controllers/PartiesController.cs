using Web.Api.Authorization;
using Web.Api.Extensions;
using Application.Masters.Parties;
using SharedKernel;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Web.Api.Controllers;

[ApiController]
[Route("api/parties")]
[Authorize]
public sealed class PartiesController(ISender sender) : ControllerBase
{
    [HttpGet]
    [EndpointAccess("parties.list")]
    public async Task<IActionResult> List(
        [FromQuery] string? filter,
        [FromQuery] string? orderBy,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        Result<PagedPartysResponse> result = await sender.Send(
            new ListPartysQuery(filter, orderBy, page, pageSize),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpGet("{id:int}")]
    [EndpointAccess("parties.get")]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        Result<PartyResponse> result = await sender.Send(
            new GetPartyByIdQuery(id),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("lookup")]
    [EndpointAccess("parties.lookup")]
    public async Task<IActionResult> Lookup(
        [FromBody] LookupPartysRequest request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<PartyLookupFieldMapping> fields = request.Fields ?? [];

        Result<PartyLookupResponse> result = await sender.Send(
            new LookupPartysQuery(
                request.Value.Trim(),
                request.Label.Trim(),
                fields),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("create")]
    [EndpointAccess("parties.create")]
    public async Task<IActionResult> Create(
        [FromBody] BatchCreatePartysRequest request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<CreatePartyItem> items = request.Items
            .Select(i => new CreatePartyItem(i.Code, i.Name))
            .ToList();

        Result<BatchCreatePartysResponse> result = await sender.Send(
            new BatchCreatePartysCommand(items),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("update")]
    [EndpointAccess("parties.update")]
    public async Task<IActionResult> Update(
        [FromBody] BatchUpdatePartysRequest request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<UpdatePartyItem> items = request.Items
            .Select(i => new UpdatePartyItem(
                i.PartyId,
                i.Code,
                i.Name,
                i.IsEnabled,
                i.IsActive))
            .ToList();

        Result<BatchUpdatePartysResponse> result = await sender.Send(
            new BatchUpdatePartysCommand(items),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("delete")]
    [EndpointAccess("parties.delete")]
    public async Task<IActionResult> Delete(
        [FromBody] BatchDeletePartysRequest request,
        CancellationToken cancellationToken)
    {
        Result<BatchDeletePartysResponse> result = await sender.Send(
            new BatchDeletePartysCommand(request.Ids),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("toggle")]
    [EndpointAccess("parties.toggle")]
    public async Task<IActionResult> Toggle(
        [FromBody] BatchTogglePartysRequest request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<TogglePartyItem> items = request.Items
            .Select(i => new TogglePartyItem(i.PartyId, i.IsEnabled))
            .ToList();

        Result<BatchTogglePartysResponse> result = await sender.Send(
            new BatchTogglePartysCommand(items),
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
