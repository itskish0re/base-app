import { isTransactionEntityKind } from '@/lib/financialYearScope';
import type { EntityScreenMetadataDto } from '@/types/entity/screen';

/** True when screen metadata marks the primary entity as transaction-scoped. */
export function isTransactionScreen(entities: EntityScreenMetadataDto[]): boolean {
  const primary = entities[0];
  return isTransactionEntityKind(primary?.entity.entityKind);
}
