using Application.Abstractions.Authentication;
using Domain.Access;
using Infrastructure.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Web.Api.Authorization;

namespace Web.Api.Filters;

/// <summary>
/// Enforces <see cref="EndpointAccessAttribute"/> after JWT authentication and MVC authorization.
/// </summary>
internal sealed class EndpointAccessFilter(
    IUserContext userContext,
    EndpointAccessCache endpointAccessCache,
    IEndpointAccessRepository endpointAccessRepository) : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        EndpointAccessAttribute? attribute = context.ActionDescriptor.EndpointMetadata
            .OfType<EndpointAccessAttribute>()
            .FirstOrDefault();

        if (attribute is null)
        {
            await next();
            return;
        }

        IReadOnlyList<EndpointAccessRule> rules = await endpointAccessCache.GetRulesAsync(context.HttpContext.RequestAborted);
        EndpointAccessRule? rule = rules.FirstOrDefault(r =>
            string.Equals(r.EndpointCode, attribute.EndpointCode, StringComparison.OrdinalIgnoreCase));

        if (rule is null)
        {
            context.Result = new StatusCodeResult(StatusCodes.Status403Forbidden);
            return;
        }

        if (string.Equals(rule.AccessMode, "public", StringComparison.OrdinalIgnoreCase))
        {
            await next();
            return;
        }

        if (string.Equals(rule.AccessMode, "anon", StringComparison.OrdinalIgnoreCase))
        {
            if (userContext.IsAuthenticated)
            {
                context.Result = new StatusCodeResult(StatusCodes.Status403Forbidden);
                return;
            }

            await next();
            return;
        }

        if (!userContext.IsAuthenticated || userContext.RoleId is not int roleId)
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        bool allowed = await endpointAccessRepository.IsAllowedAsync(
            roleId,
            attribute.EndpointCode,
            context.HttpContext.RequestAborted);

        if (!allowed)
        {
            context.Result = new StatusCodeResult(StatusCodes.Status403Forbidden);
            return;
        }

        await next();
    }
}
