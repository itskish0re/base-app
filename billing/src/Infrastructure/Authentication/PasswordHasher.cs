using Application.Abstractions.Authentication;

namespace Infrastructure.Authentication;

internal sealed class PasswordHasher : IPasswordHasher
{
    public bool Verify(string password, string passwordHash) =>
        BCrypt.Net.BCrypt.Verify(password, passwordHash);
}
