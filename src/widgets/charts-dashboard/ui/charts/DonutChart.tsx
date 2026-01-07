'use client';

import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';

import { ChartItem } from '../../model/types';
import { EChart } from './EChart';

type DonutChartProps = {
  items: ChartItem[];
  height?: number;
};

const DEFAULT_HEIGHT = 240;

export function DonutChart({ items, height = DEFAULT_HEIGHT }: DonutChartProps) {
  const option = useMemo<EChartsOption>(() => {
    const visibleItems = items.filter((item) => !(item.hidden ?? false));
    const total = visibleItems.reduce((sum, item) => sum + item.value, 0);
    const data = visibleItems.map((item) => ({
      value: item.value,
      name: item.label,
      itemStyle: { color: item.color },
    }));

    return {
      legend: { show: false },
      title: {
        text: String(total),
        subtext: '총합',
        left: 'center',
        top: 'center',
        textStyle: {
          fontSize: 20,
          fontWeight: 700,
          color: '#0f172a',
        },
        subtextStyle: {
          fontSize: 12,
          color: '#64748b',
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}<br/>{c} ({d}%)',
      },
      series: [
        {
          type: 'pie',
          radius: ['55%', '80%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: true,
          label: { show: false },
          data,
        },
      ],
    };
  }, [items]);

  return <EChart option={option} style={{ height }} />;
}
