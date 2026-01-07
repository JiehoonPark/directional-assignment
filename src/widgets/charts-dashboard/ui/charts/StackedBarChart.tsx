'use client';

import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';

import { formatAxisTooltip } from '../../lib/formatAxisTooltip';
import { normalizeStackedData } from '../../lib/normalizeStackedData';
import { StackedDatum, StackedSeries } from '../../model/types';
import { EChart } from './EChart';

type StackedBarChartProps = {
  data: StackedDatum[];
  series: StackedSeries[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  height?: number;
};

const DEFAULT_HEIGHT = 240;
const AXIS_LABEL_STYLE = { color: '#475569', fontSize: 10 };
const AXIS_NAME_STYLE = { color: '#334155', fontSize: 11 };

export function StackedBarChart({
  data,
  series,
  xAxisLabel,
  yAxisLabel,
  height = DEFAULT_HEIGHT,
}: StackedBarChartProps) {
  const option = useMemo<EChartsOption>(() => {
    const categories = data.map((item) => item.label);
    const { activeSeries, normalized } = normalizeStackedData(data, series);

    return {
      grid: { left: 64, right: 16, top: 16, bottom: 56, containLabel: true },
      legend: { show: false },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params) => formatAxisTooltip(params, '%'),
      },
      xAxis: {
        type: 'category',
        name: xAxisLabel,
        nameLocation: 'middle',
        nameGap: 32,
        nameTextStyle: AXIS_NAME_STYLE,
        data: categories,
        axisTick: { show: false },
        axisLine: { lineStyle: { color: '#e2e8f0' } },
        axisLabel: AXIS_LABEL_STYLE,
      },
      yAxis: {
        type: 'value',
        name: yAxisLabel,
        nameLocation: 'middle',
        nameGap: 40,
        nameRotate: 0,
        nameTextStyle: AXIS_NAME_STYLE,
        max: 100,
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: { ...AXIS_LABEL_STYLE, formatter: '{value}%' },
        splitLine: { lineStyle: { color: '#e2e8f0', type: 'dashed' } },
      },
      series: activeSeries.map((seriesItem) => ({
        name: seriesItem.label,
        type: 'bar',
        stack: 'total',
        emphasis: { focus: 'series' },
        itemStyle: { color: seriesItem.color },
        data: normalized.map((item) => Number((item.values[seriesItem.id] ?? 0).toFixed(1))),
      })),
    };
  }, [data, series, xAxisLabel, yAxisLabel]);

  return <EChart option={option} style={{ height }} />;
}
