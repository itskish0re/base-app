using Domain.Platform;
using FluentAssertions;

namespace Domain.UnitTests.Platform;

public class AuditableEntityTests
{
    private sealed class TestEntity : AuditableEntity;

    [Fact]
    public void Should_default_to_enabled_and_active()
    {
        var entity = new TestEntity();
        entity.IsEnabled.Should().BeTrue();
        entity.IsActive.Should().BeTrue();
        entity.IsDeleted.Should().BeFalse();
    }
}
