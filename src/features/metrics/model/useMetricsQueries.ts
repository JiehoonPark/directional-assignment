'use client';

import { useQuery } from '@tanstack/react-query';

import { metricsApi } from '@/entities/metrics';

const STATIC_STALE_TIME = Infinity;

export function useTopCoffeeBrandsQuery() {
  return useQuery({
    queryKey: ['metrics', 'top-coffee-brands'],
    queryFn: metricsApi.getTopCoffeeBrands,
    staleTime: STATIC_STALE_TIME,
  });
}

export function usePopularSnackBrandsQuery() {
  return useQuery({
    queryKey: ['metrics', 'popular-snack-brands'],
    queryFn: metricsApi.getPopularSnackBrands,
    staleTime: STATIC_STALE_TIME,
  });
}

export function useWeeklyMoodTrendQuery() {
  return useQuery({
    queryKey: ['metrics', 'weekly-mood-trend'],
    queryFn: metricsApi.getWeeklyMoodTrend,
    staleTime: STATIC_STALE_TIME,
  });
}

export function useWeeklyWorkoutTrendQuery() {
  return useQuery({
    queryKey: ['metrics', 'weekly-workout-trend'],
    queryFn: metricsApi.getWeeklyWorkoutTrend,
    staleTime: STATIC_STALE_TIME,
  });
}

export function useCoffeeConsumptionQuery() {
  return useQuery({
    queryKey: ['metrics', 'coffee-consumption'],
    queryFn: metricsApi.getCoffeeConsumption,
    staleTime: STATIC_STALE_TIME,
  });
}

export function useSnackImpactQuery() {
  return useQuery({
    queryKey: ['metrics', 'snack-impact'],
    queryFn: metricsApi.getSnackImpact,
    staleTime: STATIC_STALE_TIME,
  });
}
