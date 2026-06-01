using Application.Abstractions.Data;
using Npgsql;

namespace Infrastructure.Persistence;

internal sealed class ViewSchemaValidator(NpgsqlDataSource dataSource) : IViewSchemaValidator
{
    public void ValidateRequiredViews()
    {
        var required = new HashSet<string>(BillingViews.Required, StringComparer.OrdinalIgnoreCase);
        var found = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        using NpgsqlConnection connection = dataSource.OpenConnection();
        using var command = new NpgsqlCommand(
            """
            SELECT table_name
            FROM information_schema.views
            WHERE table_schema = 'public'
              AND table_name = ANY(@names)
            """,
            connection);

        command.Parameters.AddWithValue("names", BillingViews.Required.ToArray());
        using NpgsqlDataReader reader = command.ExecuteReader();
        while (reader.Read())
        {
            found.Add(reader.GetString(0));
        }

        var missing = required.Except(found, StringComparer.OrdinalIgnoreCase).OrderBy(x => x).ToList();
        if (missing.Count == 0)
        {
            return;
        }

        throw new InvalidOperationException(
            $"Required database view(s) are missing: {string.Join(", ", missing)}. " +
            $"Apply scripts from billing/scripts/views/ (e.g. v_bills.sql, v_loads.sql).");
    }
}
