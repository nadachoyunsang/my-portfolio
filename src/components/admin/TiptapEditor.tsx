'use client';

import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import AlignableImage from './extensions/AlignableImage';
import AlignableYoutube from './extensions/AlignableYoutube';
import MediaBubbleMenu from './MediaBubbleMenu';
import MenuBar from './MenuBar';

const MIN_RESIZE_SIZE = 100;

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      AlignableImage.configure({
        resize: {
          enabled: true,
          directions: ['bottom-right', 'bottom-left', 'top-right', 'top-left'],
          minWidth: MIN_RESIZE_SIZE,
          minHeight: MIN_RESIZE_SIZE,
          alwaysPreserveAspectRatio: true,
        },
      }),
      AlignableYoutube.configure({ controls: false }),
      Placeholder.configure({ placeholder: '내용을 입력하세요...' }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          'min-h-[300px] p-4 focus:outline-none prose-invert max-w-none [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted [&_img]:rounded-lg [&_img]:my-4 [&_a]:text-accent [&_a]:underline [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-lg [&_iframe]:my-4',
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="rounded-lg border border-border bg-card">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      <MediaBubbleMenu editor={editor} />
    </div>
  );
}
