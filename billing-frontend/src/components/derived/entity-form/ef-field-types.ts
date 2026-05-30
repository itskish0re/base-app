import type { ComponentType } from 'react';

/** Props for metadata-driven form field inputs (`field_component` registry). */
export type EntityFormFieldInputProps = {
  id: string;
  value: unknown;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
};

export type EntityFormFieldInputComponent = ComponentType<EntityFormFieldInputProps>;
