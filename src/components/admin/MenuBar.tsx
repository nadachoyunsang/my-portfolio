'use client';

import type { useEditor } from '@tiptap/react';
import { useState } from 'react';

import { useToast } from '@/components/ui/Toast';
import { uploadImage } from '@/lib/image';
import { createClient } from '@/lib/supabase/client';

const MAX_IMAGE_WIDTH = 1200;

const YOUTUBE_URL_PATTERN =
  /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/;

export default function MenuBar({
  editor,
}: {
  editor: ReturnType<typeof useEditor>;
}) {
  const { toast } = useToast();
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');

  if (!editor) return null;

  const btnClass = (active: boolean) =>
    `rounded px-2 py-1 text-sm transition-colors ${
      active
        ? 'bg-accent text-white'
        : 'text-muted hover:text-foreground hover:bg-foreground/5'
    }`;

  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const supabase = createClient();
        const url = await uploadImage(supabase, file, MAX_IMAGE_WIDTH, 'posts');
        editor
          .chain()
          .focus()
          .setImage({ src: url })
          .createParagraphNear()
          .run();
      } catch {
        toast('이미지 업로드에 실패했습니다.');
      }
    };
    input.click();
  };

  const handleYoutubeSubmit = () => {
    const trimmed = youtubeUrl.trim();
    if (!trimmed) return;

    if (!YOUTUBE_URL_PATTERN.test(trimmed)) {
      toast('유효한 YouTube URL을 입력해주세요.');
      return;
    }

    editor
      .chain()
      .focus()
      .setYoutubeVideo({ src: trimmed })
      .createParagraphNear()
      .run();
    setYoutubeUrl('');
    setShowYoutubeInput(false);
  };

  return (
    <div className="border-b border-border p-2">
      <div className="flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={btnClass(editor.isActive('heading', { level: 2 }))}
        >
          제목2
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={btnClass(editor.isActive('heading', { level: 3 }))}
        >
          제목3
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btnClass(editor.isActive('bold'))}
        >
          굵게
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btnClass(editor.isActive('italic'))}
        >
          기울임
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btnClass(editor.isActive('bulletList'))}
          aria-label="순서 없는 목록"
        >
          ● 목록
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btnClass(editor.isActive('orderedList'))}
          aria-label="순서 있는 목록"
        >
          1. 목록
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={btnClass(editor.isActive('blockquote'))}
        >
          인용
        </button>
        <button
          type="button"
          onClick={handleImageUpload}
          className={btnClass(false)}
        >
          이미지
        </button>
        <button
          type="button"
          onClick={() => setShowYoutubeInput(!showYoutubeInput)}
          className={btnClass(showYoutubeInput)}
        >
          유튜브
        </button>
      </div>
      {showYoutubeInput && (
        <div className="mt-2 flex gap-2">
          <input
            type="url"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' && (e.preventDefault(), handleYoutubeSubmit())
            }
            placeholder="https://www.youtube.com/watch?v=..."
            className="flex-1 rounded border border-border bg-background px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <button
            type="button"
            onClick={handleYoutubeSubmit}
            className="rounded bg-accent px-3 py-1 text-sm text-white hover:bg-accent/80 transition-colors"
          >
            삽입
          </button>
          <button
            type="button"
            onClick={() => {
              setShowYoutubeInput(false);
              setYoutubeUrl('');
            }}
            className="rounded px-2 py-1 text-sm text-muted hover:text-foreground transition-colors"
          >
            취소
          </button>
        </div>
      )}
    </div>
  );
}
