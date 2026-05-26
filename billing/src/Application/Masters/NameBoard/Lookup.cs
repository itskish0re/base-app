using Application.Abstractions.Messaging;
using Application.Common.Lookup;
using Domain.Masters;
using FluentValidation;
using SharedKernel;
using System.Text.RegularExpressions;
using DomainNameBoard = Domain.Masters.NameBoard;

namespace Application.Masters.NameBoard;

public sealed record LookupNameBoardsQuery(
    string ValueColumn,
    string LabelColumn,
    IReadOnlyList<NameBoardLookupFieldMapping> Fields) : IQuery<NameBoardLookupResponse>;

internal sealed class LookupNameBoardsQueryHandler(INameBoardRepository nameBoardRepository)
    : IQueryHandler<LookupNameBoardsQuery, NameBoardLookupResponse>
{
    public async Task<Result<NameBoardLookupResponse>> Handle(
        LookupNameBoardsQuery request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<DomainNameBoard> rows = await nameBoardRepository.ListForLookupAsync(cancellationToken);

        var items = new List<NameBoardLookupItem>(rows.Count);

        foreach (DomainNameBoard row in rows)
        {
            object value = EntityColumnResolver.Resolve(row, request.ValueColumn)
                ?? throw new InvalidOperationException(
                    $"Value column '{request.ValueColumn}' resolved to null for name_board_id {row.NameBoardId}.");

            object? label = EntityColumnResolver.Resolve(row, request.LabelColumn);

            var fields = new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase);
            foreach (NameBoardLookupFieldMapping mapping in request.Fields)
            {
                fields[mapping.KeyName] = EntityColumnResolver.Resolve(row, mapping.ColumnName);
            }

            items.Add(new NameBoardLookupItem(value, label, fields));
        }

        return new NameBoardLookupResponse(items);
    }
}

internal sealed partial class LookupNameBoardsQueryValidator : AbstractValidator<LookupNameBoardsQuery>
{
    private static readonly Regex KeyNamePattern = KeyNameRegex();

    public LookupNameBoardsQueryValidator()
    {
        RuleFor(x => x.ValueColumn)
            .NotEmpty()
            .Must(col => EntityColumnResolver.IsValidColumn<DomainNameBoard>(col))
            .WithMessage("Value column is not a valid name_board column.");

        RuleFor(x => x.LabelColumn)
            .NotEmpty()
            .Must(col => EntityColumnResolver.IsValidColumn<DomainNameBoard>(col))
            .WithMessage("Label column is not a valid name_board column.");

        RuleFor(x => x.Fields)
            .Must(fields => fields.Count <= 20)
            .WithMessage("At most 20 additional fields are allowed.");

        RuleFor(x => x)
            .Custom((query, context) =>
            {
                var keyNames = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

                foreach (NameBoardLookupFieldMapping field in query.Fields)
                {
                    if (string.IsNullOrWhiteSpace(field.KeyName))
                    {
                        context.AddFailure(nameof(query.Fields), "Field keyName is required.");
                        continue;
                    }

                    if (string.IsNullOrWhiteSpace(field.ColumnName))
                    {
                        context.AddFailure(nameof(query.Fields), "Field columnName is required.");
                        continue;
                    }

                    if (!keyNames.Add(field.KeyName))
                    {
                        context.AddFailure(
                            nameof(query.Fields),
                            $"Duplicate field keyName '{field.KeyName}'.");
                    }

                    if (string.Equals(field.KeyName, "value", StringComparison.OrdinalIgnoreCase)
                        || string.Equals(field.KeyName, "label", StringComparison.OrdinalIgnoreCase))
                    {
                        context.AddFailure(
                            nameof(query.Fields),
                            "Field key names cannot be 'value' or 'label'.");
                    }

                    if (!KeyNamePattern.IsMatch(field.KeyName))
                    {
                        context.AddFailure(
                            nameof(query.Fields),
                            $"Field key name '{field.KeyName}' is invalid. Use letters, digits, or underscores.");
                    }

                    if (!EntityColumnResolver.IsValidColumn<DomainNameBoard>(field.ColumnName))
                    {
                        context.AddFailure(
                            nameof(query.Fields),
                            $"Column name '{field.ColumnName}' is not a valid name_board column.");
                    }
                }
            });
    }

    [GeneratedRegex("^[a-zA-Z][a-zA-Z0-9_]*$")]
    private static partial Regex KeyNameRegex();
}
