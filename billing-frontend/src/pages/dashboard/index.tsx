import { PagePlaceholder } from '@/components/derived/page-placeholder';
import { useScreenSlice } from '@/hooks/useScreenSlice';
import { SCREEN_KEYS } from '@/store/screenKeys';

export function DashboardPage() {
  useScreenSlice(SCREEN_KEYS.dashboard);
  return (
    <PagePlaceholder
      title="Dashboard"
      description="Billing overview and shortcuts will appear here."
    />
  );
}
