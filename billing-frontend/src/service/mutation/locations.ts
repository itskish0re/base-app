import {
  createLocations,
  deleteLocations,
  toggleLocations,
  updateLocations,
} from '@/service/api/functions/locations';
import type {
  BatchCreateLocationsRequest,
  BatchDeleteLocationsRequest,
  BatchToggleLocationsRequest,
  BatchUpdateLocationsRequest,
} from '@/types/entity';

export const createLocationsMutationOptions = {
  mutationFn: (body: BatchCreateLocationsRequest) => createLocations(body),
};

export const updateLocationsMutationOptions = {
  mutationFn: (body: BatchUpdateLocationsRequest) => updateLocations(body),
};

export const deleteLocationsMutationOptions = {
  mutationFn: (body: BatchDeleteLocationsRequest) => deleteLocations(body),
};

export const toggleLocationsMutationOptions = {
  mutationFn: (body: BatchToggleLocationsRequest) => toggleLocations(body),
};
