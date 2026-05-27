import { PagePlaceholder } from '@/components/derived/page-placeholder';
import { useScreenSlice } from '@/hooks/useScreenSlice';
import { SCREEN_KEYS } from '@/constants/screenKeys';

export function NameBoardsPage() {
  useScreenSlice(SCREEN_KEYS.nameBoards);
  return (
    <PagePlaceholder
      title="Name Board"
      description="Manage name boards used to group trucks and billing context."
    />
  );
}
