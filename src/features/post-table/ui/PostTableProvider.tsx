'use client';

import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { ColumnDef, Table } from '@tanstack/react-table';
import { Eye, EyeOff, SlidersHorizontal } from 'lucide-react';

import { CategoryBadge, type Post } from '@/entities/post';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Popover } from '@/shared/ui/popover';
import { formatDateTime } from '@/shared/lib/format';

import { columnLabels } from '../config/tableConfig';
import { usePostTable } from '../model/usePostTable';

type PostTableContextValue = {
  table: Table<Post>;
};

const PostTableContext = createContext<PostTableContextValue | null>(null);

const usePostTableContext = () => {
  const context = useContext(PostTableContext);
  if (!context) {
    throw new Error('PostTableProvider가 필요합니다.');
  }
  return context;
};

type PostTableProviderProps = {
  data: Post[];
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
  actionsEnabled?: boolean;
  showActions?: boolean;
  children: ReactNode;
};

const usePostTableColumns = ({
  onEdit,
  onDelete,
  actionsEnabled,
  showActions,
}: Pick<PostTableProviderProps, 'onEdit' | 'onDelete' | 'actionsEnabled' | 'showActions'>) =>
  useMemo<ColumnDef<Post>[]>(() => {
    // 기본 컬럼 정의 (상태 변경 시에도 참조가 안정적으로 유지되도록 메모이즈)
    const baseColumns: ColumnDef<Post>[] = [
      {
        header: '제목',
        accessorKey: 'title',
        cell: (ctx) => (
          <div>
            <p className="font-semibold text-slate-900">{ctx.getValue<string>()}</p>
            <p className="text-xs text-muted">{ctx.row.original.id}</p>
          </div>
        ),
        size: 240,
      },
      {
        header: '카테고리',
        accessorKey: 'category',
        cell: (ctx) => <CategoryBadge category={ctx.getValue<Post['category']>()} />,
        size: 120,
      },
      {
        header: '태그',
        accessorKey: 'tags',
        cell: (ctx) => (
          <div className="flex flex-wrap gap-1">
            {(ctx.getValue<string[]>() ?? []).map((tag) => (
              <Badge key={tag} tone="muted">
                {tag}
              </Badge>
            ))}
          </div>
        ),
        size: 200,
      },
      {
        header: '작성일',
        accessorKey: 'createdAt',
        cell: (ctx) => <span>{formatDateTime(ctx.getValue<string>())}</span>,
        size: 180,
      },
    ];

    if (!showActions) {
      return baseColumns;
    }

    // 내 글 보기에서만 액션 컬럼을 추가
    return [
      ...baseColumns,
      {
        id: 'actions',
        header: () => <span className="block text-center">액션</span>,
        cell: (ctx) => (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={(event) => {
                event.stopPropagation();
                onEdit(ctx.row.original);
              }}
              disabled={!actionsEnabled}
            >
              수정
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(ctx.row.original);
              }}
              disabled={!actionsEnabled}
            >
              삭제
            </Button>
          </div>
        ),
        size: 150,
        enableResizing: false,
      },
    ];
  }, [actionsEnabled, onDelete, onEdit, showActions]);

export function PostTableProvider({
  data,
  onEdit,
  onDelete,
  actionsEnabled = true,
  showActions = true,
  children,
}: PostTableProviderProps) {
  const columns = usePostTableColumns({ onEdit, onDelete, actionsEnabled, showActions });
  const table = usePostTable({ data, columns });

  return <PostTableContext.Provider value={{ table }}>{children}</PostTableContext.Provider>;
}

export function PostTableColumnToggle() {
  const { table } = usePostTableContext();

  return (
    <Popover
      trigger={
        <Button variant="secondary" size="sm" className="gap-2 px-3 rounded-full">
          <SlidersHorizontal size={16} />
          컬럼
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
          <span>컬럼 표시 설정</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={() => {
              table.resetColumnVisibility();
              table.resetColumnSizing();
            }}
          >
            초기화
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          {table
            .getAllLeafColumns()
            .map((column) => {
              const visible = column.getIsVisible();
              return (
                <button
                  key={column.id}
                  className="flex items-center justify-between px-3 py-2 text-sm transition rounded-md text-slate-700 hover:bg-slate-50"
                  onClick={() => column.toggleVisibility(!visible)}
                >
                  <span className="font-medium">{columnLabels[column.id] ?? column.id}</span>
                  <span
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full border ${
                      visible
                        ? 'border-(--accent)/40 bg-(--accent)/10 text-(--accent)'
                        : 'border-subtle text-slate-400'
                    }`}
                    aria-hidden
                  >
                    {visible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </span>
                </button>
              );
            })}
        </div>
        <div className="px-3 py-2 text-xs rounded-md bg-slate-50 text-muted">
          헤더 가장자리를 드래그해서 너비를 조절할 수 있습니다.
        </div>
      </div>
    </Popover>
  );
}

export { usePostTableContext };
