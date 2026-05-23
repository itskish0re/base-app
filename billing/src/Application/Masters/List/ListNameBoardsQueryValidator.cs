using FluentValidation;

namespace Application.Masters.List;

internal sealed class ListNameBoardsQueryValidator : AbstractValidator<ListNameBoardsQuery>
{
    public ListNameBoardsQueryValidator()
    {
        RuleFor(x => x.Page).GreaterThan(0);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
    }
}
