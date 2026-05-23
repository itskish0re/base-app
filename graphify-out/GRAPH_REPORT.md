# Graph Report - d:/source/base-app/sample  (2026-05-23)

## Corpus Check
- Corpus is ~22,109 words - fits in a single context window. You may not need a graph.

## Summary
- 884 nodes · 786 edges · 199 communities (131 shown, 68 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 85|Community 85]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 92|Community 92]]
- [[_COMMUNITY_Community 93|Community 93]]
- [[_COMMUNITY_Community 94|Community 94]]
- [[_COMMUNITY_Community 95|Community 95]]
- [[_COMMUNITY_Community 96|Community 96]]
- [[_COMMUNITY_Community 97|Community 97]]
- [[_COMMUNITY_Community 98|Community 98]]
- [[_COMMUNITY_Community 99|Community 99]]
- [[_COMMUNITY_Community 100|Community 100]]
- [[_COMMUNITY_Community 101|Community 101]]
- [[_COMMUNITY_Community 103|Community 103]]
- [[_COMMUNITY_Community 105|Community 105]]
- [[_COMMUNITY_Community 106|Community 106]]

## God Nodes (most connected - your core abstractions)
1. `ReserveBookingTests` - 14 edges
2. `string` - 11 edges
3. `IUnitOfWork` - 11 edges
4. `ProcessOutboxMessagesJob` - 11 edges
5. `FunctionalTestWebAppFactory` - 11 edges
6. `CreateUserTests` - 11 edges
7. `IntegrationTestWebAppFactory` - 10 edges
8. `CreateUserCommandTests` - 10 edges
9. `IBookingRepository` - 9 edges
10. `ReserveBookingCommandHandler` - 9 edges

## Surprising Connections (you probably didn't know these)
- `ApiVersions` --references--> `string`  [EXTRACTED]
  Bookify/src/Bookify.Api/Controllers/ApiVersions.cs → clean_architecture/src/Web.Api/Middleware/RequestContextLoggingMiddleware.cs
- `Permissions` --references--> `string`  [EXTRACTED]
  Bookify/src/Bookify.Api/Controllers/Permissions.cs → clean_architecture/src/Web.Api/Middleware/RequestContextLoggingMiddleware.cs
- `Roles` --references--> `string`  [EXTRACTED]
  Bookify/src/Bookify.Api/Controllers/Roles.cs → clean_architecture/src/Web.Api/Middleware/RequestContextLoggingMiddleware.cs
- `AuthenticationService` --references--> `string`  [EXTRACTED]
  Bookify/src/Bookify.Infrastructure/Authentication/AuthenticationService.cs → clean_architecture/src/Web.Api/Middleware/RequestContextLoggingMiddleware.cs
- `SqlConnectionFactory` --references--> `string`  [EXTRACTED]
  Bookify/src/Bookify.Infrastructure/Data/SqlConnectionFactory.cs → clean_architecture/src/Web.Api/Middleware/RequestContextLoggingMiddleware.cs

## Communities (199 total, 68 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (15): AuthorizationService, LoggingBehavior, QueryCachingBehavior, QueryCachingPipelineBehavior, RequestLoggingPipelineBehavior, ValidationBehavior, ValidationPipelineBehavior, CacheService (+7 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (6): ApplicationTests, BaseTest, BookingTests, DomainTests, LayerTests, UserTests

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (10): SearchApartmentsTests, BaseFunctionalTest, BaseIntegrationTest, ConfirmBookingTests, GetBookingTests, Guid, CreateUserTests, GetLoggedInUserTests (+2 more)

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (13): ApartmentsController, ApplicationDbContext, BookingsController, ControllerBase, IClassFixture, IDisposable, BaseFunctionalTest, BaseIntegrationTest (+5 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (14): ApartmentErrors, AdminAuthorizationDelegatingHandler, AuthenticationService, JwtService, BookingErrors, DelegatingHandler, Error, HttpClient (+6 more)

### Community 5 - "Community 5"
Cohesion: 0.06
Nodes (13): Migration, Bookify.Infrastructure.Migrations, Create_Database, Add_User_IdentityId, Bookify.Infrastructure.Migrations, Add_Roles, Bookify.Infrastructure.Migrations, Add_Permissions (+5 more)

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (8): Entity, Apartment, Booking, Entity, List, Review, Entity, User

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (9): ApartmentConfiguration, BookingConfiguration, OutboxMessageConfiguration, PermissionConfiguration, ReviewConfiguration, RoleConfiguration, RolePermissionConfiguration, UserConfiguration (+1 more)

### Community 8 - "Community 8"
Cohesion: 0.1
Nodes (10): AuthenticationOptions, DependencyInjection, Email, EmailService, FirstName, IAuthenticationService, IEmailService, LastName (+2 more)

### Community 9 - "Community 9"
Cohesion: 0.08
Nodes (11): ApiVersions, Permissions, Roles, Schemas, Tags, RequestContextLoggingMiddleware, string, LoginUserTests (+3 more)

### Community 10 - "Community 10"
Cohesion: 0.09
Nodes (12): UserContext, SqlConnectionFactory, GetBookingQueryHandler, GetUserByEmailQueryHandler, GetUserByIdQueryHandler, GetLoggedInUserQueryHandler, IHttpContextAccessor, int (+4 more)

### Community 11 - "Community 11"
Cohesion: 0.1
Nodes (10): ApplicationDbContext, ApplicationDbContext, DbContext, IConfigureOptions, IJob, IPublisher, JsonSerializerSettings, ProcessOutboxMessagesJob (+2 more)

### Community 12 - "Community 12"
Cohesion: 0.14
Nodes (7): IAsyncLifetime, FunctionalTestWebAppFactory, IntegrationTestWebAppFactory, KeycloakContainer, PostgreSqlContainer, RedisContainer, WebApplicationFactory

### Community 13 - "Community 13"
Cohesion: 0.16
Nodes (6): CancelBookingCommandHandler, CompleteBookingCommandHandler, CreateUserCommandHandler, ICommandHandler, IUnitOfWork, RejectBookingCommandCommandHandler

### Community 14 - "Community 14"
Cohesion: 0.19
Nodes (5): JwtBearerOptionsSetup, IApiVersionDescriptionProvider, IConfigureNamedOptions, ConfigureSwaggerGenOptions, ConfigureSwaggerOptions

### Community 15 - "Community 15"
Cohesion: 0.2
Nodes (7): IBaseCommand, ICommand, IRequest, IBaseCommand, ICommand, IQuery, ITransactionalCommand

### Community 16 - "Community 16"
Cohesion: 0.18
Nodes (3): IUserRepository, RegisterUserCommandHandler, UserRepository

### Community 17 - "Community 17"
Cohesion: 0.18
Nodes (4): ReserveBookingTests, DateTime, ReserveBookingCommand, ReserveBookingCommandHandler

### Community 18 - "Community 18"
Cohesion: 0.24
Nodes (3): Result, Result, TValue

### Community 19 - "Community 19"
Cohesion: 0.22
Nodes (5): CustomClaimsTransformation, PermissionAuthorizationHandler, AuthorizationHandler, IClaimsTransformation, IServiceProvider

### Community 20 - "Community 20"
Cohesion: 0.22
Nodes (3): CreateUserCommand, CreateUserCommandHandler, CreateUserCommandTests

### Community 21 - "Community 21"
Cohesion: 0.25
Nodes (5): BookingStatus, IBookingRepository, INotificationHandler, BookingRepository, BookingReservedDomainEventHandler

### Community 22 - "Community 22"
Cohesion: 0.25
Nodes (4): DateTimeProvider, ConfirmBookingCommandHandler, IDateTimeProvider, DateTimeProvider

### Community 24 - "Community 24"
Cohesion: 0.29
Nodes (3): IRequestHandler, ICommandHandler, IQueryHandler

### Community 25 - "Community 25"
Cohesion: 0.29
Nodes (4): AbstractValidator, CreateUserCommandValidator, RegisterUserCommandValidator, ReserveBookingCommandValidator

### Community 26 - "Community 26"
Cohesion: 0.29
Nodes (4): Exception, ConcurrencyException, ValidationException, UserNotFoundException

### Community 28 - "Community 28"
Cohesion: 0.29
Nodes (4): ApplicationDbContextModelSnapshot, Bookify.Infrastructure.Migrations, Infrastructure.Database.Migrations, ModelSnapshot

### Community 29 - "Community 29"
Cohesion: 0.29
Nodes (4): AddReviewCommandHandler, IReviewRepository, ReviewRepository, Repository

### Community 30 - "Community 30"
Cohesion: 0.29
Nodes (4): IApartmentRepository, PricingService, ApartmentRepository, ReserveBookingCommandHandler

### Community 31 - "Community 31"
Cohesion: 0.29
Nodes (3): BaseTest, Assembly, BaseTest

### Community 33 - "Community 33"
Cohesion: 0.29
Nodes (3): IEndpoint, Get, Register

### Community 36 - "Community 36"
Cohesion: 0.4
Nodes (3): IDomainEvent, INotification, IDomainEvent

### Community 38 - "Community 38"
Cohesion: 0.4
Nodes (3): PermissionAuthorizationPolicyProvider, AuthorizationOptions, DefaultAuthorizationPolicyProvider

## Knowledge Gaps
- **50 isolated node(s):** `Program`, `RequestDelegate`, `IEnumerable`, `IDateTimeProvider`, `AddressResponse` (+45 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **68 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `string` connect `Community 9` to `Community 10`, `Community 4`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `ProcessOutboxMessagesJob` connect `Community 11` to `Community 0`, `Community 10`, `Community 22`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `AuthenticationService` connect `Community 4` to `Community 8`, `Community 9`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **What connects `Program`, `RequestDelegate`, `IEnumerable` to the rest of the system?**
  _50 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._