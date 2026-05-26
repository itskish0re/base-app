import { lazy, Suspense } from 'react';
import { isQueryDevtoolsEnabled } from '@/config/env';

const ReactQueryDevtoolsPanel = lazy(() =>
  import('@tanstack/react-query-devtools').then((module) => ({
    default: module.ReactQueryDevtools,
  })),
);

export function QueryDevtools() {
  if (!isQueryDevtoolsEnabled()) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <ReactQueryDevtoolsPanel buttonPosition="bottom-left" initialIsOpen={false} />
    </Suspense>
  );
}
