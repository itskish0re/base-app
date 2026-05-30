import { ENTITY_LOOKUP_STALE_TIME_MS } from '@/components/derived/entity-form/ef-constants';
import { queryKeys } from '@/constants/queryKeys';
import { lookupDrivers } from '@/service/api/functions/drivers';
import { lookupNameBoards } from '@/service/api/functions/nameBoards';
import { lookupTrucks } from '@/service/api/functions/trucks';
import type { LookupFieldMapping, LookupResponse } from '@/types/common';

export type EntityLookupFieldMapping = LookupFieldMapping;

export type EntityLookupDefinition = {
  valueColumn: string;
  labelColumn: string;
  fields?: EntityLookupFieldMapping[] | null;
  fetchOptions: () => Promise<LookupResponse>;
  queryKey: readonly unknown[];
};

/** Until reference columns flow from screen metadata, map FK fields to lookup APIs. */
const ENTITY_FIELD_LOOKUPS: Record<string, Record<string, Omit<EntityLookupDefinition, 'fetchOptions' | 'queryKey'>>> = {
  truck: {
    nameBoardId: {
      valueColumn: 'name_board_id',
      labelColumn: 'name',
      fields: [{ keyName: 'code', columnName: 'code' }],
    },
  },
  driver: {
    truckId: {
      valueColumn: 'truck_id',
      labelColumn: 'truck_number',
    },
  },
};

function buildNameBoardLookupDefinition(
  config: Omit<EntityLookupDefinition, 'fetchOptions' | 'queryKey'>,
): EntityLookupDefinition {
  return {
    ...config,
    queryKey: queryKeys.nameBoards.lookup(config.valueColumn, config.labelColumn),
    fetchOptions: () =>
      lookupNameBoards({
        value: config.valueColumn,
        label: config.labelColumn,
        fields: config.fields,
      }),
  };
}

function buildTruckLookupDefinition(
  config: Omit<EntityLookupDefinition, 'fetchOptions' | 'queryKey'>,
): EntityLookupDefinition {
  return {
    ...config,
    queryKey: queryKeys.trucks.lookup(config.valueColumn, config.labelColumn),
    fetchOptions: () =>
      lookupTrucks({
        value: config.valueColumn,
        label: config.labelColumn,
        fields: config.fields,
      }),
  };
}

function buildDriverLookupDefinition(
  config: Omit<EntityLookupDefinition, 'fetchOptions' | 'queryKey'>,
): EntityLookupDefinition {
  return {
    ...config,
    queryKey: queryKeys.drivers.lookup(config.valueColumn, config.labelColumn),
    fetchOptions: () =>
      lookupDrivers({
        value: config.valueColumn,
        label: config.labelColumn,
        fields: config.fields,
      }),
  };
}

export function resolveEntityFieldLookup(
  entityName: string,
  fieldName: string,
): EntityLookupDefinition | null {
  const config = ENTITY_FIELD_LOOKUPS[entityName]?.[fieldName];
  if (!config) {
    return null;
  }

  if (config.valueColumn === 'name_board_id') {
    return buildNameBoardLookupDefinition(config);
  }

  if (config.valueColumn === 'truck_id') {
    return buildTruckLookupDefinition(config);
  }

  if (config.valueColumn === 'driver_id') {
    return buildDriverLookupDefinition(config);
  }

  return null;
}

export function isEntityLookupField(
  entityName: string,
  fieldName: string,
  fieldComponent: string | null | undefined,
): boolean {
  if (fieldComponent === 'lookup') {
    return resolveEntityFieldLookup(entityName, fieldName) != null;
  }

  return resolveEntityFieldLookup(entityName, fieldName) != null;
}

export { ENTITY_LOOKUP_STALE_TIME_MS };
