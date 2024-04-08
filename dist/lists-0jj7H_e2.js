import { syntaxTree as f } from "@codemirror/language";
import { StateField as k, RangeSet as h } from "@codemirror/state";
import { ViewPlugin as D, EditorView as x, Decoration as d } from "@codemirror/view";
import { b as l } from "./index-2b9Bjr3S.js";
import "solid-js/web";
import "@codemirror/commands";
import "@codemirror/lang-markdown";
import "@codemirror/language-data";
import "@lezer/highlight";
import "solid-js";
import "ink-mde";
const M = () => l({
  eq: () => !1,
  toDOM: () => {
    const t = document.createElement("span");
    return t.innerHTML = "&#x2022;", t.setAttribute("aria-hidden", "true"), t;
  }
}), b = (t) => l({
  eq: (e) => e.isChecked === t,
  ignoreEvent: () => !1,
  isChecked: t,
  toDOM: () => {
    const e = document.createElement("input");
    return e.setAttribute("aria-hidden", "true"), e.className = "ink-mde-task-toggle", e.type = "checkbox", e.checked = t, e;
  }
}), w = (t, e, s, i) => Math.max(t, s) <= Math.min(e, i), m = (t, e, s) => t.selection.ranges.some((i) => w(e, s, i.from, i.to)), T = (t, e) => {
  const s = t.state.sliceDoc(e + 2, e + 5);
  return t.dispatch({
    changes: {
      from: e + 2,
      to: e + 5,
      insert: s === "[ ]" ? "[x]" : "[ ]"
    }
  }), !0;
}, I = () => {
  const t = () => d.replace({
    widget: M()
  }), e = (r) => d.replace({
    widget: b(r)
  }), s = (r) => {
    const n = [];
    return f(r).iterate({
      enter: ({ type: a, from: c, to: o }) => {
        if (a.name === "ListMark" && !m(r, c, o)) {
          const u = r.sliceDoc(o + 1, o + 4);
          if (!["[ ]", "[x]"].includes(u)) {
            const p = r.sliceDoc(c, o);
            ["-", "*"].includes(p) && n.push(t().range(c, o));
          }
        }
        if (a.name === "TaskMarker" && !m(r, c - 2, o)) {
          const u = r.sliceDoc(c, o);
          n.push(e(u === "[x]").range(c - 2, o));
        }
      }
    }), n.length > 0 ? h.of(n) : d.none;
  }, i = D.define(() => ({}), {
    eventHandlers: {
      mousedown: (r, n) => {
        const a = r.target;
        if (a?.nodeName === "INPUT" && a.classList.contains("ink-mde-task-toggle"))
          return T(n, n.posAtDOM(a));
      }
    }
  }), g = k.define({
    create(r) {
      return s(r);
    },
    update(r, { state: n }) {
      return s(n);
    },
    provide(r) {
      return x.decorations.from(r);
    }
  });
  return [
    i,
    g
  ];
};
export {
  I as lists
};
//# sourceMappingURL=lists-0jj7H_e2.js.map
