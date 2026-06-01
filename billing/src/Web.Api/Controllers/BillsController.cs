using Application.Transactions.Bills;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SharedKernel;
using Web.Api.Authorization;
using Web.Api.Extensions;

namespace Web.Api.Controllers;

[ApiController]
[Route("api/bills")]
[Authorize]
public sealed class BillsController(ISender sender) : ControllerBase
{
    [HttpGet]
    [EndpointAccess("bills.list")]
    public async Task<IActionResult> List(
        [FromQuery] string? filter,
        [FromQuery] string? orderBy,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        Result<PagedBillsResponse> result = await sender.Send(
            new ListBillsQuery(filter, orderBy, page, pageSize),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpGet("next-number")]
    [EndpointAccess("bills.next-number")]
    public async Task<IActionResult> GetNextNumber(CancellationToken cancellationToken)
    {
        Result<NextBillNumberResponse> result = await sender.Send(
            new GetNextBillNumberQuery(),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpGet("{id:int}")]
    [EndpointAccess("bills.get")]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        Result<BillDetailResponse> result = await sender.Send(
            new GetBillByIdQuery(id),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("save")]
    [EndpointAccess("bills.save")]
    public async Task<IActionResult> Save(
        [FromBody] SaveBillRequest request,
        CancellationToken cancellationToken)
    {
        Result<SaveBillResponse> result = await sender.Send(
            new SaveBillCommand(request.Bill, request.Loads),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("cancel")]
    [EndpointAccess("bills.cancel")]
    public async Task<IActionResult> Cancel(
        [FromBody] CancelBillRequest request,
        CancellationToken cancellationToken)
    {
        Result<CancelBillResponse> result = await sender.Send(
            new CancelBillCommand(request.BillId),
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
