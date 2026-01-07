import { httpRequest } from '@/shared/api';
import { WeeklyWorkoutMetric } from '../model/types';

export async function getWeeklyWorkoutTrend() {
  return httpRequest<WeeklyWorkoutMetric[]>('/mock/weekly-workout-trend', { method: 'GET' });
}
