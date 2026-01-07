import type { StackedSeries } from '../model/types';

export const SNACK_COLORS = ['#16a34a', '#f59e0b', '#0ea5e9', '#ef4444', '#64748b'];
export const TEAM_COLORS = ['#2563eb', '#0ea5e9', '#16a34a', '#f97316', '#ef4444'];

export const MOOD_SERIES: StackedSeries[] = [
  { id: 'happy', label: '행복', color: '#22c55e' },
  { id: 'tired', label: '피곤', color: '#f59e0b' },
  { id: 'stressed', label: '스트레스', color: '#ef4444' },
];

export const WORKOUT_SERIES: StackedSeries[] = [
  { id: 'running', label: '러닝', color: '#2563eb' },
  { id: 'cycling', label: '사이클', color: '#14b8a6' },
  { id: 'stretching', label: '스트레칭', color: '#f97316' },
];
