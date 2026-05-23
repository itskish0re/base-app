using FluentValidation;

namespace Application.Masters.Update;

internal sealed class BatchUpdateNameBoardsCommandValidator : AbstractValidator<BatchUpdateNameBoardsCommand>
{
    public BatchUpdateNameBoardsCommandValidator()
    {
        RuleFor(x => x.Items).NotEmpty().WithMessage("At least one item is required.");
        RuleFor(x => x.Items.Count).LessThanOrEqualTo(100);

        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(x => x.NameBoardId).GreaterThan(0);
            item.RuleFor(x => x.Name).NotEmpty().MaximumLength(256);
            item.RuleFor(x => x.Code).NotEmpty().MaximumLength(64);
            item.RuleFor(x => x.OwnerName).NotEmpty().MaximumLength(256);
            item.RuleFor(x => x.OwnerPhone).MaximumLength(32).When(x => x.OwnerPhone is not null);
        });
    }
}
