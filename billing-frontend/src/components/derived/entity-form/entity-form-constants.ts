/** Field names excluded from metadata-driven create/edit forms. */
export const ENTITY_FORM_EXCLUDED_FIELD_NAMES = [
  'isEnabled',
  'isActive',
  'isDeleted',
  'deletedAt',
  'createdAt',
  'updatedAt',
  'createdBy',
  'updatedBy',
] as const;

/** Lookup option cache TTL (30 minutes). */
export const ENTITY_LOOKUP_STALE_TIME_MS = 30 * 60 * 1000;
