using Web.Api.Authorization;
using Web.Api.Extensions;
using Application.Masters.FinancialYears;
using SharedKernel;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Web.Api.Controllers;

[ApiController]
[Route("api/financial-years")]
[Authorize]
public sealed class FinancialYearsController(ISender sender) : ControllerBase
{
    [HttpGet]
    [EndpointAccess("financial_years.list")]
    public async Task<IActionResult> List(
        [FromQuery] string? filter,
        [FromQuery] string? orderBy,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        Result<PagedFinancialYearsResponse> result = await sender.Send(
            new ListFinancialYearsQuery(filter, orderBy, page, pageSize),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpGet("{id:int}")]
    [EndpointAccess("financial_years.get")]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        Result<FinancialYearResponse> result = await sender.Send(
            new GetFinancialYearByIdQuery(id),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("lookup")]
    [EndpointAccess("financial_years.lookup")]
    public async Task<IActionResult> Lookup(
        [FromBody] LookupFinancialYearsRequest request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<FinancialYearLookupFieldMapping> fields = request.Fields ?? [];

        Result<FinancialYearLookupResponse> result = await sender.Send(
            new LookupFinancialYearsQuery(
                request.Value.Trim(),
                request.Label.Trim(),
                fields),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("create")]
    [EndpointAccess("financial_years.create")]
    public async Task<IActionResult> Create(
        [FromBody] BatchCreateFinancialYearsRequest request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<CreateFinancialYearItem> items = request.Items
            .Select(i => new CreateFinancialYearItem(i.Code))
            .ToList();

        Result<BatchCreateFinancialYearsResponse> result = await sender.Send(
            new BatchCreateFinancialYearsCommand(items),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("update")]
    [EndpointAccess("financial_years.update")]
    public async Task<IActionResult> Update(
        [FromBody] BatchUpdateFinancialYearsRequest request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<UpdateFinancialYearItem> items = request.Items
            .Select(i => new UpdateFinancialYearItem(
                i.FinancialYearId,
                i.Code,
                i.IsEnabled,
                i.IsActive))
            .ToList();

        Result<BatchUpdateFinancialYearsResponse> result = await sender.Send(
            new BatchUpdateFinancialYearsCommand(items),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("delete")]
    [EndpointAccess("financial_years.delete")]
    public async Task<IActionResult> Delete(
        [FromBody] BatchDeleteFinancialYearsRequest request,
        CancellationToken cancellationToken)
    {
        Result<BatchDeleteFinancialYearsResponse> result = await sender.Send(
            new BatchDeleteFinancialYearsCommand(request.Ids),
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost("toggle")]
    [EndpointAccess("financial_years.toggle")]
    public async Task<IActionResult> Toggle(
        [FromBody] BatchToggleFinancialYearsRequest request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<ToggleFinancialYearItem> items = request.Items
            .Select(i => new ToggleFinancialYearItem(i.FinancialYearId, i.IsEnabled))
            .ToList();

        Result<BatchToggleFinancialYearsResponse> result = await sender.Send(
            new BatchToggleFinancialYearsCommand(items),
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
