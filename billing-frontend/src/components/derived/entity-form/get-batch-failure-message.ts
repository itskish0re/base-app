import type { BatchItemFailure } from '@/types/common';

export function getBatchFailureMessage(failures: BatchItemFailure[]): string | null {
  return failures[0]?.message ?? null;
}
