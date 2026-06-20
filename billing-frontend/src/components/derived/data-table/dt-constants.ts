/** `app_entity_screen_column.column_component` for the sticky row actions column. */
export const DT_COLUMN_COMPONENT_ACTIONS = 'actions';

/** Synthetic expand/collapse column id (not from screen metadata). */
export const DT_EXPAND_COLUMN_ID = '__expand';

/** Tooltip for the actions column header ellipsis icon. */
export const DT_ACTIONS_HEADER_TOOLTIP = 'Actions';

/** State field names in screen metadata (camelCase); same on all master entities. */
export const DT_FIELD_IS_ENABLED = 'isEnabled';
export const DT_FIELD_IS_ACTIVE = 'isActive';

/** Shared sticky header styling for the data table grid. */
export const DT_TABLE_HEADER_BG_CLASS = 'bg-muted';
export const DT_TABLE_FILTER_ROW_BG_CLASS = 'bg-secondary';
export const DT_TABLE_HEADER_STICKY_CLASS = 'sticky top-0 z-30';
export const DT_TABLE_FILTER_STICKY_CLASS = 'sticky top-10 z-30';
export const DT_TABLE_HEADER_HEIGHT_CLASS = 'h-10';
/** Sticky offset for the fetch progress bar below header rows. */
export const DT_TABLE_FETCH_PROGRESS_STICKY_CLASS = 'top-10';
export const DT_TABLE_FETCH_PROGRESS_STICKY_WITH_FILTER_CLASS = 'top-20';

/** Bottom gap when computing default viewport max height for the table shell. */
export const DT_VIEWPORT_MAX_HEIGHT_BOTTOM_GAP_PX = 24;

export const DT_DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;
