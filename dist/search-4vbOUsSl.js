import { ssr, ssrHydrationKey, ssrAttribute, escape } from 'solid-js/web';
import { search as search$1, getSearchQuery, searchKeymap } from '@codemirror/search';
import { keymap } from '@codemirror/view';
import { createRoot, createSignal } from 'solid-js';

const _tmpl$ = ["<div", " class=\"ink-mde-search-panel\"><input attr:main-field=\"", "\" class=\"ink-mde-search-input\" type=\"text\"", "></div>"];
const search = () => {
  return [search$1({
    top: true,
    createPanel: view => {
      return createRoot(dispose => {
        const [query, setQuery] = createSignal(getSearchQuery(view.state));
        return {
          destroy: () => {
            dispose();
          },
          dom: ssr(_tmpl$, ssrHydrationKey(), 'true', ssrAttribute("value", escape(query().search, true), false)),
          mount: () => {
          },
          top: true
        };
      });
    }
  }), keymap.of(searchKeymap)];
};

export { search };
//# sourceMappingURL=search-4vbOUsSl.js.map
