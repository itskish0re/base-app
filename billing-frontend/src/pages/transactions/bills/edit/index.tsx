import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ROUTES } from '@/constants/routes';

/** Entry from sidebar Edit menu: open a bill by id or use the list screen. */
export function BillEditIndexPage() {
  const navigate = useNavigate();
  const [billId, setBillId] = useState('');

  const openBill = () => {
    const id = billId.trim();
    if (!id) {
      return;
    }

    void navigate({
      to: ROUTES.billsEdit,
      params: { billId: id },
    });
  };

  return (
    <div className="mx-auto flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6">
      <div>
        <h1 className="text-lg font-semibold">Edit bill</h1>
        <p className="text-sm text-muted-foreground">
          Enter a bill id to open the edit screen, or pick a row from the Bills list.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="bill-id">Bill id</Label>
        <Input
          id="bill-id"
          value={billId}
          onChange={(e) => setBillId(e.target.value)}
          placeholder="Bill id"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              openBill();
            }
          }}
        />
      </div>
      <Button type="button" onClick={openBill} disabled={!billId.trim()}>
        Open bill
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => void navigate({ to: ROUTES.bills })}
      >
        Go to bill list
      </Button>
    </div>
  );
}
