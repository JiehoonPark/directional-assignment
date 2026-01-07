import { httpRequest } from '@/shared/api';
import { CoffeeBrandMetric } from '../model/types';

export async function getTopCoffeeBrands() {
  return httpRequest<CoffeeBrandMetric[]>('/mock/top-coffee-brands', { method: 'GET' });
}
