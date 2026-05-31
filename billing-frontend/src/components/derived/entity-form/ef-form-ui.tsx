import { cn } from '@/lib/utils';

export const entityFormErrorClassName = 'text-xs text-red-600 dark:text-red-500';
export const entityFormRequiredMarkClassName = 'text-red-600 dark:text-red-500';

type EntityFormFieldErrorProps = {
  message?: string;
  className?: string;
};

export function EntityFormFieldError({ message, className }: EntityFormFieldErrorProps) {
  if (!message) {
    return null;
  }

  return <p className={cn(entityFormErrorClassName, className)}>{message}</p>;
}

export function EntityFormRequiredMark() {
  return (
    <span className={entityFormRequiredMarkClassName} aria-hidden="true">
      {' '}
      *
    </span>
  );
}
