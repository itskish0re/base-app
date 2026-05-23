using FluentValidation;

namespace Application.Masters.Delete;

internal sealed class BatchDeleteNameBoardsCommandValidator : AbstractValidator<BatchDeleteNameBoardsCommand>
{
    public BatchDeleteNameBoardsCommandValidator()
    {
        RuleFor(x => x.Ids).NotEmpty().WithMessage("At least one id is required.");
        RuleFor(x => x.Ids.Count).LessThanOrEqualTo(100);
        RuleForEach(x => x.Ids).GreaterThan(0);
    }
}
