using SharedKernel;

namespace Application.Registry.Screen;

public static class ScreenErrors
{
    public static readonly Error NotFound = Error.NotFound(
        "Screen.NotFound",
        "No active screen metadata was found for the given menu code.");
}
