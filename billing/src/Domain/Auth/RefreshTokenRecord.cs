namespace Domain.Auth;

public sealed record RefreshTokenRecord(
    int RefreshTokenId,
    int UserId,
    string TokenSha256Hex,
    DateTime ExpiresAt,
    DateTime? RevokedAt,
    int? ReplacedById);
