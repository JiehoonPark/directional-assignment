import { httpRequest } from '@/shared/api';
import { SnackImpactResponse } from '../model/types';

export async function getSnackImpact() {
  return httpRequest<SnackImpactResponse>('/mock/snack-impact', { method: 'GET' });
}
