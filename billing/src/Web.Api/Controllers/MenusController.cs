using Web.Api.Authorization;
using Web.Api.Extensions;
using Application.Access.Menu;
using SharedKernel;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Web.Api.Controllers;

[ApiController]
[Route("api/menus")]
[Authorize]
public sealed class MenusController(ISender sender) : ControllerBase
{
    [HttpGet]
    [EndpointAccess("menus.list")]
    public async Task<IActionResult> List(
        [FromQuery] string? filter,
        [FromQuery] bool? isActive,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        Result<PagedMenusResponse> result = await sender.Send(
            new ListMenusQuery(filter, isActive, page, pageSize),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpGet("{id:int}")]
    [EndpointAccess("menus.get")]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        Result<MenuResponse> result = await sender.Send(new GetMenuByIdQuery(id), cancellationToken);
        return ToActionResult(result);
    }

    [HttpPost("create")]
    [EndpointAccess("menus.create")]
    public async Task<IActionResult> Create(
        [FromBody] BatchCreateMenusRequest request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<CreateMenuItem> items = request.Items
            .Select(i => new CreateMenuItem(
                i.MenuCode,
                i.DisplayName,
                i.RoutePath,
                i.Icon,
                i.ParentMenuId,
                i.SortOrder,
                i.Badge,
                i.Tooltip,
                i.DefaultExpanded,
                i.MenuGroup))
            .ToList();

        Result<BatchCreateMenusResponse> result = await sender.Send(
            new BatchCreateMenusCommand(items),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("update")]
    [EndpointAccess("menus.update")]
    public async Task<IActionResult> Update(
        [FromBody] BatchUpdateMenusRequest request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<UpdateMenuItem> items = request.Items
            .Select(i => new UpdateMenuItem(
                i.MenuId,
                i.MenuCode,
                i.DisplayName,
                i.RoutePath,
                i.Icon,
                i.ParentMenuId,
                i.SortOrder,
                i.Badge,
                i.Tooltip,
                i.DefaultExpanded,
                i.MenuGroup,
                i.IsActive))
            .ToList();

        Result<BatchUpdateMenusResponse> result = await sender.Send(
            new BatchUpdateMenusCommand(items),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("delete")]
    [EndpointAccess("menus.delete")]
    public async Task<IActionResult> Delete(
        [FromBody] BatchDeleteMenusRequest request,
        CancellationToken cancellationToken)
    {
        Result<BatchDeleteMenusResponse> result = await sender.Send(
            new BatchDeleteMenusCommand(request.Ids),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("toggle")]
    [EndpointAccess("menus.toggle")]
    public async Task<IActionResult> Toggle(
        [FromBody] BatchToggleMenusRequest request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<ToggleMenuItem> items = request.Items
            .Select(i => new ToggleMenuItem(i.MenuId, i.IsActive))
            .ToList();

        Result<BatchToggleMenusResponse> result = await sender.Send(
            new BatchToggleMenusCommand(items),
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
