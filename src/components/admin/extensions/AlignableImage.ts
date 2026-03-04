import Image from '@tiptap/extension-image';

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

export default AlignableImage;
