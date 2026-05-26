using Application.Abstractions.Messaging;
using Application.Common.Lookup;
using Domain.Masters;
using FluentValidation;
using SharedKernel;
using System.Text.RegularExpressions;
using DomainDriver = Domain.Masters.Driver;

namespace Application.Masters.Driver;

public sealed record LookupDriversQuery(
    string ValueColumn,
    string LabelColumn,
    IReadOnlyList<DriverLookupFieldMapping> Fields) : IQuery<DriverLookupResponse>;

internal sealed class LookupDriversQueryHandler(IDriverRepository driverRepository)
    : IQueryHandler<LookupDriversQuery, DriverLookupResponse>
{
    public async Task<Result<DriverLookupResponse>> Handle(
        LookupDriversQuery request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<DomainDriver> rows = await driverRepository.ListForLookupAsync(cancellationToken);

        var items = new List<DriverLookupItem>(rows.Count);

        foreach (DomainDriver row in rows)
        {
            object value = EntityColumnResolver.Resolve(row, request.ValueColumn)
                ?? throw new InvalidOperationException(
                    $"Value column '{request.ValueColumn}' resolved to null for driver_id {row.DriverId}.");

            object? label = EntityColumnResolver.Resolve(row, request.LabelColumn);

            var fields = new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase);
            foreach (DriverLookupFieldMapping mapping in request.Fields)
            {
                fields[mapping.KeyName] = EntityColumnResolver.Resolve(row, mapping.ColumnName);
            }

            items.Add(new DriverLookupItem(value, label, fields));
        }

        return new DriverLookupResponse(items);
    }
}

internal sealed partial class LookupDriversQueryValidator : AbstractValidator<LookupDriversQuery>
{
    private static readonly Regex KeyNamePattern = KeyNameRegex();

    public LookupDriversQueryValidator()
    {
        RuleFor(x => x.ValueColumn)
            .NotEmpty()
            .Must(col => EntityColumnResolver.IsValidColumn<DomainDriver>(col))
            .WithMessage("Value column is not a valid driver column.");

        RuleFor(x => x.LabelColumn)
            .NotEmpty()
            .Must(col => EntityColumnResolver.IsValidColumn<DomainDriver>(col))
            .WithMessage("Label column is not a valid driver column.");

        RuleFor(x => x.Fields)
            .Must(fields => fields.Count <= 20)
            .WithMessage("At most 20 additional fields are allowed.");

        RuleFor(x => x)
            .Custom((query, context) =>
            {
                var keyNames = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

                foreach (DriverLookupFieldMapping field in query.Fields)
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

                    if (!EntityColumnResolver.IsValidColumn<DomainDriver>(field.ColumnName))
                    {
                        context.AddFailure(
                            nameof(query.Fields),
                            $"Column name '{field.ColumnName}' is not a valid driver column.");
                    }
                }
            });
    }

    [GeneratedRegex("^[a-zA-Z][a-zA-Z0-9_]*$")]
    private static partial Regex KeyNameRegex();
}
