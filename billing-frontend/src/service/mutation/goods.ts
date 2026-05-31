import {
  createGoods,
  deleteGoods,
  toggleGoods,
  updateGoods,
} from '@/service/api/functions/goods';
import type {
  BatchCreateGoodsRequest,
  BatchDeleteGoodsRequest,
  BatchToggleGoodsRequest,
  BatchUpdateGoodsRequest,
} from '@/types/entity';

export const createGoodsMutationOptions = {
  mutationFn: (body: BatchCreateGoodsRequest) => createGoods(body),
};

export const updateGoodsMutationOptions = {
  mutationFn: (body: BatchUpdateGoodsRequest) => updateGoods(body),
};

export const deleteGoodsMutationOptions = {
  mutationFn: (body: BatchDeleteGoodsRequest) => deleteGoods(body),
};

export const toggleGoodsMutationOptions = {
  mutationFn: (body: BatchToggleGoodsRequest) => toggleGoods(body),
};
