type AxisGuideProps = {
  xLabel?: string;
  yLabel?: string;
  ySecondaryLabel?: string;
  valueLabel?: string;
};

export function AxisGuide({ xLabel, yLabel, ySecondaryLabel, valueLabel }: AxisGuideProps) {
  const labels: string[] = [];

  if (valueLabel) {
    labels.push(`값: ${valueLabel}`);
  }
  if (xLabel) {
    labels.push(`X축: ${xLabel}`);
  }
  if (ySecondaryLabel) {
    if (yLabel) {
      labels.push(`Y축(좌): ${yLabel}`);
    }
    labels.push(`Y축(우): ${ySecondaryLabel}`);
  } else if (yLabel) {
    labels.push(`Y축: ${yLabel}`);
  }

  if (labels.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 text-[11px]">
      {labels.map((label, index) => (
        <span key={`${label}-${index}`}>{label}</span>
      ))}
    </div>
  );
}
