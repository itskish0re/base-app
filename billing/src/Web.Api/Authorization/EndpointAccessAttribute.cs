namespace Web.Api.Authorization;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false)]
public sealed class EndpointAccessAttribute(string endpointCode) : Attribute
{
    public string EndpointCode { get; } = endpointCode;
}
