using Application.Abstractions.Messaging;
using Application.Abstractions.Registry;
using FluentValidation;
using SharedKernel;

namespace Application.Registry.Screen;

public sealed record GetScreenByMenuCodeQuery(string MenuCode) : IQuery<ScreenMetadataResponse>;

internal sealed class GetScreenByMenuCodeQueryHandler(IAppEntityScreenRepository screenRepository)
    : IQueryHandler<GetScreenByMenuCodeQuery, ScreenMetadataResponse>
{
    public async Task<Result<ScreenMetadataResponse>> Handle(
        GetScreenByMenuCodeQuery request,
        CancellationToken cancellationToken)
    {
        ScreenMetadataResponse? metadata = await screenRepository.GetMetadataByMenuCodeAsync(
            request.MenuCode,
            cancellationToken);

        if (metadata is null)
        {
            return Result.Failure<ScreenMetadataResponse>(ScreenErrors.NotFound);
        }

        return metadata;
    }
}

internal sealed class GetScreenByMenuCodeQueryValidator : AbstractValidator<GetScreenByMenuCodeQuery>
{
    public GetScreenByMenuCodeQueryValidator()
    {
        RuleFor(x => x.MenuCode).NotEmpty().MaximumLength(128);
    }
}
