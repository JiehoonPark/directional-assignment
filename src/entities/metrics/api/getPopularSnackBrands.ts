import { httpRequest } from '@/shared/api';
import { SnackBrandMetric } from '../model/types';

export async function getPopularSnackBrands() {
  return httpRequest<SnackBrandMetric[]>('/mock/popular-snack-brands', { method: 'GET' });
}
