'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { flexRender } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';

import type { Post } from '@/entities/post';
import { Spinner } from '@/shared/ui/spinner';

import { usePostTableContext } from './PostTableProvider';

const SCROLL_LOAD_OFFSET_PX = 200;
const ROW_HEIGHT_PX = 72;
const VIRTUAL_OVERSCAN = 8;

type PostTableProps = {
  isLoading?: boolean;
  onView?: (post: Post) => void;
  onLoadMore?: () => void;
  canLoadMore?: boolean;
  isFetchingMore?: boolean;
};

export function PostTable({
  isLoading,
  onView,
  onLoadMore,
  canLoadMore,
  isFetchingMore,
}: PostTableProps) {
  const { table } = usePostTableContext();
  const rows = table.getRowModel().rows;
  const visibleColumns = table.getVisibleLeafColumns();
  // 남는 폭은 리사이즈 가능한 컬럼에만 분배
  const growableColumns = visibleColumns.filter((column) => column.getCanResize());
  const lastVisibleColumnId = visibleColumns[visibleColumns.length - 1]?.id;
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const lastLoadCountRef = useRef(-1);
  const hasUserScrolledRef = useRef(false);
  const didAutoFitOnceRef = useRef(false);
  const [scrollContainerWidth, setScrollContainerWidth] = useState(0);
  const [hasVerticalScrollbar, setHasVerticalScrollbar] = useState(false);

  useEffect(() => {
    const element = scrollContainerRef.current;
    if (!element) return;

    const updateLayout = () => {
      setScrollContainerWidth(element.clientWidth);
      setHasVerticalScrollbar(element.scrollHeight > element.clientHeight + 1);
    };
    updateLayout();

    const observer = new ResizeObserver(() => updateLayout());
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  // 스크롤 컨테이너 기준으로 행 가상화 (무한스크롤 최적화)
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => ROW_HEIGHT_PX,
    overscan: VIRTUAL_OVERSCAN,
    useFlushSync: false,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalColumnWidth = table.getTotalSize();
  const extraAvailableWidth = Math.max(0, scrollContainerWidth - totalColumnWidth);
  const growableWidthTotal = growableColumns.reduce((sum, column) => sum + column.getSize(), 0);
  const growableExtraRatio =
    growableWidthTotal > 0 ? extraAvailableWidth / growableWidthTotal : 0;
  const virtualRowsHeight = rowVirtualizer.getTotalSize();
  const hasHorizontalOverflow =
    scrollContainerWidth > 0 && totalColumnWidth > scrollContainerWidth + 1;

  useEffect(() => {
    // 최초 진입 시 컨테이너 폭에 맞춰 컬럼 폭을 자동 보정
    if (didAutoFitOnceRef.current) return;
    if (!scrollContainerWidth) return;

    const currentSizing = table.getState().columnSizing;
    if (Object.keys(currentSizing).length > 0) {
      didAutoFitOnceRef.current = true;
      return;
    }

    const currentTotal = table.getTotalSize();
    if (currentTotal <= scrollContainerWidth) {
      didAutoFitOnceRef.current = true;
      return;
    }

    const fixedColumns = visibleColumns.filter((column) => !column.getCanResize());
    const fixedTotal = fixedColumns.reduce((sum, column) => sum + column.getSize(), 0);
    const availableWidth = scrollContainerWidth - fixedTotal;
    if (availableWidth <= 0 || growableWidthTotal === 0) {
      didAutoFitOnceRef.current = true;
      return;
    }

    const scale = availableWidth / growableWidthTotal;
    const defaultMinSize = table.options.defaultColumn?.minSize ?? 80;
    const defaultMaxSize = table.options.defaultColumn?.maxSize ?? 400;
    const nextSizing: Record<string, number> = {};

    growableColumns.forEach((column) => {
      const minSize = column.columnDef.minSize ?? defaultMinSize;
      const maxSize = column.columnDef.maxSize ?? defaultMaxSize;
      const targetSize = Math.round(column.getSize() * scale);
      nextSizing[column.id] = Math.min(maxSize, Math.max(minSize, targetSize));
    });

    table.setColumnSizing(nextSizing);
    didAutoFitOnceRef.current = true;
  }, [growableColumns, growableWidthTotal, scrollContainerWidth, table, visibleColumns]);

  useEffect(() => {
    const element = scrollContainerRef.current;
    if (!element) return;
    const frame = window.requestAnimationFrame(() => {
      setHasVerticalScrollbar(element.scrollHeight > element.clientHeight + 1);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [scrollContainerWidth, rows.length, virtualRowsHeight]);

  const triggerLoadMore = useCallback(() => {
    if (!onLoadMore || !canLoadMore || isFetchingMore) return;
    if (!hasUserScrolledRef.current) return;
    if (lastLoadCountRef.current === rows.length) return;
    lastLoadCountRef.current = rows.length;
    onLoadMore();
  }, [canLoadMore, isFetchingMore, onLoadMore, rows.length]);

  useEffect(() => {
    lastLoadCountRef.current = -1;
    hasUserScrolledRef.current = false;
  }, [canLoadMore]);

  const showEmptyState = !isLoading && rows.length === 0;
  const showLoadingState = isLoading && rows.length === 0;

  return (
    <div className="flex flex-col gap-3 h-full min-h-0">
      <div
        ref={scrollContainerRef}
        onScroll={() => {
          hasUserScrolledRef.current = true;
          const container = scrollContainerRef.current;
          if (!container) return;
          const remaining =
            container.scrollHeight - container.clientHeight - container.scrollTop;
          // 실제 스크롤 이동이 있을 때만 다음 페이지를 요청
          if (remaining <= SCROLL_LOAD_OFFSET_PX) {
            triggerLoadMore();
          }
        }}
        className={`relative flex-1 min-h-0 border border-subtle rounded-lg bg-white ${
          hasHorizontalOverflow ? 'overflow-x-auto' : 'overflow-x-hidden'
        } overflow-y-auto`}
        style={{
          scrollbarGutter: hasVerticalScrollbar ? 'stable' : 'auto',
          overscrollBehavior: 'contain',
        }}
      >
        <table
          className="text-sm border-collapse"
          style={{ width: totalColumnWidth, minWidth: '100%', display: 'grid' }}
        >
          <thead className="sticky top-0 z-10 bg-slate-50" style={{ display: 'grid' }}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} style={{ display: 'flex', width: '100%' }}>
                {headerGroup.headers.map((header) => {
                  const columnWidth =
                    header.getSize() +
                    (header.column.getCanResize() ? header.getSize() * growableExtraRatio : 0);
                  return (
                    <th
                      key={header.id}
                      className="relative border-b border-subtle border-r last:border-r-0 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                      style={{ width: columnWidth, flex: `0 0 ${columnWidth}px` }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanResize() &&
                      header.column.id !== lastVisibleColumnId ? (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className="resize-handle"
                        />
                      ) : null}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody
            className="relative block w-full"
            style={{ height: `${virtualRowsHeight}px` }}
          >
            {virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index];
              if (!row) return null;
              const visibleCells = row.getVisibleCells();
              return (
                <tr
                  key={row.id}
                  className={`border-b border-subtle hover:bg-slate-50 transition h-18 overflow-hidden ${
                    onView ? 'cursor-pointer' : ''
                  }`}
                  onClick={onView ? () => onView(row.original) : undefined}
                  style={{
                    display: 'flex',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                    height: `${ROW_HEIGHT_PX}px`,
                  }}
                >
                  {visibleCells.map((cell) => {
                    const cellWidth =
                      cell.column.getSize() +
                      (cell.column.getCanResize()
                        ? cell.column.getSize() * growableExtraRatio
                        : 0);
                    return (
                      <td
                        key={cell.id}
                        className="px-4 py-3 align-top border-r border-subtle last:border-r-0 overflow-hidden"
                        style={{
                          width: cellWidth,
                          flex: `0 0 ${cellWidth}px`,
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

        {showLoadingState ? (
          <div className="absolute inset-0 flex items-center justify-center gap-2 text-sm text-muted">
            <Spinner /> 불러오는 중...
          </div>
        ) : null}
        {showEmptyState ? (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-muted">
            게시글이 없습니다.
          </div>
        ) : null}
        {isFetchingMore ? (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-white px-3 py-1 text-xs text-muted shadow-sm">
              <Spinner /> 더 불러오는 중...
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
