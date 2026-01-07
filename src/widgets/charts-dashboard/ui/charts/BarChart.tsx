'use client';

import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';

import { ChartItem } from '../../model/types';
import { EChart } from './EChart';

type BarChartProps = {
  items: ChartItem[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  height?: number;
};

const DEFAULT_HEIGHT = 240;
const AXIS_LABEL_STYLE = { color: '#475569', fontSize: 10 };
const AXIS_NAME_STYLE = { color: '#334155', fontSize: 11 };

export function BarChart({ items, xAxisLabel, yAxisLabel, height = DEFAULT_HEIGHT }: BarChartProps) {
  const option = useMemo<EChartsOption>(() => {
    const categories = items.map((item) => item.label);
    const seriesData = items.map((item) => ({
      value: item.hidden ? 0 : item.value,
      itemStyle: {
        color: item.color,
        opacity: item.hidden ? 0 : 0.9,
      },
    }));

    return {
      grid: { left: 80, right: 16, top: 16, bottom: 56, containLabel: true },
      legend: { show: false },
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          const target = Array.isArray(params) ? params[0] : params;
          if (!target) {
            return '';
          }
          const typed = target as { value?: unknown; name?: string; seriesName?: string };
          const rawValue = typed.value;
          const value = Array.isArray(rawValue) ? rawValue[1] : rawValue;
          if (typeof value !== 'number') {
            return '';
          }
          const name = typed.name ?? typed.seriesName ?? '';
          return `${name}<br/>${value}`;
        },
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
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: AXIS_LABEL_STYLE,
        splitLine: { lineStyle: { color: '#e2e8f0', type: 'dashed' } },
      },
      series: [
        {
          type: 'bar',
          data: seriesData,
          barWidth: '50%',
          itemStyle: { borderRadius: [6, 6, 0, 0] },
        },
      ],
    };
  }, [items, xAxisLabel, yAxisLabel]);

  return <EChart option={option} style={{ height }} />;
}
