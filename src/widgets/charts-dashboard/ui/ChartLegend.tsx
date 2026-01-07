'use client';

import {
  memo,
  useCallback,
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent,
  type SyntheticEvent,
} from 'react';

import type { ChartSeriesItem } from '../model/types';

type ChartLegendProps = {
  items: ChartSeriesItem[];
  onToggle: (id: string) => void;
  onColorChange: (id: string, color: string) => void;
};

export const ChartLegend = memo(function ChartLegend({
  items,
  onToggle,
  onColorChange,
}: ChartLegendProps) {
  const handleClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const id = event.currentTarget.dataset.seriesId;
      if (id) {
        onToggle(id);
      }
    },
    [onToggle],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }
      event.preventDefault();
      const id = event.currentTarget.dataset.seriesId;
      if (id) {
        onToggle(id);
      }
    },
    [onToggle],
  );

  const handleColorChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const id = event.currentTarget.dataset.seriesId;
      if (id) {
        onColorChange(id, event.currentTarget.value);
      }
    },
    [onColorChange],
  );

  const preventToggle = useCallback((event: SyntheticEvent<HTMLInputElement>) => {
    event.stopPropagation();
  }, []);

  return (
    <div className="flex flex-wrap gap-2 text-xs">
      {items.map((item) => {
        const isHidden = item.hidden ?? false;
        return (
          <div
            key={item.id}
            data-series-id={item.id}
            role="button"
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            aria-pressed={!isHidden}
            className={`flex cursor-pointer items-center gap-2 rounded-md border border-subtle px-3 py-2 text-left transition ${
              isHidden ? 'opacity-60' : 'bg-white hover:bg-slate-50'
            }`}
          >
            <input
              aria-label={`${item.label} 색상 변경`}
              type="color"
              value={item.color}
              data-series-id={item.id}
              onPointerDown={preventToggle}
              onClick={preventToggle}
              onKeyDown={preventToggle}
              onChange={handleColorChange}
              className="h-6 w-6 cursor-pointer rounded border border-subtle bg-white p-0"
            />
            <span className={`${isHidden ? 'text-slate-500' : 'text-slate-900'}`}>
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
});
