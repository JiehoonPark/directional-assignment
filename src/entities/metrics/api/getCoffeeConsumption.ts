import { httpRequest } from '@/shared/api';
import { CoffeeConsumptionResponse } from '../model/types';

export async function getCoffeeConsumption() {
  return httpRequest<CoffeeConsumptionResponse>('/mock/coffee-consumption', { method: 'GET' });
}
