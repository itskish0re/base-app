using Npgsql;

namespace Infrastructure.Persistence;

internal static class NpgsqlDataSourceFactory
{
    public static NpgsqlDataSource Create(string connectionString) =>
        new NpgsqlDataSourceBuilder(connectionString)
            .EnableDynamicJson()
            .Build();
}
