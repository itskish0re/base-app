using Web.Api.Authorization;
using Web.Api.Extensions;
using Application.Masters.GoodsItems;
using SharedKernel;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Web.Api.Controllers;

[ApiController]
[Route("api/goods")]
[Authorize]
public sealed class GoodsController(ISender sender) : ControllerBase
{
    [HttpGet]
    [EndpointAccess("goods.list")]
    public async Task<IActionResult> List(
        [FromQuery] string? filter,
        [FromQuery] string? orderBy,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        Result<PagedGoodssResponse> result = await sender.Send(
            new ListGoodssQuery(filter, orderBy, page, pageSize),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpGet("{id:int}")]
    [EndpointAccess("goods.get")]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        Result<GoodsResponse> result = await sender.Send(
            new GetGoodsByIdQuery(id),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("lookup")]
    [EndpointAccess("goods.lookup")]
    public async Task<IActionResult> Lookup(
        [FromBody] LookupGoodssRequest request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<GoodsLookupFieldMapping> fields = request.Fields ?? [];

        Result<GoodsLookupResponse> result = await sender.Send(
            new LookupGoodssQuery(
                request.Value.Trim(),
                request.Label.Trim(),
                fields),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("create")]
    [EndpointAccess("goods.create")]
    public async Task<IActionResult> Create(
        [FromBody] BatchCreateGoodssRequest request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<CreateGoodsItem> items = request.Items
            .Select(i => new CreateGoodsItem(i.Code, i.Name))
            .ToList();

        Result<BatchCreateGoodssResponse> result = await sender.Send(
            new BatchCreateGoodssCommand(items),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("update")]
    [EndpointAccess("goods.update")]
    public async Task<IActionResult> Update(
        [FromBody] BatchUpdateGoodssRequest request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<UpdateGoodsItem> items = request.Items
            .Select(i => new UpdateGoodsItem(
                i.GoodsId,
                i.Code,
                i.Name,
                i.IsEnabled,
                i.IsActive))
            .ToList();

        Result<BatchUpdateGoodssResponse> result = await sender.Send(
            new BatchUpdateGoodssCommand(items),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("delete")]
    [EndpointAccess("goods.delete")]
    public async Task<IActionResult> Delete(
        [FromBody] BatchDeleteGoodssRequest request,
        CancellationToken cancellationToken)
    {
        Result<BatchDeleteGoodssResponse> result = await sender.Send(
            new BatchDeleteGoodssCommand(request.Ids),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("toggle")]
    [EndpointAccess("goods.toggle")]
    public async Task<IActionResult> Toggle(
        [FromBody] BatchToggleGoodssRequest request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<ToggleGoodsItem> items = request.Items
            .Select(i => new ToggleGoodsItem(i.GoodsId, i.IsEnabled))
            .ToList();

        Result<BatchToggleGoodssResponse> result = await sender.Send(
            new BatchToggleGoodssCommand(items),
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
