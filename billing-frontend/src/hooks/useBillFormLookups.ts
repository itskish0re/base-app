import { useQuery } from '@tanstack/react-query';
import { ENTITY_LOOKUP_STALE_TIME_MS } from '@/components/derived/entity-form/ef-lookup-registry';
import { queryKeys } from '@/constants/queryKeys';
import { lookupGoods } from '@/service/api/functions/goods';
import { lookupLocations } from '@/service/api/functions/locations';
import { lookupParties } from '@/service/api/functions/parties';
import { lookupTrucks } from '@/service/api/functions/trucks';
import { lookupUnits } from '@/service/api/functions/units';

const locationLookup = {
  value: 'location_id',
  label: 'name',
} as const;

const partyLookup = {
  value: 'party_id',
  label: 'name',
} as const;

const goodsLookup = {
  value: 'goods_id',
  label: 'name',
} as const;

const unitLookup = {
  value: 'unit_id',
  label: 'name',
} as const;

const truckLookup = {
  value: 'truck_id',
  label: 'truck_number',
} as const;

export function useBillFormLookups() {
  const locations = useQuery({
    queryKey: queryKeys.locations.lookup(locationLookup.value, locationLookup.label),
    queryFn: () => lookupLocations(locationLookup),
    staleTime: ENTITY_LOOKUP_STALE_TIME_MS,
  });

  const parties = useQuery({
    queryKey: queryKeys.parties.lookup(partyLookup.value, partyLookup.label),
    queryFn: () => lookupParties(partyLookup),
    staleTime: ENTITY_LOOKUP_STALE_TIME_MS,
  });

  const goods = useQuery({
    queryKey: queryKeys.goods.lookup(goodsLookup.value, goodsLookup.label),
    queryFn: () => lookupGoods(goodsLookup),
    staleTime: ENTITY_LOOKUP_STALE_TIME_MS,
  });

  const units = useQuery({
    queryKey: queryKeys.units.lookup(unitLookup.value, unitLookup.label),
    queryFn: () => lookupUnits(unitLookup),
    staleTime: ENTITY_LOOKUP_STALE_TIME_MS,
  });

  const trucks = useQuery({
    queryKey: queryKeys.trucks.lookup(truckLookup.value, truckLookup.label),
    queryFn: () => lookupTrucks(truckLookup),
    staleTime: ENTITY_LOOKUP_STALE_TIME_MS,
  });

  const isLoading =
    locations.isLoading ||
    parties.isLoading ||
    goods.isLoading ||
    units.isLoading ||
    trucks.isLoading;

  const isError =
    locations.isError || parties.isError || goods.isError || units.isError || trucks.isError;

  return {
    isLoading,
    isError,
    locations: locations.data?.items ?? [],
    parties: parties.data?.items ?? [],
    goods: goods.data?.items ?? [],
    units: units.data?.items ?? [],
    trucks: trucks.data?.items ?? [],
  };
}
