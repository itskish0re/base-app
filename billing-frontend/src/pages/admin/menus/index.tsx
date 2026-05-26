import { PagePlaceholder } from '@/components/derived/page-placeholder';
import { useScreenSlice } from '@/hooks/useScreenSlice';
import { SCREEN_KEYS } from '@/store/screenKeys';

export function MenusPage() {
  useScreenSlice(SCREEN_KEYS.menus);
  return (
    <PagePlaceholder
      title="Menus"
      description="Manage sidebar menus and role access."
    />
  );
}
