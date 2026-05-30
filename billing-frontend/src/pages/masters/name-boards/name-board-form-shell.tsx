import type { EntityFormShellController } from '@/components/derived/form-shell/use-entity-form-shell';
import {
  ResponsiveFormShell,
  type FormShellPresentation,
} from '@/components/derived/form-shell/responsive-form-shell';
import { Button } from '@/components/ui/button';

type NameBoardFormShellProps = {
  shell: EntityFormShellController<number>;
  /** Desktop layout; mobile always uses a bottom sheet. */
  presentation?: FormShellPresentation;
};

export function NameBoardFormShell({
  shell,
  presentation = 'dialog',
}: NameBoardFormShellProps) {
  const title = shell.isCreate ? 'Create name board' : 'Edit name board';
  const description = shell.isCreate
    ? 'Add a new name board to the master list.'
    : shell.entityId != null
      ? `Update name board #${shell.entityId}.`
      : 'Update name board.';

  return (
    <ResponsiveFormShell
      open={shell.open}
      onOpenChange={shell.onOpenChange}
      title={title}
      description={description}
      presentation={presentation}
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={shell.close}>
            Cancel
          </Button>
          <Button type="button" disabled>
            Save
          </Button>
        </div>
      }
    >
      <p className="text-sm text-muted-foreground">
        Form fields for name, code, owner name, and phone will go here.
      </p>
    </ResponsiveFormShell>
  );
}
