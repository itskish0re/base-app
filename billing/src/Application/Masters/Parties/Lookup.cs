using Application.Abstractions.Messaging;
using Application.Common.Lookup;
using Domain.Masters;
using FluentValidation;
using SharedKernel;
using System.Text.RegularExpressions;
using DomainParty = Domain.Masters.Party;

namespace Application.Masters.Parties;

public sealed record LookupPartysQuery(
    string ValueColumn,
    string LabelColumn,
    IReadOnlyList<PartyLookupFieldMapping> Fields) : IQuery<PartyLookupResponse>;

internal sealed class LookupPartysQueryHandler(IPartyRepository repository)
    : IQueryHandler<LookupPartysQuery, PartyLookupResponse>
{
    public async Task<Result<PartyLookupResponse>> Handle(
        LookupPartysQuery request,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<DomainParty> rows = await repository.ListForLookupAsync(cancellationToken);

        var items = new List<PartyLookupItem>(rows.Count);

        foreach (DomainParty row in rows)
        {
            object value = EntityColumnResolver.Resolve(row, request.ValueColumn)
                ?? throw new InvalidOperationException(
                    $"Value column '{request.ValueColumn}' resolved to null for party_id {row.PartyId}.");

            object? label = EntityColumnResolver.Resolve(row, request.LabelColumn);

            var fields = new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase);
            foreach (PartyLookupFieldMapping mapping in request.Fields)
            {
                fields[mapping.KeyName] = EntityColumnResolver.Resolve(row, mapping.ColumnName);
            }

            items.Add(new PartyLookupItem(value, label, fields));
        }

        return new PartyLookupResponse(items);
    }
}

internal sealed partial class LookupPartysQueryValidator : AbstractValidator<LookupPartysQuery>
{
    private static readonly Regex KeyNamePattern = KeyNameRegex();

    public LookupPartysQueryValidator()
    {
        RuleFor(x => x.ValueColumn)
            .NotEmpty()
            .Must(col => EntityColumnResolver.IsValidColumn<DomainParty>(col))
            .WithMessage("Value column is not a valid party column.");

        RuleFor(x => x.LabelColumn)
            .NotEmpty()
            .Must(col => EntityColumnResolver.IsValidColumn<DomainParty>(col))
            .WithMessage("Label column is not a valid party column.");

        RuleFor(x => x.Fields)
            .Must(fields => fields.Count <= 20)
            .WithMessage("At most 20 additional fields are allowed.");

        RuleFor(x => x)
            .Custom((query, context) =>
            {
                var keyNames = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

                foreach (PartyLookupFieldMapping field in query.Fields)
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

                    if (!EntityColumnResolver.IsValidColumn<DomainParty>(field.ColumnName))
                    {
                        context.AddFailure(
                            nameof(query.Fields),
                            $"Column name '{field.ColumnName}' is not a valid party column.");
                    }
                }
            });
    }

    [GeneratedRegex("^[a-zA-Z][a-zA-Z0-9_]*$")]
    private static partial Regex KeyNameRegex();
}
