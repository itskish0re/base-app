import type { EntityFormFieldInputComponent } from '@/components/derived/entity-form/ef-field-types';
import { EntityFormBadgeTextInput, EntityFormTextInput } from '@/components/derived/entity-form/ef-input-text';
import { EntityFormNumberInput } from '@/components/derived/entity-form/ef-input-number';
import { EntityFormMobileInput } from '@/components/derived/entity-form/ef-input-mobile';
import { EntityFormVehicleNumberInput } from '@/components/derived/entity-form/ef-input-vehicle-number';

/** Keys match `app_entity_screen_field.field_component` (lowercase). */
const FIELD_INPUT_REGISTRY: Record<string, EntityFormFieldInputComponent> = {
  text: EntityFormTextInput,
  number: EntityFormNumberInput,
  mobile: EntityFormMobileInput,
  phone: EntityFormMobileInput,
  vehicle_number: EntityFormVehicleNumberInput,
  truck_number: EntityFormVehicleNumberInput,
  badge: EntityFormBadgeTextInput,
};

export function resolveEntityFormFieldInput(
  fieldComponent: string | null | undefined,
): EntityFormFieldInputComponent {
  const key = (fieldComponent ?? 'text').trim().toLowerCase();
  return FIELD_INPUT_REGISTRY[key] ?? EntityFormTextInput;
}

export function isEntityFormBooleanField(fieldComponent: string | null | undefined): boolean {
  const key = (fieldComponent ?? '').trim().toLowerCase();
  return key === 'boolean';
}
