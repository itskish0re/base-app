/** Shared title and description copy for entity create/edit form shells. */
export function getEntityFormShellCopy(options: {
  entityLabel: string;
  createDescription: string;
  isCreate: boolean;
}) {
  return {
    title: options.isCreate ? `Create ${options.entityLabel}` : `Edit ${options.entityLabel}`,
    description: options.isCreate ? options.createDescription : 'Update the details below.',
  };
}
