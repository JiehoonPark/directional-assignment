import { StackedDatum, StackedSeries } from '../model/types';

type NormalizedStackedData = {
  activeSeries: StackedSeries[];
  normalized: StackedDatum[];
};

export function normalizeStackedData(
  data: StackedDatum[],
  series: StackedSeries[],
): NormalizedStackedData {
  const activeSeries = series.filter((item) => !item.hidden);
  const normalized = data.map((item) => {
    const total = activeSeries.reduce((sum, current) => sum + (item.values[current.id] ?? 0), 0);
    const values: Record<string, number> = {};
    let remaining = 100;

    activeSeries.forEach((current, index) => {
      if (total <= 0) {
        values[current.id] = 0;
        return;
      }
      if (index === activeSeries.length - 1) {
        values[current.id] = Math.max(0, remaining);
        return;
      }
      const percentage = ((item.values[current.id] ?? 0) / total) * 100;
      const clamped = Math.min(percentage, remaining);
      values[current.id] = clamped;
      remaining -= clamped;
    });

    return { label: item.label, values };
  });

  return { activeSeries, normalized };
}
