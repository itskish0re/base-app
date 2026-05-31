using Application.Abstractions.Messaging;
using Application.Common.Lookup;
using Domain.Masters;
using FluentValidation;
using SharedKernel;
using System.Text.RegularExpressions;
using DomainFinancialYear = Domain.Masters.FinancialYear;

namespace Application.Masters.FinancialYears;

public sealed record LookupFinancialYearsQuery(
    string ValueColumn,
    string LabelColumn,
    IReadOnlyList<FinancialYearLookupFieldMapping> Fields) : IQuery<FinancialYearLookupResponse>;

internal sealed class LookupFinancialYearsQueryHandler(IFinancialYearRepository repository)
    : IQueryHandler<LookupFinancialYearsQuery, FinancialYearLookupResponse>
{
    public async Task<Result<FinancialYearLookupResponse>> Handle(
        LookupFinancialYearsQuery request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<DomainFinancialYear> rows = await repository.ListForLookupAsync(cancellationToken);

        var items = new List<FinancialYearLookupItem>(rows.Count);

        foreach (DomainFinancialYear row in rows)
        {
            object value = EntityColumnResolver.Resolve(row, request.ValueColumn)
                ?? throw new InvalidOperationException(
                    $"Value column '{request.ValueColumn}' resolved to null for financial_year_id {row.FinancialYearId}.");

            object? label = EntityColumnResolver.Resolve(row, request.LabelColumn);

            var fields = new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase);
            foreach (FinancialYearLookupFieldMapping mapping in request.Fields)
            {
                fields[mapping.KeyName] = EntityColumnResolver.Resolve(row, mapping.ColumnName);
            }

            items.Add(new FinancialYearLookupItem(value, label, fields));
        }

        return new FinancialYearLookupResponse(items);
    }
}

internal sealed partial class LookupFinancialYearsQueryValidator : AbstractValidator<LookupFinancialYearsQuery>
{
    private static readonly Regex KeyNamePattern = KeyNameRegex();

    public LookupFinancialYearsQueryValidator()
    {
        RuleFor(x => x.ValueColumn)
            .NotEmpty()
            .Must(col => EntityColumnResolver.IsValidColumn<DomainFinancialYear>(col))
            .WithMessage("Value column is not a valid financial year column.");

        RuleFor(x => x.LabelColumn)
            .NotEmpty()
            .Must(col => EntityColumnResolver.IsValidColumn<DomainFinancialYear>(col))
            .WithMessage("Label column is not a valid financial year column.");

        RuleFor(x => x.Fields)
            .Must(fields => fields.Count <= 20)
            .WithMessage("At most 20 additional fields are allowed.");

        RuleFor(x => x)
            .Custom((query, context) =>
            {
                var keyNames = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

                foreach (FinancialYearLookupFieldMapping field in query.Fields)
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

                    if (!EntityColumnResolver.IsValidColumn<DomainFinancialYear>(field.ColumnName))
                    {
                        context.AddFailure(
                            nameof(query.Fields),
                            $"Column name '{field.ColumnName}' is not a valid financial year column.");
                    }
                }
            });
    }

    [GeneratedRegex("^[a-zA-Z][a-zA-Z0-9_]*$")]
    private static partial Regex KeyNameRegex();
}
