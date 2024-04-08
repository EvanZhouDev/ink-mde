import { keymap as o } from "@codemirror/view";
import { c as t } from "./index-J7cEK7bf.js";
import { Prec as e } from "@codemirror/state";
import "solid-js/web";
import "@codemirror/language";
import "@codemirror/commands";
import "@codemirror/lang-markdown";
import "@codemirror/language-data";
import "@lezer/highlight";
import "solid-js";
const l = (r) => () => e.highest(
  o.of([
    {
      key: "Mod-b",
      run: () => (t(r, "bold"), !0),
      preventDefault: !0
    },
    {
      key: "Mod-i",
      run: () => (t(r, "italic"), !0),
      preventDefault: !0
    }
  ])
);
export {
  l as markdownKeymap
};
//# sourceMappingURL=markdownKeymap-DSSOXZJ2.js.map
