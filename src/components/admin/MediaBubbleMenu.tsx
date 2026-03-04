'use client';

import type { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { useCallback } from 'react';

import { ALIGN, NODE_TYPE } from '@/constants/editor';

import moveNode from './utils/moveNode';

export default function MediaBubbleMenu({ editor }: { editor: Editor }) {
  const btnClass = (active: boolean) =>
    `rounded px-2 py-1 text-sm transition-colors ${
      active
        ? 'bg-accent/20 text-accent'
        : 'text-muted hover:text-foreground hover:bg-foreground/5'
    }`;

  const getActiveNodeType = useCallback((): string | null => {
    if (editor.isActive(NODE_TYPE.IMAGE)) return NODE_TYPE.IMAGE;
    if (editor.isActive(NODE_TYPE.YOUTUBE)) return NODE_TYPE.YOUTUBE;
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
        e.isActive(NODE_TYPE.IMAGE) || e.isActive(NODE_TYPE.YOUTUBE)
      }
    >
      <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1 shadow-lg">
        <div role="group" aria-label="정렬" className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleAlign(null)}
            className={btnClass(!currentAlign)}
            title="왼쪽 정렬"
            aria-label="왼쪽 정렬"
            aria-pressed={!currentAlign}
          >
            좌
          </button>
          <button
            type="button"
            onClick={() => handleAlign(ALIGN.CENTER)}
            className={btnClass(currentAlign === ALIGN.CENTER)}
            title="가운데 정렬"
            aria-label="가운데 정렬"
            aria-pressed={currentAlign === ALIGN.CENTER}
          >
            중
          </button>
          <button
            type="button"
            onClick={() => handleAlign(ALIGN.RIGHT)}
            className={btnClass(currentAlign === ALIGN.RIGHT)}
            title="오른쪽 정렬"
            aria-label="오른쪽 정렬"
            aria-pressed={currentAlign === ALIGN.RIGHT}
          >
            우
          </button>
        </div>
        <div className="mx-0.5 h-5 w-px bg-border" />
        <button
          type="button"
          onClick={handleMoveUp}
          className={btnClass(false)}
          title="위로 이동"
          aria-label="위로 이동"
        >
          ↑
        </button>
        <button
          type="button"
          onClick={handleMoveDown}
          className={btnClass(false)}
          title="아래로 이동"
          aria-label="아래로 이동"
        >
          ↓
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="rounded px-2 py-1 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors"
          title="삭제"
          aria-label="삭제"
        >
          ✕
        </button>
      </div>
    </BubbleMenu>
  );
}
