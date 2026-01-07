'use client';

import { useMemo } from 'react';

import {
  useCoffeeConsumptionQuery,
  usePopularSnackBrandsQuery,
  useSnackImpactQuery,
  useWeeklyMoodTrendQuery,
  useWeeklyWorkoutTrendQuery,
} from '@/features/metrics';
import { Section } from '@/shared/ui/section';

import {
  MOOD_SERIES,
  SNACK_COLORS,
  TEAM_COLORS,
  WORKOUT_SERIES,
} from '../config/chartConstants';
import { useChartSeriesState } from '../model/useChartSeriesState';
import { ChartCard } from './ChartCard';
import { ChartLegend } from './ChartLegend';
import { AxisGuide } from './AxisGuide';
import { BarChart } from './charts/BarChart';
import { DonutChart } from './charts/DonutChart';
import { MultiLineChart } from './charts/MultiLineChart';
import { StackedAreaChart } from './charts/StackedAreaChart';
import { StackedBarChart } from './charts/StackedBarChart';
import { LineStyleGuide } from './LineStyleGuide';
import { ChartItem, MultiLineGroup, StackedDatum } from '../model/types';

const formatWeekLabel = (value: string) => value.slice(5).replace('-', '.');

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : '데이터를 불러오지 못했습니다.';

export function ChartsDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <MoodDistributionSection />
      <SnackBrandSection />
      <MoodTrendSection />
      <WorkoutTrendSection />
      <CoffeeConsumptionSection />
      <SnackImpactSection />
    </div>
  );
}

function MoodDistributionSection() {
  const query = useWeeklyMoodTrendQuery();
  const trend = query.data ?? [];
  const seriesState = useChartSeriesState(MOOD_SERIES);
  const averageMap = useMemo(() => {
    const totals = { happy: 0, tired: 0, stressed: 0 };
    if (trend.length === 0) {
      return new Map<string, number>([
        ['happy', 0],
        ['tired', 0],
        ['stressed', 0],
      ]);
    }
    // 주간 비율을 평균으로 요약해 구성 비율 차트에 사용합니다.
    trend.forEach((item) => {
      totals.happy += item.happy;
      totals.tired += item.tired;
      totals.stressed += item.stressed;
    });
    const count = trend.length;
    return new Map<string, number>([
      ['happy', totals.happy / count],
      ['tired', totals.tired / count],
      ['stressed', totals.stressed / count],
    ]);
  }, [trend]);
  const items = useMemo<ChartItem[]>(
    () =>
      seriesState.series.map((item) => ({
        ...item,
        value: Number((averageMap.get(item.id) ?? 0).toFixed(1)),
      })),
    [seriesState.series, averageMap],
  );

  const errorMessage = query.error ? getErrorMessage(query.error) : undefined;

  return (
    <Section title="감정 구성 비율">
      <div className="flex flex-col gap-4">
        <ChartLegend
          items={seriesState.series}
          onToggle={seriesState.toggleSeries}
          onColorChange={seriesState.updateSeriesColor}
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="바 차트"
            isLoading={query.isLoading}
            errorMessage={errorMessage}
            footer={<AxisGuide xLabel="감정" yLabel="평균 비율(%)" />}
          >
            <BarChart items={items} xAxisLabel="감정" yAxisLabel="평균 비율(%)" />
          </ChartCard>
          <ChartCard
            title="도넛 차트"
            isLoading={query.isLoading}
            errorMessage={errorMessage}
            footer={<AxisGuide valueLabel="평균 비율(%)" />}
          >
            <DonutChart items={items} />
          </ChartCard>
        </div>
      </div>
    </Section>
  );
}

function SnackBrandSection() {
  const query = usePopularSnackBrandsQuery();
  const brands = query.data ?? [];
  const seriesDefinition = useMemo(
    () =>
      brands.map((item, index) => ({
        id: item.name,
        label: item.name,
        color: SNACK_COLORS[index % SNACK_COLORS.length],
      })),
    [brands],
  );
  const seriesState = useChartSeriesState(seriesDefinition);
  const valueMap = useMemo(
    () => new Map(brands.map((item) => [item.name, item.share])),
    [brands],
  );
  const items = useMemo<ChartItem[]>(
    () =>
      seriesState.series.map((item) => ({
        ...item,
        value: valueMap.get(item.id) ?? 0,
      })),
    [seriesState.series, valueMap],
  );

  const errorMessage = query.error ? getErrorMessage(query.error) : undefined;

  return (
    <Section title="스낵 브랜드 점유율">
      <div className="flex flex-col gap-4">
        <ChartLegend
          items={seriesState.series}
          onToggle={seriesState.toggleSeries}
          onColorChange={seriesState.updateSeriesColor}
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="바 차트"
            isLoading={query.isLoading}
            errorMessage={errorMessage}
            footer={<AxisGuide xLabel="브랜드" yLabel="점유율(%)" />}
          >
            <BarChart items={items} xAxisLabel="브랜드" yAxisLabel="점유율(%)" />
          </ChartCard>
          <ChartCard
            title="도넛 차트"
            isLoading={query.isLoading}
            errorMessage={errorMessage}
            footer={<AxisGuide valueLabel="점유율(%)" />}
          >
            <DonutChart items={items} />
          </ChartCard>
        </div>
      </div>
    </Section>
  );
}

function MoodTrendSection() {
  const query = useWeeklyMoodTrendQuery();
  const trend = query.data ?? [];
  const seriesState = useChartSeriesState(MOOD_SERIES);
  const data = useMemo<StackedDatum[]>(
    () =>
      trend.map((item) => ({
        label: formatWeekLabel(item.week),
        values: {
          happy: item.happy,
          tired: item.tired,
          stressed: item.stressed,
        },
      })),
    [trend],
  );

  const errorMessage = query.error ? getErrorMessage(query.error) : undefined;

  return (
    <Section title="주간 감정 추이">
      <div className="flex flex-col gap-4">
        <ChartLegend
          items={seriesState.series}
          onToggle={seriesState.toggleSeries}
          onColorChange={seriesState.updateSeriesColor}
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="스택형 바"
            isLoading={query.isLoading}
            errorMessage={errorMessage}
            footer={<AxisGuide xLabel="주차(week)" yLabel="비율(%)" />}
          >
            <StackedBarChart
              data={data}
              series={seriesState.series}
              xAxisLabel="주차(week)"
              yAxisLabel="비율(%)"
            />
          </ChartCard>
          <ChartCard
            title="스택형 면적"
            isLoading={query.isLoading}
            errorMessage={errorMessage}
            footer={<AxisGuide xLabel="주차(week)" yLabel="비율(%)" />}
          >
            <StackedAreaChart
              data={data}
              series={seriesState.series}
              xAxisLabel="주차(week)"
              yAxisLabel="비율(%)"
            />
          </ChartCard>
        </div>
      </div>
    </Section>
  );
}

function WorkoutTrendSection() {
  const query = useWeeklyWorkoutTrendQuery();
  const trend = query.data ?? [];
  const seriesState = useChartSeriesState(WORKOUT_SERIES);
  const data = useMemo<StackedDatum[]>(
    () =>
      trend.map((item) => ({
        label: formatWeekLabel(item.week),
        values: {
          running: item.running,
          cycling: item.cycling,
          stretching: item.stretching,
        },
      })),
    [trend],
  );

  const errorMessage = query.error ? getErrorMessage(query.error) : undefined;

  return (
    <Section title="주간 운동 추이">
      <div className="flex flex-col gap-4">
        <ChartLegend
          items={seriesState.series}
          onToggle={seriesState.toggleSeries}
          onColorChange={seriesState.updateSeriesColor}
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="스택형 바"
            isLoading={query.isLoading}
            errorMessage={errorMessage}
            footer={<AxisGuide xLabel="주차(week)" yLabel="비율(%)" />}
          >
            <StackedBarChart
              data={data}
              series={seriesState.series}
              xAxisLabel="주차(week)"
              yAxisLabel="비율(%)"
            />
          </ChartCard>
          <ChartCard
            title="스택형 면적"
            isLoading={query.isLoading}
            errorMessage={errorMessage}
            footer={<AxisGuide xLabel="주차(week)" yLabel="비율(%)" />}
          >
            <StackedAreaChart
              data={data}
              series={seriesState.series}
              xAxisLabel="주차(week)"
              yAxisLabel="비율(%)"
            />
          </ChartCard>
        </div>
      </div>
    </Section>
  );
}

function CoffeeConsumptionSection() {
  const query = useCoffeeConsumptionQuery();
  const teams = query.data?.teams ?? [];
  const seriesDefinition = useMemo(
    () =>
      teams.map((team, index) => ({
        id: team.team,
        label: team.team,
        color: TEAM_COLORS[index % TEAM_COLORS.length],
      })),
    [teams],
  );
  const { series, toggleSeries, updateSeriesColor } = useChartSeriesState(seriesDefinition);
  const groups = useMemo<MultiLineGroup[]>(() => {
    const teamMap = new Map(teams.map((team) => [team.team, team]));
    return series.map((item) => {
      const team = teamMap.get(item.id);
      return {
        ...item,
        points:
          team?.series.map((point) => ({
            x: point.cups,
            left: point.bugs,
            right: point.productivity,
          })) ?? [],
      };
    });
  }, [series, teams]);

  const errorMessage = query.error ? getErrorMessage(query.error) : undefined;

  return (
    <Section title="커피 섭취량과 팀 성과">
      <ChartCard
        title="멀티라인"
        legend={
          <ChartLegend
            items={series}
            onToggle={toggleSeries}
            onColorChange={updateSeriesColor}
          />
        }
        isLoading={query.isLoading}
        errorMessage={errorMessage}
        footer={(
          <div className="flex flex-col gap-1">
            <AxisGuide xLabel="커피 섭취량(잔/일)" yLabel="버그 수" ySecondaryLabel="생산성" />
            <LineStyleGuide solidLabel="버그 수" dashedLabel="생산성" />
          </div>
        )}
      >
        <MultiLineChart
          groups={groups}
          xAxisLabel="커피 섭취량(잔/일)"
          leftAxisLabel="버그 수"
          rightAxisLabel="생산성"
          tooltipLabels={{ x: '커피 잔수', left: '버그 수', right: '생산성' }}
        />
      </ChartCard>
    </Section>
  );
}

function SnackImpactSection() {
  const query = useSnackImpactQuery();
  const departments = query.data?.departments ?? [];
  const seriesDefinition = useMemo(
    () =>
      departments.map((department, index) => ({
        id: department.name,
        label: department.name,
        color: TEAM_COLORS[index % TEAM_COLORS.length],
      })),
    [departments],
  );
  const { series, toggleSeries, updateSeriesColor } = useChartSeriesState(seriesDefinition);
  const groups = useMemo<MultiLineGroup[]>(() => {
    const departmentMap = new Map(departments.map((department) => [department.name, department]));
    return series.map((item) => {
      const department = departmentMap.get(item.id);
      return {
        ...item,
        points:
          department?.metrics.map((metric) => ({
            x: metric.snacks,
            left: metric.meetingsMissed,
            right: metric.morale,
          })) ?? [],
      };
    });
  }, [departments, series]);

  const errorMessage = query.error ? getErrorMessage(query.error) : undefined;

  return (
    <Section title="스낵 섭취량과 조직 상태">
      <ChartCard
        title="멀티라인"
        legend={
          <ChartLegend
            items={series}
            onToggle={toggleSeries}
            onColorChange={updateSeriesColor}
          />
        }
        isLoading={query.isLoading}
        errorMessage={errorMessage}
        footer={(
          <div className="flex flex-col gap-1">
            <AxisGuide xLabel="스낵 섭취량(개/일)" yLabel="회의 불참" ySecondaryLabel="사기" />
            <LineStyleGuide solidLabel="회의 불참" dashedLabel="사기" />
          </div>
        )}
      >
        <MultiLineChart
          groups={groups}
          xAxisLabel="스낵 섭취량(개/일)"
          leftAxisLabel="회의 불참"
          rightAxisLabel="사기"
          tooltipLabels={{ x: '스낵 수', left: '회의 불참', right: '사기' }}
        />
      </ChartCard>
    </Section>
  );
}
