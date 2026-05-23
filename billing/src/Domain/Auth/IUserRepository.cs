namespace Domain.Auth;

public interface IUserRepository
{
    Task<AuthUser?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);

    Task<AuthUser?> GetByIdAsync(int userId, CancellationToken cancellationToken = default);
}
