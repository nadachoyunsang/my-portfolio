'use client';

import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Youtube from '@tiptap/extension-youtube';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { createClient } from '@/lib/supabase/client';
import { uploadImage } from '@/lib/image';

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

function MenuBar({ editor }: { editor: ReturnType<typeof useEditor> }) {
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
        const url = await uploadImage(supabase, file, 1200, 'posts');
        editor.chain().focus().setImage({ src: url }).run();
      } catch {
        alert('이미지 업로드에 실패했습니다.');
      }
    };
    input.click();
  };

  const handleYoutube = () => {
    const url = prompt('YouTube URL을 입력하세요');
    if (url) {
      editor.commands.setYoutubeVideo({ src: url });
    }
  };

  return (
    <div className="flex flex-wrap gap-1 border-b border-border p-2">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={btnClass(editor.isActive('heading', { level: 2 }))}
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={btnClass(editor.isActive('heading', { level: 3 }))}
      >
        H3
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btnClass(editor.isActive('bold'))}
      >
        B
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btnClass(editor.isActive('italic'))}
      >
        I
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btnClass(editor.isActive('bulletList'))}
      >
        UL
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btnClass(editor.isActive('orderedList'))}
      >
        OL
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={btnClass(editor.isActive('blockquote'))}
      >
        &ldquo;&rdquo;
      </button>
      <button
        type="button"
        onClick={handleImageUpload}
        className={btnClass(false)}
      >
        IMG
      </button>
      <button type="button" onClick={handleYoutube} className={btnClass(false)}>
        YT
      </button>
    </div>
  );
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Youtube.configure({ controls: false }),
      Placeholder.configure({ placeholder: '내용을 입력하세요...' }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          'min-h-[300px] p-4 focus:outline-none prose-invert max-w-none [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted [&_img]:rounded-lg [&_img]:my-4',
      },
    },
  });

  return (
    <div className="rounded-lg border border-border bg-card">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
