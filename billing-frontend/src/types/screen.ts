export interface ScreenMetadataResponse {
  screen: ScreenSummaryDto;
  entity: EntitySummaryDto;
  entityFields: EntityFieldDto[];
  columns: ScreenColumnDto[];
  formFields: ScreenFormFieldDto[];
}

export interface ScreenSummaryDto {
  entityScreenId: number;
  menuId: number;
  menuCode: string;
  description: string | null;
  isActive: boolean;
}

export interface EntitySummaryDto {
  entityId: number;
  entityName: string;
  entityKind: string;
  persistMode: string;
  tableName: string;
  displayName: string;
  description: string | null;
}

export interface EntityFieldDto {
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

export interface ScreenColumnDto {
  entityScreenColumnId: number;
  entityFieldId: number;
  fieldName: string;
  dataType: string;
  displayLabel: string | null;
  isVisible: boolean;
  displayOrder: number;
  columnWidth: number | null;
  minWidth: number | null;
  isPinned: boolean;
  align: string;
  columnComponent: string | null;
  allowSort: boolean | null;
  isActive: boolean;
}

export interface ScreenFormFieldDto {
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
