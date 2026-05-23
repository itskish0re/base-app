using FluentValidation;

namespace Application.Masters.Toggle;

internal sealed class BatchToggleNameBoardsCommandValidator : AbstractValidator<BatchToggleNameBoardsCommand>
{
    public BatchToggleNameBoardsCommandValidator()
    {
        RuleFor(x => x.Items).NotEmpty().WithMessage("At least one item is required.");
        RuleFor(x => x.Items.Count).LessThanOrEqualTo(100);

        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(x => x.NameBoardId).GreaterThan(0);
        });
    }
}
