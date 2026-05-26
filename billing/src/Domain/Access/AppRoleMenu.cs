namespace Domain.Access;

public sealed class AppRoleMenu
{
    public int RoleId { get; set; }

    public int MenuId { get; set; }

    public bool IsEnabled { get; set; }

    public bool IsDisplayed { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public int? UpdatedBy { get; set; }
}
