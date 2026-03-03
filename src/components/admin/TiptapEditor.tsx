'use client';

import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { Fragment } from '@tiptap/pm/model';
import { NodeSelection } from '@tiptap/pm/state';
import Youtube from '@tiptap/extension-youtube';
import { type Editor, EditorContent, useEditor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import { useCallback, useState } from 'react';

import { useToast } from '@/components/ui/Toast';
import { uploadImage } from '@/lib/image';
import { createClient } from '@/lib/supabase/client';

const MAX_IMAGE_WIDTH = 1200;
const MIN_RESIZE_SIZE = 100;

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const YOUTUBE_URL_PATTERN =
  /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/;

const AlignableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      'data-align': {
        default: null,
        parseHTML: (el: HTMLElement) => el.getAttribute('data-align'),
        renderHTML: (attrs: Record<string, unknown>) => {
          if (!attrs['data-align']) return {};
          return { 'data-align': attrs['data-align'] as string };
        },
      },
    };
  },
  addNodeView() {
    const parentRenderer = this.parent?.();
    if (!parentRenderer) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (props: any) => {
      const view = parentRenderer(props);

      const applyAlign = (align: string | null) => {
        if (view.dom instanceof HTMLElement) {
          if (align) view.dom.setAttribute('data-align', align);
          else view.dom.removeAttribute('data-align');
        }
      };

      applyAlign(props.node.attrs['data-align'] || null);

      const origUpdate = view.update;
      if (origUpdate) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        view.update = (node: any, decorations: any, innerDecorations: any) => {
          const result = origUpdate.call(
            view,
            node,
            decorations,
            innerDecorations,
          );
          if (result !== false) {
            applyAlign(node?.attrs?.['data-align'] || null);
          }
          return result;
        };
      }

      return view;
    };
  },
});

const AlignableYoutube = Youtube.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      'data-align': {
        default: null,
        parseHTML: (el: HTMLElement) => el.getAttribute('data-align'),
        renderHTML: (attrs: Record<string, unknown>) => {
          if (!attrs['data-align']) return {};
          return { 'data-align': attrs['data-align'] as string };
        },
      },
    };
  },
});

function MenuBar({ editor }: { editor: ReturnType<typeof useEditor> }) {
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
        >
          ● 목록
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btnClass(editor.isActive('orderedList'))}
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

function moveNode(editor: Editor, direction: 'up' | 'down'): boolean {
  const { state } = editor;
  const { selection } = state;

  if (!(selection instanceof NodeSelection)) return false;

  const node = selection.node;
  const pos = selection.from;
  const $pos = state.doc.resolve(pos);
  const index = $pos.index();
  const parent = $pos.parent;

  if (direction === 'up' && index === 0) return false;
  if (direction === 'down' && index >= parent.childCount - 1) return false;

  const tr = state.tr;

  if (direction === 'up') {
    const prevNode = parent.child(index - 1);
    const prevStart = pos - prevNode.nodeSize;
    tr.replaceWith(
      prevStart,
      pos + node.nodeSize,
      Fragment.fromArray([node, prevNode]),
    );
    tr.setSelection(NodeSelection.create(tr.doc, prevStart));
  } else {
    const nextNode = parent.child(index + 1);
    const nextEnd = pos + node.nodeSize + nextNode.nodeSize;
    tr.replaceWith(pos, nextEnd, Fragment.fromArray([nextNode, node]));
    tr.setSelection(NodeSelection.create(tr.doc, pos + nextNode.nodeSize));
  }

  editor.view.dispatch(tr);
  return true;
}

function MediaBubbleMenu({ editor }: { editor: Editor }) {
  const btnClass = (active: boolean) =>
    `rounded px-2 py-1 text-sm transition-colors ${
      active
        ? 'bg-accent/20 text-accent'
        : 'text-muted hover:text-foreground hover:bg-foreground/5'
    }`;

  const getActiveNodeType = useCallback((): 'image' | 'youtube' | null => {
    if (editor.isActive('image')) return 'image';
    if (editor.isActive('youtube')) return 'youtube';
    return null;
  }, [editor]);

  const getCurrentAlign = useCallback((): string | null => {
    const nodeType = getActiveNodeType();
    if (!nodeType) return null;
    return editor.getAttributes(nodeType)['data-align'] || null;
  }, [editor, getActiveNodeType]);

  const handleAlign = useCallback(
    (align: string | null) => {
      const nodeType = getActiveNodeType();
      if (!nodeType) return;
      editor.commands.updateAttributes(nodeType, { 'data-align': align });
    },
    [editor, getActiveNodeType],
  );

  const handleMoveUp = useCallback(() => {
    moveNode(editor, 'up');
  }, [editor]);

  const handleMoveDown = useCallback(() => {
    moveNode(editor, 'down');
  }, [editor]);

  const handleDelete = useCallback(() => {
    editor.commands.deleteSelection();
  }, [editor]);

  const currentAlign = getCurrentAlign();

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor: e }) =>
        e.isActive('image') || e.isActive('youtube')
      }
    >
      <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1 shadow-lg">
        <button
          type="button"
          onClick={() => handleAlign(null)}
          className={btnClass(!currentAlign)}
          title="왼쪽 정렬"
        >
          좌
        </button>
        <button
          type="button"
          onClick={() => handleAlign('center')}
          className={btnClass(currentAlign === 'center')}
          title="가운데 정렬"
        >
          중
        </button>
        <button
          type="button"
          onClick={() => handleAlign('right')}
          className={btnClass(currentAlign === 'right')}
          title="오른쪽 정렬"
        >
          우
        </button>
        <div className="mx-0.5 h-5 w-px bg-border" />
        <button
          type="button"
          onClick={handleMoveUp}
          className={btnClass(false)}
          title="위로 이동"
        >
          ↑
        </button>
        <button
          type="button"
          onClick={handleMoveDown}
          className={btnClass(false)}
          title="아래로 이동"
        >
          ↓
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="rounded px-2 py-1 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors"
          title="삭제"
        >
          ✕
        </button>
      </div>
    </BubbleMenu>
  );
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
          'min-h-[300px] p-4 focus:outline-none prose-invert max-w-none [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted [&_img]:rounded-lg [&_img]:my-4 [&_a]:text-accent [&_a]:underline [&_iframe]:rounded-lg [&_iframe]:my-4',
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
