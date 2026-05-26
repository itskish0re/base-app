namespace Domain.Access;

public sealed class AppRole
{
    public int RoleId { get; set; }

    public string RoleCode { get; set; } = null!;

    public string DisplayName { get; set; } = null!;
}
