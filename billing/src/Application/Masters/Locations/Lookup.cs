using Application.Abstractions.Messaging;
using Application.Common.Lookup;
using Domain.Masters;
using FluentValidation;
using SharedKernel;
using System.Text.RegularExpressions;
using DomainLocation = Domain.Masters.Location;

namespace Application.Masters.Locations;

public sealed record LookupLocationsQuery(
    string ValueColumn,
    string LabelColumn,
    IReadOnlyList<LocationLookupFieldMapping> Fields) : IQuery<LocationLookupResponse>;

internal sealed class LookupLocationsQueryHandler(ILocationRepository repository)
    : IQueryHandler<LookupLocationsQuery, LocationLookupResponse>
{
    public async Task<Result<LocationLookupResponse>> Handle(
        LookupLocationsQuery request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<DomainLocation> rows = await repository.ListForLookupAsync(cancellationToken);

        var items = new List<LocationLookupItem>(rows.Count);

        foreach (DomainLocation row in rows)
        {
            object value = EntityColumnResolver.Resolve(row, request.ValueColumn)
                ?? throw new InvalidOperationException(
                    $"Value column '{request.ValueColumn}' resolved to null for location_id {row.LocationId}.");

            object? label = EntityColumnResolver.Resolve(row, request.LabelColumn);

            var fields = new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase);
            foreach (LocationLookupFieldMapping mapping in request.Fields)
            {
                fields[mapping.KeyName] = EntityColumnResolver.Resolve(row, mapping.ColumnName);
            }

            items.Add(new LocationLookupItem(value, label, fields));
        }

        return new LocationLookupResponse(items);
    }
}

internal sealed partial class LookupLocationsQueryValidator : AbstractValidator<LookupLocationsQuery>
{
    private static readonly Regex KeyNamePattern = KeyNameRegex();

    public LookupLocationsQueryValidator()
    {
        RuleFor(x => x.ValueColumn)
            .NotEmpty()
            .Must(col => EntityColumnResolver.IsValidColumn<DomainLocation>(col))
            .WithMessage("Value column is not a valid location column.");

        RuleFor(x => x.LabelColumn)
            .NotEmpty()
            .Must(col => EntityColumnResolver.IsValidColumn<DomainLocation>(col))
            .WithMessage("Label column is not a valid location column.");

        RuleFor(x => x.Fields)
            .Must(fields => fields.Count <= 20)
            .WithMessage("At most 20 additional fields are allowed.");

        RuleFor(x => x)
            .Custom((query, context) =>
            {
                var keyNames = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

                foreach (LocationLookupFieldMapping field in query.Fields)
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

                    if (!EntityColumnResolver.IsValidColumn<DomainLocation>(field.ColumnName))
                    {
                        context.AddFailure(
                            nameof(query.Fields),
                            $"Column name '{field.ColumnName}' is not a valid location column.");
                    }
                }
            });
    }

    [GeneratedRegex("^[a-zA-Z][a-zA-Z0-9_]*$")]
    private static partial Regex KeyNameRegex();
}
