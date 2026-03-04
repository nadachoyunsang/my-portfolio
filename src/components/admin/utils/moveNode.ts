import { Fragment } from '@tiptap/pm/model';
import { NodeSelection } from '@tiptap/pm/state';
import type { Editor } from '@tiptap/react';

export default function moveNode(
  editor: Editor,
  direction: 'up' | 'down',
): boolean {
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
