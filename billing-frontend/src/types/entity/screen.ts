export interface ScreenMetadataResponse {
  screen: ScreenMetadataDto;
  entities: EntityScreenMetadataDto[];
}

/** One entity on a screen with its fields, grid columns, and form layout. */
export interface EntityScreenMetadataDto {
  entity: EntityMetadataDto;
  entityFields: EntityFieldMetadataDto[];
  columns: ScreenColumnMetadataDto[];
  formFields: ScreenFormFieldMetadataDto[];
}

export interface ScreenMetadataDto {
  entityScreenId: number;
  menuId: number;
  menuCode: string;
  description: string | null;
  isActive: boolean;
}

export interface EntityMetadataDto {
  entityId: number;
  entityName: string;
  entityKind: string;
  persistMode: string;
  tableName: string;
  displayName: string;
  description: string | null;
}

export interface EntityFieldMetadataDto {
  entityFieldId: number;
  fieldName: string;
  dataType: string;
  filterable: boolean;
  sortable: boolean;
  selectable: boolean;
  writable: boolean;
  isRequired: boolean;
  minLength: number | null;
  maxLength: number | null;
  validationRegex: string | null;
  defaultValue: string | null;
}

export interface ScreenColumnMetadataDto {
  entityScreenColumnId: number;
  entityFieldId: number;
  fieldName: string;
  dataType: string;
  displayLabel: string | null;
  isVisible: boolean;
  displayOrder: number;
  columnWidthPercent: number | null;
  isPinned: boolean;
  align: string;
  columnComponent: string | null;
  allowSort: boolean | null;
  isActive: boolean;
}

export interface ScreenFormFieldMetadataDto {
  entityScreenFieldId: number;
  entityFieldId: number;
  fieldName: string;
  dataType: string;
  displayLabel: string | null;
  isVisible: boolean;
  displayOrder: number;
  fieldComponent: string | null;
  isReadOnly: boolean;
  isActive: boolean;
}
