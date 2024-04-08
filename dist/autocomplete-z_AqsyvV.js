import { autocompletion as i, closeBrackets as p } from "@codemirror/autocomplete";
import { p as r, f as m, a as e } from "./index-2b9Bjr3S.js";
import "solid-js/web";
import "@codemirror/language";
import "@codemirror/state";
import "@codemirror/commands";
import "@codemirror/view";
import "@codemirror/lang-markdown";
import "@codemirror/language-data";
import "@lezer/highlight";
import "solid-js";
import "ink-mde";
const v = (o) => {
  const [s, t] = r(m(e.completion, o));
  return [
    i({
      defaultKeymap: !0,
      icons: !1,
      override: t,
      optionClass: () => "ink-tooltip-option"
    }),
    p()
  ];
};
export {
  v as autocomplete
};
//# sourceMappingURL=autocomplete-z_AqsyvV.js.map
