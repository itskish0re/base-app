using Web.Api.Authorization;
using Web.Api.Extensions;
using Application.Masters.NameBoard;
using SharedKernel;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Web.Api.Controllers;

[ApiController]
[Route("api/name-boards")]
[Authorize]
public sealed class NameBoardsController(ISender sender) : ControllerBase
{
    [HttpGet]
    [EndpointAccess("name-boards.list")]
    public async Task<IActionResult> List(
        [FromQuery] string? filter,
        [FromQuery] string? orderBy,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        Result<PagedNameBoardsResponse> result = await sender.Send(
            new ListNameBoardsQuery(filter, orderBy, page, pageSize),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpGet("{id:int}")]
    [EndpointAccess("name-boards.get")]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        Result<NameBoardResponse> result = await sender.Send(
            new GetNameBoardByIdQuery(id),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("lookup")]
    [EndpointAccess("name-boards.lookup")]
    public async Task<IActionResult> Lookup(
        [FromBody] LookupNameBoardsRequest request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<NameBoardLookupFieldMapping> fields = request.Fields ?? [];

        Result<NameBoardLookupResponse> result = await sender.Send(
            new LookupNameBoardsQuery(
                request.Value.Trim(),
                request.Label.Trim(),
                fields),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("create")]
    [EndpointAccess("name-boards.create")]
    public async Task<IActionResult> Create(
        [FromBody] BatchCreateNameBoardsRequest request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<CreateNameBoardItem> items = request.Items
            .Select(i => new CreateNameBoardItem(i.Name, i.Code, i.OwnerName, i.OwnerPhone))
            .ToList();

        Result<BatchCreateNameBoardsResponse> result = await sender.Send(
            new BatchCreateNameBoardsCommand(items),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("update")]
    [EndpointAccess("name-boards.update")]
    public async Task<IActionResult> Update(
        [FromBody] BatchUpdateNameBoardsRequest request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<UpdateNameBoardItem> items = request.Items
            .Select(i => new UpdateNameBoardItem(
                i.NameBoardId,
                i.Name,
                i.Code,
                i.OwnerName,
                i.OwnerPhone,
                i.IsEnabled,
                i.IsActive))
            .ToList();

        Result<BatchUpdateNameBoardsResponse> result = await sender.Send(
            new BatchUpdateNameBoardsCommand(items),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("delete")]
    [EndpointAccess("name-boards.delete")]
    public async Task<IActionResult> Delete(
        [FromBody] BatchDeleteNameBoardsRequest request,
        CancellationToken cancellationToken)
    {
        Result<BatchDeleteNameBoardsResponse> result = await sender.Send(
            new BatchDeleteNameBoardsCommand(request.Ids),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("toggle")]
    [EndpointAccess("name-boards.toggle")]
    public async Task<IActionResult> Toggle(
        [FromBody] BatchToggleNameBoardsRequest request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<ToggleNameBoardItem> items = request.Items
            .Select(i => new ToggleNameBoardItem(i.NameBoardId, i.IsEnabled))
            .ToList();

        Result<BatchToggleNameBoardsResponse> result = await sender.Send(
            new BatchToggleNameBoardsCommand(items),
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
