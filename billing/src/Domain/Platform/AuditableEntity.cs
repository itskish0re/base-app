namespace Domain.Platform;

/// <summary>
/// Base for future business master/transaction aggregates.
/// </summary>
public abstract class AuditableEntity
{
    public bool IsEnabled { get; set; } = true;

    public bool IsActive { get; set; } = true;

    public bool IsDeleted { get; set; }

    public DateTime? DeletedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public int? UpdatedBy { get; set; }
}
