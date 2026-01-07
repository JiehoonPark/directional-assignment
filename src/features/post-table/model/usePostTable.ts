'use client';

import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';

type UsePostTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData>[];
};

export function usePostTable<TData>({ data, columns }: UsePostTableProps<TData>) {
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
  const [columnSizing, setColumnSizing] = useState<Record<string, number>>({});

  return useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
      columnSizing,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnSizingChange: setColumnSizing,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      minSize: 80,
      size: 120,
      maxSize: 400,
    },
  });
}
