using Application.Auth.Login;
using FluentAssertions;

namespace Application.UnitTests.Auth;

public class LoginCommandValidatorTests
{
    private readonly LoginCommandValidator _validator = new();

    [Fact]
    public void Should_fail_when_email_is_empty()
    {
        LoginCommand command = new(string.Empty, "password123");
        FluentValidation.Results.ValidationResult result = _validator.Validate(command);
        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public void Should_pass_for_valid_command()
    {
        LoginCommand command = new("admin@example.com", "password123");
        FluentValidation.Results.ValidationResult result = _validator.Validate(command);
        result.IsValid.Should().BeTrue();
    }
}
