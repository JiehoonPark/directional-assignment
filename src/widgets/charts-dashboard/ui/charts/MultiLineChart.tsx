'use client';

import { useMemo } from 'react';
import type { EChartsOption, LineSeriesOption } from 'echarts';

import { MultiLineGroup } from '../../model/types';
import { EChart } from './EChart';

type TooltipLabels = {
  x: string;
  left: string;
  right: string;
};

type MultiLineChartProps = {
  groups: MultiLineGroup[];
  xAxisLabel: string;
  leftAxisLabel: string;
  rightAxisLabel: string;
  tooltipLabels: TooltipLabels;
  height?: number;
};

const DEFAULT_HEIGHT = 260;
const AXIS_LABEL_STYLE = { color: '#475569', fontSize: 10 };
const AXIS_NAME_STYLE = { color: '#334155', fontSize: 11 };

type TooltipPayload = {
  value?: unknown;
  data?: unknown;
  seriesName?: string;
};

type TooltipValue = Array<number | string>;

function resolveTooltipValue(target: TooltipPayload): TooltipValue | null {
  if (Array.isArray(target.value)) {
    return target.value as TooltipValue;
  }

  if (Array.isArray(target.data)) {
    return target.data as TooltipValue;
  }

  if (target.data && typeof target.data === 'object' && 'value' in target.data) {
    const dataValue = (target.data as { value?: unknown }).value;
    if (Array.isArray(dataValue)) {
      return dataValue as TooltipValue;
    }
  }

  return null;
}

function formatTooltip(params: unknown, labels: TooltipLabels) {
  const target = (Array.isArray(params) ? params[0] : params) as TooltipPayload | undefined;
  if (!target) {
    return '';
  }

  const value = resolveTooltipValue(target);

  if (!value) {
    return '';
  }

  const [xValue, leftValue, rightValue] = value;
  const teamLabel = target.seriesName ?? '';

  return `
    <div style="min-width: 140px;">
      <div style="font-weight: 600; margin-bottom: 4px;">${teamLabel}</div>
      <div>${labels.x}: ${xValue}</div>
      <div>${labels.left}: ${leftValue}</div>
      <div>${labels.right}: ${rightValue}</div>
    </div>
  `;
}

export function MultiLineChart({
  groups,
  xAxisLabel,
  leftAxisLabel,
  rightAxisLabel,
  tooltipLabels,
  height = DEFAULT_HEIGHT,
}: MultiLineChartProps) {
  const option = useMemo<EChartsOption>(() => {
    const activeGroups = groups.filter((group) => !group.hidden);
    const series: LineSeriesOption[] = activeGroups.flatMap((group) => {
      const data = group.points.map((point) => [point.x, point.left, point.right]);
      return [
        {
          id: `${group.id}-left`,
          name: group.label,
          type: 'line',
          yAxisIndex: 0,
          encode: { x: 0, y: 1 },
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: { color: group.color, width: 2 },
          itemStyle: { color: group.color },
          data,
        },
        {
          id: `${group.id}-right`,
          name: group.label,
          type: 'line',
          yAxisIndex: 1,
          encode: { x: 0, y: 2 },
          symbol: 'rect',
          symbolSize: 8,
          lineStyle: { color: group.color, width: 2, type: 'dashed' },
          itemStyle: { color: group.color },
          data,
        },
      ] as LineSeriesOption[];
    });

    return {
      grid: { left: 64, right: 64, top: 24, bottom: 60, containLabel: true },
      legend: { show: false },
      tooltip: {
        trigger: 'item',
        formatter: (params) => formatTooltip(params, tooltipLabels),
      },
      xAxis: {
        type: 'value',
        name: xAxisLabel,
        nameLocation: 'middle',
        nameGap: 32,
        nameTextStyle: AXIS_NAME_STYLE,
        axisTick: { show: false },
        axisLine: { lineStyle: { color: '#e2e8f0' } },
        axisLabel: AXIS_LABEL_STYLE,
        splitLine: { lineStyle: { color: '#e2e8f0', type: 'dashed' } },
      },
      yAxis: [
        {
          type: 'value',
          name: leftAxisLabel,
          nameLocation: 'middle',
          nameGap: 40,
          nameRotate: 0,
          nameTextStyle: AXIS_NAME_STYLE,
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: AXIS_LABEL_STYLE,
          splitLine: { lineStyle: { color: '#e2e8f0', type: 'dashed' } },
        },
        {
          type: 'value',
          name: rightAxisLabel,
          nameLocation: 'middle',
          nameGap: 40,
          nameRotate: 0,
          nameTextStyle: AXIS_NAME_STYLE,
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: AXIS_LABEL_STYLE,
          splitLine: { show: false },
        },
      ],
      series,
    };
  }, [groups, leftAxisLabel, rightAxisLabel, tooltipLabels, xAxisLabel]);

  return <EChart option={option} style={{ height }} />;
}
