import { CanceledError, isAxiosError } from 'axios';

/** True when a fetch was aborted (navigation, reload, or React Query cancellation). */
export function isQueryAbortError(error: unknown): boolean {
  if (error instanceof CanceledError) {
    return true;
  }

  if (isAxiosError(error) && error.code === 'ERR_CANCELED') {
    return true;
  }

  if (error instanceof DOMException && error.name === 'AbortError') {
    return true;
  }

  if (error instanceof Error && /abort|cancel/i.test(error.message)) {
    return true;
  }

  return false;
}
