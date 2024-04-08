import { getNextElement as f, setAttribute as i, effect as l, setProperty as d, runHydrationEvents as m, delegateEvents as h, template as y, use as $ } from "solid-js/web";
import { search as k, getSearchQuery as S, searchKeymap as g, findPrevious as x, findNext as E, SearchQuery as Q, setSearchQuery as _ } from "@codemirror/search";
import { keymap as D, runScopeHandlers as K } from "@codemirror/view";
import { createRoot as P, createSignal as H } from "solid-js";
const N = /* @__PURE__ */ y("<div class=ink-mde-search-panel><input class=ink-mde-search-input type=text>"), C = () => [k({
  top: !0,
  createPanel: (r) => P((c) => {
    const [a, u] = H(S(r.state));
    let n;
    const s = (e) => {
      if (K(r, e, "search-panel"))
        return e.preventDefault();
      e.code === "Enter" && (e.preventDefault(), e.shiftKey ? x(r) : E(r));
    }, p = (e) => {
      const {
        value: t
      } = e.target;
      u(new Q({
        search: t
      })), r.dispatch({
        effects: _.of(a())
      });
    };
    return {
      destroy: () => {
        c();
      },
      dom: (() => {
        const e = f(N), t = e.firstChild;
        e.$$keydown = s;
        const o = n;
        return typeof o == "function" ? $(o, t) : n = t, t.$$keydown = s, t.$$input = p, i(t, "main-field", "true"), l(() => d(t, "value", a().search)), m(), e;
      })(),
      mount: () => {
        n?.focus();
      },
      top: !0
    };
  })
}), D.of(g)];
h(["keydown", "input"]);
export {
  C as search
};
//# sourceMappingURL=search-VxR4ZcVd.js.map
