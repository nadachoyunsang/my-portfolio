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
import Link from 'next/link';
import { useState } from 'react';

import { useToast } from '@/components/ui/Toast';

interface PostItem {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  categoryAssigned: boolean;
  published: boolean;
  created_at: string;
}

function SortablePost({ post }: { post: PostItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: post.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-lg border border-border p-4 transition-colors ${
        isDragging ? 'z-10 bg-card shadow-lg' : 'bg-background'
      }`}
    >
      <button
        type="button"
        className="cursor-grab touch-none text-muted hover:text-foreground active:cursor-grabbing"
        {...attributes}
        {...listeners}
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

      <Link
        href={`/admin/posts/${post.id}/edit`}
        className="flex flex-1 items-center justify-between transition-colors hover:text-accent"
      >
        <div>
          <span className="font-medium">{post.title}</span>
          <span
            className={`ml-3 text-xs ${post.categoryAssigned ? 'text-blue-400' : 'text-red-400'}`}
          >
            {post.categoryLabel}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-2 py-0.5 text-xs ${
              post.published
                ? 'bg-green-900/30 text-green-400'
                : 'bg-neutral-800 text-muted'
            }`}
          >
            {post.published ? '공개' : '비공개'}
          </span>
          <span className="text-xs text-muted">
            {new Date(post.created_at).toLocaleDateString('ko-KR')}
          </span>
        </div>
      </Link>
    </div>
  );
}

export default function PostSortableList({
  initialPosts,
}: {
  initialPosts: PostItem[];
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = posts.findIndex((p) => p.id === active.id);
    const newIndex = posts.findIndex((p) => p.id === over.id);

    const reordered = arrayMove(posts, oldIndex, newIndex);
    setPosts(reordered);

    setSaving(true);
    const orders = reordered.map((post, index) => ({
      id: post.id,
      sort_order: index,
    }));

    try {
      const res = await fetch('/api/admin/posts/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders }),
      });

      if (!res.ok) {
        setPosts(posts);
        toast('순서 저장에 실패했습니다.');
      }
    } catch {
      setPosts(posts);
      toast('순서 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {saving && <p className="mb-2 text-xs text-muted">순서 저장 중...</p>}
      {posts.length > 0 ? (
        <DndContext
          id="post-sortable"
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={posts.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {posts.map((post) => (
                <SortablePost key={post.id} post={post} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <p className="py-12 text-center text-muted">글이 없습니다.</p>
      )}
    </div>
  );
}
