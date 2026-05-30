import { useQuery } from '@tanstack/react-query';
import {
  ENTITY_LOOKUP_STALE_TIME_MS,
  type EntityLookupDefinition,
} from '@/components/derived/entity-form/entity-lookup-registry';

export function useEntityLookupOptions(lookup: EntityLookupDefinition | null) {
  return useQuery({
    queryKey: lookup?.queryKey ?? ['entity-lookup', 'disabled'],
    queryFn: () => lookup!.fetchOptions(),
    enabled: lookup != null,
    staleTime: ENTITY_LOOKUP_STALE_TIME_MS,
  });
}
