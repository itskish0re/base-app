import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const Route = createFileRoute('/_authenticated/')({
  component: HomePage,
});

function HomePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
        <CardDescription>
          Billing v3 frontend with shadcn (Base UI), TanStack Router, Query, Form, Table, and Redux
          Toolkit.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Master screens (name boards, trucks, drivers) will be added next using TanStack Table for
          grids.
        </p>
      </CardContent>
    </Card>
  );
}
