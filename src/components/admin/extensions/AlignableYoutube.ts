import Youtube from '@tiptap/extension-youtube';

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

export default AlignableYoutube;
