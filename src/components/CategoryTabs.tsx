'use client';

interface CategoryTabsProps {
  categories: { slug: string; name: string }[];
  active: string | null;
  onChange: (category: string | null) => void;
}

export default function CategoryTabs({
  categories,
  active,
  onChange,
}: CategoryTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="카테고리 필터"
      className="flex flex-wrap gap-2"
    >
      {categories.map(({ slug, name }) => (
        <button
          key={slug}
          role="tab"
          aria-selected={active === slug}
          onClick={() => onChange(slug)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            active === slug
              ? 'bg-accent text-white'
              : 'text-muted hover:text-foreground hover:bg-foreground/5'
          }`}
        >
          {name}
        </button>
      ))}
    </div>
  );
}
