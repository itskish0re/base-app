using Web.Api.Authorization;
using Application.Auth.Login;
using Application.Auth.Refresh;
using Application.Auth.Revoke;
using SharedKernel;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Web.Api.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(ISender sender) : ControllerBase
{
    [HttpPost("login")]
    [AllowAnonymous]
    [EndpointAccess("auth.login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        Result<LoginResponse> result = await sender.Send(
            new LoginCommand(request.Email, request.Password),
            cancellationToken);

        return result.IsSuccess ? Ok(result.Value) : ProblemFromResult(result);
    }

    [HttpPost("refresh")]
    [AllowAnonymous]
    [EndpointAccess("auth.refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshRequest request, CancellationToken cancellationToken)
    {
        Result<RefreshTokenResponse> result = await sender.Send(
            new RefreshTokenCommand(request.RefreshToken),
            cancellationToken);

        return result.IsSuccess ? Ok(result.Value) : ProblemFromResult(result);
    }

    [HttpPost("revoke")]
    [Authorize]
    [EndpointAccess("auth.revoke")]
    public async Task<IActionResult> Revoke(CancellationToken cancellationToken)
    {
        Result result = await sender.Send(new RevokeTokenCommand(), cancellationToken);
        return result.IsSuccess ? NoContent() : ProblemFromResult(result);
    }

    private IActionResult ProblemFromResult(Result result) =>
        Problem(
            title: result.Error.Code,
            detail: result.Error.Description,
            statusCode: StatusCodes.Status400BadRequest);

    private IActionResult ProblemFromResult<T>(Result<T> result) =>
        Problem(
            title: result.Error.Code,
            detail: result.Error.Description,
            statusCode: StatusCodes.Status400BadRequest);
}

public sealed record LoginRequest(string Email, string Password);

public sealed record RefreshRequest(string RefreshToken);
