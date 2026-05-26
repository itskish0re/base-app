import { Card } from '@/components/ui/card';
import { LoginForm } from '@/pages/login/form';

export function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <LoginForm />
      </Card>
    </div>
  );
}
