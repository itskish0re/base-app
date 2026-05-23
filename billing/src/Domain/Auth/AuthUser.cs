namespace Domain.Auth;

public sealed record AuthUser(
    int UserId,
    string Email,
    string PasswordHash,
    int RoleId,
    string RoleCode,
    bool IsActive);
