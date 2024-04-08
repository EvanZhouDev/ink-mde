import { indentMore as t, indentLess as n } from "@codemirror/commands";
import { keymap as o } from "@codemirror/view";
const m = ({ tab: e = !0, shiftTab: r = !0 } = {}) => o.of([
  {
    key: "Tab",
    run: e ? t : void 0
  },
  {
    key: "Shift-Tab",
    run: r ? n : void 0
  }
]);
export {
  m as indentWithTab
};
//# sourceMappingURL=indentWithTab-ADkQMKa8.js.map
