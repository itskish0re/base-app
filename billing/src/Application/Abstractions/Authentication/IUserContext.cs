namespace Application.Abstractions.Authentication;

public interface IUserContext
{
    int? UserId { get; }

    int? RoleId { get; }

    string? RoleCode { get; }

    bool IsAuthenticated { get; }
}
