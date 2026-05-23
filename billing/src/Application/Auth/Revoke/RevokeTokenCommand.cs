using Application.Abstractions.Messaging;

namespace Application.Auth.Revoke;

public sealed record RevokeTokenCommand : ICommand;
