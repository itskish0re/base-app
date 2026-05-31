using Application.Abstractions.Messaging;
using Application.Common.Lookup;
using Domain.Masters;
using FluentValidation;
using SharedKernel;
using System.Text.RegularExpressions;
using DomainUnit = Domain.Masters.Unit;

namespace Application.Masters.Units;

public sealed record LookupUnitsQuery(
    string ValueColumn,
    string LabelColumn,
    IReadOnlyList<UnitLookupFieldMapping> Fields) : IQuery<UnitLookupResponse>;

internal sealed class LookupUnitsQueryHandler(IUnitRepository repository)
    : IQueryHandler<LookupUnitsQuery, UnitLookupResponse>
{
    public async Task<Result<UnitLookupResponse>> Handle(
        LookupUnitsQuery request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<DomainUnit> rows = await repository.ListForLookupAsync(cancellationToken);

        var items = new List<UnitLookupItem>(rows.Count);

        foreach (DomainUnit row in rows)
        {
            object value = EntityColumnResolver.Resolve(row, request.ValueColumn)
                ?? throw new InvalidOperationException(
                    $"Value column '{request.ValueColumn}' resolved to null for unit_id {row.UnitId}.");

            object? label = EntityColumnResolver.Resolve(row, request.LabelColumn);

            var fields = new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase);
            foreach (UnitLookupFieldMapping mapping in request.Fields)
            {
                fields[mapping.KeyName] = EntityColumnResolver.Resolve(row, mapping.ColumnName);
            }

            items.Add(new UnitLookupItem(value, label, fields));
        }

        return new UnitLookupResponse(items);
    }
}

internal sealed partial class LookupUnitsQueryValidator : AbstractValidator<LookupUnitsQuery>
{
    private static readonly Regex KeyNamePattern = KeyNameRegex();

    public LookupUnitsQueryValidator()
    {
        RuleFor(x => x.ValueColumn)
            .NotEmpty()
            .Must(col => EntityColumnResolver.IsValidColumn<DomainUnit>(col))
            .WithMessage("Value column is not a valid unit column.");

        RuleFor(x => x.LabelColumn)
            .NotEmpty()
            .Must(col => EntityColumnResolver.IsValidColumn<DomainUnit>(col))
            .WithMessage("Label column is not a valid unit column.");

        RuleFor(x => x.Fields)
            .Must(fields => fields.Count <= 20)
            .WithMessage("At most 20 additional fields are allowed.");

        RuleFor(x => x)
            .Custom((query, context) =>
            {
                var keyNames = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

                foreach (UnitLookupFieldMapping field in query.Fields)
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

                    if (!EntityColumnResolver.IsValidColumn<DomainUnit>(field.ColumnName))
                    {
                        context.AddFailure(
                            nameof(query.Fields),
                            $"Column name '{field.ColumnName}' is not a valid unit column.");
                    }
                }
            });
    }

    [GeneratedRegex("^[a-zA-Z][a-zA-Z0-9_]*$")]
    private static partial Regex KeyNameRegex();
}
