import { PagePlaceholder } from '@/components/derived/page-placeholder';
import { useScreenMetadata } from '@/hooks/useScreenMetadata';
import { useScreenSlice } from '@/hooks/useScreenSlice';
import { SCREEN_KEYS } from '@/constants/screenKeys';

export function TrucksPage() {
  useScreenSlice(SCREEN_KEYS.truck);
  useScreenMetadata(SCREEN_KEYS.truck);
  return (
    <PagePlaceholder
      title="Truck"
      description="Manage trucks and link them to name boards."
    />
  );
}
