'use client';

import dynamic from 'next/dynamic';
import type { CSSProperties } from 'react';
import type { EChartsOption } from 'echarts';

const ReactECharts = dynamic(
  () => import('echarts-for-react').then((mod) => mod.default ?? mod),
  { ssr: false },
);

type EChartProps = {
  option: EChartsOption;
  style?: CSSProperties;
  className?: string;
};

export function EChart({ option, style, className }: EChartProps) {
  const mergedStyle: CSSProperties = {
    width: '100%',
    ...style,
  };

  return <ReactECharts option={option} style={mergedStyle} className={className} notMerge />;
}
