import { httpRequest } from '@/shared/api';
import { WeeklyMoodMetric } from '../model/types';

export async function getWeeklyMoodTrend() {
  return httpRequest<WeeklyMoodMetric[]>('/mock/weekly-mood-trend', { method: 'GET' });
}
