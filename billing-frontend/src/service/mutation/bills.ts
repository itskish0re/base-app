import { saveBill } from '@/service/api/functions/bills';
import type { SaveBillRequest } from '@/types/entity/bill';

export const saveBillMutationOptions = {
  mutationFn: (body: SaveBillRequest) => saveBill(body),
};
