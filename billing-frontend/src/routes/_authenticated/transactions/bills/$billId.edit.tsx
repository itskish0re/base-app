import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/transactions/bills/$billId/edit')({
  component: BillEditPlaceholder,
});

function BillEditPlaceholder() {
  const { billId } = Route.useParams();
  return (
    <p className="text-sm text-muted-foreground">
      Bill edit screen for bill #{billId} — form UI coming next.
    </p>
  );
}
