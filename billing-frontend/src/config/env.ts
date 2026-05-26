/** True when `VITE_ENABLE_QUERY_DEVTOOLS` is `"true"` or `"1"`. */
export function isQueryDevtoolsEnabled(): boolean {
  const value = import.meta.env.VITE_ENABLE_QUERY_DEVTOOLS?.trim().toLowerCase();
  return value === 'true' || value === '1';
}
