using System.Collections.Concurrent;
using System.Reflection;

namespace Application.Common.Lookup;

/// <summary>
/// Resolves lookup column names from a domain entity type (scalar properties only).
/// Column names use the same snake_case convention as EF Core (<c>NameBoardId</c> → <c>name_board_id</c>).
/// Navigation collections are excluded automatically.
/// </summary>
public static class EntityColumnResolver
{
    private static readonly ConcurrentDictionary<Type, EntityColumnMap> Cache = new();

    public static bool IsValidColumn<TEntity>(string columnName) where TEntity : class =>
        GetMap(typeof(TEntity)).Columns.Contains(columnName);

    public static object? Resolve<TEntity>(TEntity entity, string columnName) where TEntity : class
    {
        if (!GetMap(typeof(TEntity)).Accessors.TryGetValue(columnName, out Func<object, object?>? accessor))
        {
            return null;
        }

        return accessor(entity);
    }

    public static IReadOnlySet<string> GetColumnNames<TEntity>() where TEntity : class =>
        GetMap(typeof(TEntity)).Columns;

    private static EntityColumnMap GetMap(Type entityType) =>
        Cache.GetOrAdd(entityType, BuildMap);

    private static EntityColumnMap BuildMap(Type entityType)
    {
        var columns = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var accessors = new Dictionary<string, Func<object, object?>>(StringComparer.OrdinalIgnoreCase);

        foreach (PropertyInfo property in GetScalarProperties(entityType))
        {
            string columnName = ToSnakeCase(property.Name);
            columns.Add(columnName);
            accessors[columnName] = instance => property.GetValue(instance);
        }

        return new EntityColumnMap(columns, accessors);
    }

    private static IEnumerable<PropertyInfo> GetScalarProperties(Type type)
    {
        const BindingFlags flags = BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly;

        for (Type? current = type; current is not null && current != typeof(object); current = current.BaseType)
        {
            foreach (PropertyInfo property in current.GetProperties(flags))
            {
                if (IsScalarProperty(property))
                {
                    yield return property;
                }
            }
        }
    }

    private static bool IsScalarProperty(PropertyInfo property)
    {
        if (property.GetIndexParameters().Length > 0)
        {
            return false;
        }

        Type propertyType = Nullable.GetUnderlyingType(property.PropertyType) ?? property.PropertyType;

        if (propertyType == typeof(string))
        {
            return true;
        }

        if (propertyType.IsPrimitive || propertyType.IsEnum)
        {
            return true;
        }

        return propertyType == typeof(decimal)
            || propertyType == typeof(DateTime)
            || propertyType == typeof(DateOnly)
            || propertyType == typeof(TimeOnly)
            || propertyType == typeof(Guid);
    }

    private static string ToSnakeCase(string name)
    {
        if (string.IsNullOrEmpty(name))
        {
            return name;
        }

        var buffer = new System.Text.StringBuilder(name.Length + 4);
        for (int i = 0; i < name.Length; i++)
        {
            char c = name[i];
            if (char.IsUpper(c))
            {
                if (i > 0)
                {
                    buffer.Append('_');
                }

                buffer.Append(char.ToLowerInvariant(c));
            }
            else
            {
                buffer.Append(c);
            }
        }

        return buffer.ToString();
    }

    private sealed record EntityColumnMap(
        IReadOnlySet<string> Columns,
        Dictionary<string, Func<object, object?>> Accessors);
}
