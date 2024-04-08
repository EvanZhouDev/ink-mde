import { keymap } from '@codemirror/view';
import { a as format } from './index.js';
import { Prec } from '@codemirror/state';
import 'solid-js/web';
import '@codemirror/language';
import '@codemirror/commands';
import '@codemirror/lang-markdown';
import '@codemirror/language-data';
import '@lezer/highlight';
import 'solid-js';

const markdownKeymap = (state) => () => {
  return Prec.highest(
    keymap.of([
      {
        key: "Mod-b",
        run: () => {
          format(state, "bold");
          return true;
        },
        preventDefault: true
      },
      {
        key: "Mod-i",
        run: () => {
          format(state, "italic");
          return true;
        },
        preventDefault: true
      }
    ])
  );
};

export { markdownKeymap };
//# sourceMappingURL=markdownKeymap-8goFg2IF.js.map
