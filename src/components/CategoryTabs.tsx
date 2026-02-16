'use client';

import type { Category } from '@/types/database';

const TABS: { label: string; value: Category | null }[] = [
  { label: '전체', value: null },
  { label: '다큐멘터리', value: 'documentary' },
  { label: '책', value: 'book' },
  { label: '기사', value: 'article' },
];

interface CategoryTabsProps {
  active: Category | null;
  onChange: (category: Category | null) => void;
}

export default function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  return (
    <div className="flex gap-2">
      {TABS.map(({ label, value }) => (
        <button
          key={label}
          onClick={() => onChange(value)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            active === value
              ? 'bg-accent text-white'
              : 'text-muted hover:text-foreground hover:bg-foreground/5'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
