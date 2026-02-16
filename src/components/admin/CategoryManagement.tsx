'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Button from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
}

interface CategoryManagementProps {
  categories: Category[];
}

export default function CategoryManagement({
  categories: initialCategories,
}: CategoryManagementProps) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [saving, setSaving] = useState(false);

  const inputClass =
    'w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent';

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newSlug.trim()) return;

    setSaving(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createClient() as any;
    const maxOrder = Math.max(0, ...categories.map((c) => c.sort_order));

    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: newName.trim(),
        slug: newSlug.trim(),
        sort_order: maxOrder + 1,
      })
      .select()
      .single();

    setSaving(false);

    if (error) {
      alert(`추가 실패: ${error.message}`);
      return;
    }

    setCategories([...categories, data]);
    setNewName('');
    setNewSlug('');
    router.refresh();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" 카테고리를 삭제하시겠습니까?`)) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createClient() as any;
    const { error } = await supabase.from('categories').delete().eq('id', id);

    if (error) {
      alert(`삭제 실패: ${error.message}`);
      return;
    }

    setCategories(categories.filter((c) => c.id !== id));
    router.refresh();
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditSlug(category.slug);
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim() || !editSlug.trim()) return;

    setSaving(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createClient() as any;
    const { error } = await supabase
      .from('categories')
      .update({ name: editName.trim(), slug: editSlug.trim() })
      .eq('id', id);

    setSaving(false);

    if (error) {
      alert(`수정 실패: ${error.message}`);
      return;
    }

    setCategories(
      categories.map((c) =>
        c.id === id
          ? { ...c, name: editName.trim(), slug: editSlug.trim() }
          : c,
      ),
    );
    setEditingId(null);
    router.refresh();
  };

  const handleMove = async (id: string, direction: 'up' | 'down') => {
    const index = categories.findIndex((c) => c.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === categories.length - 1)
    )
      return;

    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    const current = categories[index];
    const swap = categories[swapIndex];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createClient() as any;
    await Promise.all([
      supabase
        .from('categories')
        .update({ sort_order: swap.sort_order })
        .eq('id', current.id),
      supabase
        .from('categories')
        .update({ sort_order: current.sort_order })
        .eq('id', swap.id),
    ]);

    const updated = [...categories];
    updated[index] = { ...current, sort_order: swap.sort_order };
    updated[swapIndex] = { ...swap, sort_order: current.sort_order };
    updated.sort((a, b) => a.sort_order - b.sort_order);
    setCategories(updated);
    router.refresh();
  };

  const nameToSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  return (
    <div className="space-y-6">
      {/* 카테고리 목록 */}
      <div className="space-y-2">
        {categories.map((category, index) => (
          <div
            key={category.id}
            className="flex items-center gap-3 rounded-lg border border-border p-4"
          >
            {editingId === category.id ? (
              <div className="flex flex-1 items-center gap-3">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={`${inputClass} flex-1`}
                  placeholder="카테고리 이름"
                />
                <input
                  type="text"
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                  className={`${inputClass} flex-1`}
                  placeholder="slug"
                />
                <Button
                  onClick={() => handleUpdate(category.id)}
                  disabled={saving}
                >
                  저장
                </Button>
                <Button variant="ghost" onClick={() => setEditingId(null)}>
                  취소
                </Button>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => handleMove(category.id, 'up')}
                    disabled={index === 0}
                    className="text-muted hover:text-foreground disabled:opacity-30 text-xs"
                    aria-label="위로 이동"
                  >
                    &#9650;
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(category.id, 'down')}
                    disabled={index === categories.length - 1}
                    className="text-muted hover:text-foreground disabled:opacity-30 text-xs"
                    aria-label="아래로 이동"
                  >
                    &#9660;
                  </button>
                </div>
                <div className="flex-1">
                  <span className="font-medium">{category.name}</span>
                  <span className="ml-3 text-xs text-muted">
                    {category.slug}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => startEdit(category)}
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  수정
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(category.id, category.name)}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  삭제
                </button>
              </>
            )}
          </div>
        ))}
        {categories.length === 0 && (
          <p className="py-8 text-center text-muted">카테고리가 없습니다.</p>
        )}
      </div>

      {/* 새 카테고리 추가 */}
      <form onSubmit={handleAdd} className="space-y-4">
        <h3 className="font-semibold">카테고리 추가</h3>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium">이름</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                setNewSlug(nameToSlug(e.target.value));
              }}
              placeholder="예: 영화"
              required
              className={inputClass}
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium">Slug</label>
            <input
              type="text"
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              placeholder="예: movie"
              required
              className={inputClass}
            />
          </div>
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? '추가 중...' : '추가'}
        </Button>
      </form>
    </div>
  );
}
