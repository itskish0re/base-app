import { PagePlaceholder } from '@/components/derived/page-placeholder';
import { useScreenMetadata } from '@/hooks/useScreenMetadata';
import { useScreenSlice } from '@/hooks/useScreenSlice';
import { SCREEN_KEYS } from '@/constants/screenKeys';

export function NameBoardsPage() {
  useScreenSlice(SCREEN_KEYS.nameBoard);
  useScreenMetadata(SCREEN_KEYS.nameBoard);
  return (
    <PagePlaceholder
      title="Name Board"
      description="Manage name boards used to group trucks and billing context."
    />
  );
}
