import { useMutation } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { ApiError } from '@/api/client';
import { loginMutationOptions } from '@/api/mutations/auth';
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppDispatch } from '@/store/hooks';
import { DASHBOARD_ROUTE } from '@/lib/routes';
import { setTokens } from '@/store/authSlice';

export function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const loginMutation = useMutation({
    ...loginMutationOptions,
    onSuccess: (tokens) => {
      dispatch(setTokens(tokens));
      void navigate({ to: DASHBOARD_ROUTE });
    },
  });

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      setError(null);
      try {
        await loginMutation.mutateAsync({
          email: value.email.trim(),
          password: value.password,
        });
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Sign in failed. Please try again.');
        }
      }
    },
  });

  return (
    <>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Use your billing account to continue.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) =>
                !value.trim() ? 'Email is required' : undefined,
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  id={field.name}
                  type="email"
                  autoComplete="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors[0] && (
                  <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) =>
                !value ? 'Password is required' : undefined,
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Password</Label>
                <Input
                  id={field.name}
                  type="password"
                  autoComplete="current-password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors[0] && (
                  <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button type="submit" className="w-full" disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? 'Signing in…' : 'Sign in'}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
    </>
  );
}
