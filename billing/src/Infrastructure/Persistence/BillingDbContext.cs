using System.Data;
using Application.Abstractions.Data;
using Domain.Access;
using Domain.Masters;
using Domain.Registry;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace Infrastructure.Persistence;

public sealed class BillingDbContext(DbContextOptions<BillingDbContext> options)
    : DbContext(options), IUnitOfWork
{
    public DbSet<NameBoard> NameBoards => Set<NameBoard>();

    public DbSet<Truck> Trucks => Set<Truck>();

    public DbSet<Location> Locations => Set<Location>();

    public DbSet<Party> Parties => Set<Party>();

    public DbSet<Goods> Goods => Set<Goods>();

    public DbSet<Unit> Units => Set<Unit>();

    public DbSet<FinancialYear> FinancialYears => Set<FinancialYear>();

    public DbSet<AppFieldDataType> AppFieldDataTypes => Set<AppFieldDataType>();

    public DbSet<AppEntity> AppEntities => Set<AppEntity>();

    public DbSet<AppEntityField> AppEntityFields => Set<AppEntityField>();

    public DbSet<AppEntityScreen> AppEntityScreens => Set<AppEntityScreen>();

    public DbSet<AppEntityScreenColumn> AppEntityScreenColumns => Set<AppEntityScreenColumn>();

    public DbSet<AppEntityScreenField> AppEntityScreenFields => Set<AppEntityScreenField>();

    public DbSet<AppMenu> AppMenus => Set<AppMenu>();

    public DbSet<AppRole> AppRoles => Set<AppRole>();

    public DbSet<AppRoleMenu> AppRoleMenus => Set<AppRoleMenu>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("public");
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(BillingDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }

    public async Task<IDbTransaction> BeginTransactionAsync() =>
        (await Database.BeginTransactionAsync()).GetDbTransaction();
}
