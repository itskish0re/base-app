import { PagePlaceholder } from '@/components/derived/page-placeholder';
import { useScreenSlice } from '@/hooks/useScreenSlice';
import { SCREEN_KEYS } from '@/constants/screenKeys';

export function TrucksPage() {
  useScreenSlice(SCREEN_KEYS.trucks);
  return (
    <PagePlaceholder
      title="Truck"
      description="Manage trucks and link them to name boards."
    />
  );
}
