import type { ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type EntityFormFieldControlProps = {
  id?: string;
  label: string;
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
      {id ? (
        <Label htmlFor={id}>
          {label}
          {required ? (
            <span className="text-destructive" aria-hidden="true">
              {' '}
              *
            </span>
          ) : null}
        </Label>
      ) : null}
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
