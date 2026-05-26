using Application.Registry.Screen;

namespace Application.Abstractions.Registry;

public interface IAppEntityScreenRepository
{
    Task<ScreenMetadataResponse?> GetMetadataByMenuCodeAsync(
        string menuCode,
        CancellationToken cancellationToken = default);
}
