import { PagePlaceholder } from '@/components/derived/page-placeholder';
import { useScreenSlice } from '@/hooks/useScreenSlice';
import { SCREEN_KEYS } from '@/constants/screenKeys';

export function DriversPage() {
  useScreenSlice(SCREEN_KEYS.drivers);
  return (
    <PagePlaceholder
      title="Driver"
      description="Manage drivers and assign them to trucks."
    />
  );
}
