import type { ReactNode } from 'react';
import {
  EntityFormFieldError,
  EntityFormRequiredMark,
} from '@/components/derived/entity-form/ef-form-ui';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type EntityFormFieldControlProps = {
  id?: string;
  label?: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
};

export function EntityFormFieldControl({
  id,
  label,
  required = false,
  error,
  className,
  children,
}: EntityFormFieldControlProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label ? (
        <Label htmlFor={id}>
          {label}
          {required ? <EntityFormRequiredMark /> : null}
        </Label>
      ) : null}
      {children}
      <EntityFormFieldError message={error} />
    </div>
  );
}
