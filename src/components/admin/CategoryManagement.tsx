'use client';

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
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

function DragHandle(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="cursor-grab touch-none text-muted hover:text-foreground active:cursor-grabbing"
      {...props}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
      >
        <circle cx="5" cy="3" r="1.5" />
        <circle cx="11" cy="3" r="1.5" />
        <circle cx="5" cy="8" r="1.5" />
        <circle cx="11" cy="8" r="1.5" />
        <circle cx="5" cy="13" r="1.5" />
        <circle cx="11" cy="13" r="1.5" />
      </svg>
    </button>
  );
}

function SortableCategory({
  category,
  editingId,
  editName,
  editSlug,
  saving,
  inputClass,
  onEditNameChange,
  onEditSlugChange,
  onStartEdit,
  onUpdate,
  onCancelEdit,
  onDelete,
}: {
  category: Category;
  editingId: string | null;
  editName: string;
  editSlug: string;
  saving: boolean;
  inputClass: string;
  onEditNameChange: (value: string) => void;
  onEditSlugChange: (value: string) => void;
  onStartEdit: (category: Category) => void;
  onUpdate: (id: string) => void;
  onCancelEdit: () => void;
  onDelete: (id: string, name: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isEditing = editingId === category.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-lg border border-border p-4 ${
        isDragging ? 'z-10 bg-card shadow-lg' : 'bg-background'
      }`}
    >
      {isEditing ? (
        <div className="flex flex-1 items-center gap-3">
          <input
            type="text"
            value={editName}
            onChange={(e) => onEditNameChange(e.target.value)}
            className={`${inputClass} flex-1`}
            placeholder="카테고리 이름"
          />
          <input
            type="text"
            value={editSlug}
            onChange={(e) => onEditSlugChange(e.target.value)}
            className={`${inputClass} flex-1`}
            placeholder="slug"
          />
          <Button onClick={() => onUpdate(category.id)} disabled={saving}>
            저장
          </Button>
          <Button variant="ghost" onClick={onCancelEdit}>
            취소
          </Button>
        </div>
      ) : (
        <>
          <DragHandle {...attributes} {...listeners} />
          <div className="flex-1">
            <span className="font-medium">{category.name}</span>
            <span className="ml-3 text-xs text-muted">{category.slug}</span>
          </div>
          <button
            type="button"
            onClick={() => onStartEdit(category)}
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            수정
          </button>
          <button
            type="button"
            onClick={() => onDelete(category.id, category.name)}
            className="text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            삭제
          </button>
        </>
      )}
    </div>
  );
}

export default function CategoryManagement({
  categories: initialCategories,
}: CategoryManagementProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [categories, setCategories] = useState(initialCategories);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [saving, setSaving] = useState(false);
  const [reordering, setReordering] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const inputClass =
    'w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent';

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = categories.findIndex((c) => c.id === active.id);
    const newIndex = categories.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(categories, oldIndex, newIndex).map((c, i) => ({
      ...c,
      sort_order: i,
    }));
    setCategories(reordered);

    setReordering(true);
    const supabase = createClient();

    const results = await Promise.all(
      reordered.map(({ id, sort_order }) =>
        supabase.from('categories').update({ sort_order }).eq('id', id),
      ),
    );

    const error = results.find((r: { error: unknown }) => r.error)?.error as
      | { message: string }
      | undefined;

    if (error) {
      setCategories(initialCategories);
      toast('순서 저장에 실패했습니다.');
    }

    setReordering(false);
    router.refresh();
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newSlug.trim()) return;

    setSaving(true);
    const supabase = createClient();
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
      toast('카테고리 추가에 실패했습니다.');
      return;
    }

    setCategories([...categories, data]);
    setNewName('');
    setNewSlug('');
    router.refresh();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" 카테고리를 삭제하시겠습니까?`)) return;

    const supabase = createClient();
    const { error } = await supabase.from('categories').delete().eq('id', id);

    if (error) {
      toast('카테고리 삭제에 실패했습니다.');
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
    const supabase = createClient();
    const { error } = await supabase
      .from('categories')
      .update({ name: editName.trim(), slug: editSlug.trim() })
      .eq('id', id);

    setSaving(false);

    if (error) {
      toast('카테고리 수정에 실패했습니다.');
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
      {reordering && <p className="text-xs text-muted">순서 저장 중...</p>}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={categories.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {categories.map((category) => (
              <SortableCategory
                key={category.id}
                category={category}
                editingId={editingId}
                editName={editName}
                editSlug={editSlug}
                saving={saving}
                inputClass={inputClass}
                onEditNameChange={setEditName}
                onEditSlugChange={setEditSlug}
                onStartEdit={startEdit}
                onUpdate={handleUpdate}
                onCancelEdit={() => setEditingId(null)}
                onDelete={handleDelete}
              />
            ))}
            {categories.length === 0 && (
              <p className="py-8 text-center text-muted">
                카테고리가 없습니다.
              </p>
            )}
          </div>
        </SortableContext>
      </DndContext>

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
