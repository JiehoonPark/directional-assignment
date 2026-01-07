'use client';

import { useCallback, useEffect, useState } from 'react';

import type { ChartSeriesItem } from './types';

function isSameSeriesState(previous: ChartSeriesItem[], next: ChartSeriesItem[]) {
  if (previous.length !== next.length) {
    return false;
  }
  return previous.every((item, index) => {
    const candidate = next[index];
    if (!candidate) {
      return false;
    }
    const previousHidden = item.hidden ?? false;
    const nextHidden = candidate.hidden ?? false;
    return (
      item.id === candidate.id &&
      item.label === candidate.label &&
      item.color === candidate.color &&
      previousHidden === nextHidden
    );
  });
}

function mergeSeriesState(previous: ChartSeriesItem[], next: ChartSeriesItem[]) {
  const previousMap = new Map(previous.map((item) => [item.id, item]));
  return next.map((item) => {
    const persisted = previousMap.get(item.id);
    if (!persisted) {
      return { ...item, hidden: false };
    }
    return {
      ...item,
      color: persisted.color,
      hidden: persisted.hidden ?? false,
    };
  });
}

export function useChartSeriesState(initialSeries: ChartSeriesItem[]) {
  const [series, setSeries] = useState<ChartSeriesItem[]>(() => initialSeries);

  useEffect(() => {
    // initialSeries가 렌더마다 새 배열이더라도 동일 상태면 갱신을 막아 무한 업데이트를 방지합니다.
    setSeries((prev) => {
      const merged = mergeSeriesState(prev, initialSeries);
      return isSameSeriesState(prev, merged) ? prev : merged;
    });
  }, [initialSeries]);

  const toggleSeries = useCallback((id: string) => {
    setSeries((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, hidden: !(item.hidden ?? false) } : item,
      ),
    );
  }, []);

  const updateSeriesColor = useCallback((id: string, color: string) => {
    setSeries((prev) => prev.map((item) => (item.id === id ? { ...item, color } : item)));
  }, []);

  return { series, toggleSeries, updateSeriesColor };
}
