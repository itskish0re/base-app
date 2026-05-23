namespace Application.Masters;

public sealed record BatchNameBoardItemFailure(int Index, string ErrorCode, string Message);

public sealed record BatchCreateNameBoardsResponse(
    IReadOnlyList<NameBoardResponse> Created,
    IReadOnlyList<BatchNameBoardItemFailure> Failures);

public sealed record BatchUpdateNameBoardsResponse(
    IReadOnlyList<NameBoardResponse> Updated,
    IReadOnlyList<BatchNameBoardItemFailure> Failures);

public sealed record BatchDeleteNameBoardsResponse(
    IReadOnlyList<int> DeletedIds,
    IReadOnlyList<BatchNameBoardItemFailure> Failures);

public sealed record BatchToggleNameBoardsResponse(
    IReadOnlyList<NameBoardResponse> Updated,
    IReadOnlyList<BatchNameBoardItemFailure> Failures);
