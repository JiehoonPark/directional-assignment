export type ChartSeriesItem = {
  id: string;
  label: string;
  color: string;
  hidden?: boolean;
};

export type ChartItem = ChartSeriesItem & {
  value: number;
};

export type StackedDatum = {
  label: string;
  values: Record<string, number>;
};

export type StackedSeries = ChartSeriesItem;

export type MultiLinePoint = {
  x: number;
  left: number;
  right: number;
};

export type MultiLineGroup = ChartSeriesItem & {
  points: MultiLinePoint[];
};
