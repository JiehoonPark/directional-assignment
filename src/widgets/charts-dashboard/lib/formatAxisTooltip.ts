type TooltipItem = {
  value?: unknown;
  marker?: string;
  seriesName?: string;
  axisValue?: string | number;
  name?: string;
};

export function formatAxisTooltip(params: unknown, valueSuffix = '') {
  const items = Array.isArray(params) ? params : [params];
  if (items.length === 0) {
    return '';
  }

  const headerSource = items[0] as TooltipItem | undefined;
  const title = headerSource?.axisValue ?? headerSource?.name ?? '';
  const rows = items
    .map((item) => {
      const typed = item as TooltipItem;
      const rawValue = typed.value;
      const value = Array.isArray(rawValue) ? rawValue[1] : rawValue;
      if (typeof value !== 'number') {
        return '';
      }
      const marker = typed.marker ?? '';
      const seriesName = typed.seriesName ?? '';
      return `${marker} ${seriesName}: ${value}${valueSuffix}`.trim();
    })
    .filter(Boolean)
    .join('<br/>');

  if (!rows) {
    return String(title);
  }

  return `${title}<br/>${rows}`;
}
