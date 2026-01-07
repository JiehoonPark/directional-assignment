import type { Post } from '../model/types';

const CATEGORY_TONE: Record<Post['category'], { label: string; className: string }> = {
  NOTICE: { label: 'NOTICE', className: 'bg-red-50 text-red-600' },
  QNA: { label: 'QNA', className: 'bg-amber-50 text-amber-700' },
  FREE: { label: 'FREE', className: 'bg-blue-50 text-blue-700' },
};

type CategoryBadgeProps = {
  category: Post['category'];
};

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const tone = CATEGORY_TONE[category];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${tone.className}`}
    >
      {tone.label}
    </span>
  );
}
