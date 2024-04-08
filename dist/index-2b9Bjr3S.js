import { getNextElement as m, getNextMarker as h, insert as g, createComponent as d, memo as gn, template as p, setProperty as ve, effect as ge, setAttribute as je, runHydrationEvents as ye, delegateEvents as Te, use as De, spread as pn, mergeProps as kn, hydrate as hn, render as bn } from "solid-js/web";
import { syntaxTree as ce, syntaxHighlighting as Pe, HighlightStyle as Oe } from "@codemirror/language";
import { SelectionRange as xn, EditorSelection as vn, Compartment as $e, RangeSetBuilder as qe, EditorState as yn, StateField as $n, RangeSet as te } from "@codemirror/state";
import { history as wn, defaultKeymap as _n, historyKeymap as Mn } from "@codemirror/commands";
import { EditorView as V, Decoration as j, ViewPlugin as Ie, keymap as Ne } from "@codemirror/view";
import { markdown as Re, markdownLanguage as Ve } from "@codemirror/lang-markdown";
import { languages as We } from "@codemirror/language-data";
import { tags as u, Tag as Sn } from "@lezer/highlight";
import { createSignal as R, Show as x, onMount as Fe, onCleanup as Cn, For as Ln, createEffect as En, createContext as jn, useContext as Bn } from "solid-js";
import { plugin as J, pluginTypes as An } from "ink-mde";
const zn = "data-ink-mde-ssr-hydration-marker", Hn = `[${zn}]`, Tn = () => ({}), Dn = ([e]) => {
  const { editor: n } = e();
  n.destroy();
}, pe = ([e]) => {
  const { editor: n } = e();
  n.hasFocus || n.focus();
}, Ue = (e) => {
  const n = e.map((t) => xn.fromJSON({ anchor: t.start, head: t.end }));
  return vn.create(n);
}, Qe = (e) => e.ranges.map((t) => ({
  end: t.anchor < t.head ? t.head : t.anchor,
  start: t.head < t.anchor ? t.head : t.anchor
}));
var ae = /* @__PURE__ */ ((e) => (e.Auto = "auto", e.Dark = "dark", e.Light = "light", e))(ae || {}), v = /* @__PURE__ */ ((e) => (e.Bold = "bold", e.Code = "code", e.CodeBlock = "code_block", e.Heading = "heading", e.Image = "image", e.Italic = "italic", e.Link = "link", e.List = "list", e.OrderedList = "ordered_list", e.Quote = "quote", e.TaskList = "task_list", e))(v || {}), ke = /* @__PURE__ */ ((e) => (e.End = "end", e.Start = "start", e))(ke || {});
const Be = {
  auto: "auto",
  dark: "dark",
  light: "light"
}, U = {
  completion: "completion",
  default: "default",
  grammar: "grammar",
  language: "language"
}, A = (e) => ({ ...{
  block: !1,
  line: !1,
  multiline: !1,
  nodes: [],
  prefix: "",
  prefixStates: [],
  suffix: ""
}, ...e }), Pn = {
  [v.Bold]: A({
    nodes: ["StrongEmphasis"],
    prefix: "**",
    suffix: "**"
  }),
  [v.Code]: A({
    nodes: ["InlineCode"],
    prefix: "`",
    suffix: "`"
  }),
  [v.CodeBlock]: A({
    block: !0,
    nodes: ["FencedCode"],
    prefix: "```\n",
    suffix: "\n```"
  }),
  [v.Heading]: A({
    multiline: !0,
    nodes: ["ATXHeading1", "ATXHeading2", "ATXHeading3", "ATXHeading4", "ATXHeading5", "ATXHeading6"],
    prefix: "# ",
    prefixStates: ["# ", "## ", "### ", "#### ", "##### ", "###### ", ""]
  }),
  [v.Image]: A({
    nodes: ["Image"],
    prefix: "![](",
    suffix: ")"
  }),
  [v.Italic]: A({
    nodes: ["Emphasis"],
    prefix: "*",
    suffix: "*"
  }),
  [v.Link]: A({
    nodes: ["Link"],
    prefix: "[](",
    suffix: ")"
  }),
  [v.OrderedList]: A({
    line: !0,
    multiline: !0,
    nodes: ["OrderedList"],
    prefix: "1. "
  }),
  [v.Quote]: A({
    line: !0,
    multiline: !0,
    nodes: ["Blockquote"],
    prefix: "> "
  }),
  [v.TaskList]: A({
    line: !0,
    multiline: !0,
    nodes: ["BulletList"],
    prefix: "- [ ] "
  }),
  [v.List]: A({
    line: !0,
    multiline: !0,
    nodes: ["BulletList"],
    prefix: "- "
  })
}, On = ({ editor: e, selection: n }) => {
  let t = n.start;
  const r = [];
  for (; t <= n.end; ) {
    const o = e.lineBlockAt(t), i = Math.max(n.start, o.from), s = Math.min(n.end, o.to);
    r.push({ start: i, end: s }), t = o.to + 1;
  }
  return r;
}, qn = ({ editor: e, formatDefinition: n, selection: t }) => {
  if (!e || !n)
    return t || { start: 0, end: 0 };
  const r = t || Qe(e.state.selection).pop() || { start: 0, end: 0 };
  if (n.block || n.line || n.multiline) {
    const s = e.lineBlockAt(r.start).from, a = e.lineBlockAt(r.end).to;
    return { start: s, end: a };
  }
  const o = e.state.wordAt(r.start)?.from || r.start, i = e.state.wordAt(r.end)?.to || r.end;
  return { start: o, end: i };
}, Xe = (e) => e.editor.state.sliceDoc(e.selection.start, e.selection.end), In = (e, n, t) => Nn(e, t).find(({ type: o }) => n.nodes.includes(o.name)), Nn = (e, n) => {
  const t = [];
  return ce(e.state).iterate({
    from: n.start,
    to: n.end,
    enter: ({ type: r, from: o, to: i }) => {
      t.push({ type: r, from: o, to: i });
    }
  }), t;
}, we = (e) => {
  const n = Xe(e), t = e.formatDefinition.prefix.length, r = e.formatDefinition.suffix.length * -1 || n.length, o = n.slice(t, r);
  return [{ from: e.selection.start, to: e.selection.end, insert: o }];
}, Rn = (e) => {
  if (e.node) {
    const n = e.node.from, t = e.node.to;
    return we({ ...e, selection: { start: n, end: t } });
  } else {
    const n = e.formatDefinition.prefix, t = e.formatDefinition.suffix;
    return [
      { from: e.selection.start, insert: n },
      { from: e.selection.end, insert: t }
    ];
  }
}, Vn = (e) => {
  const n = On(e), t = [];
  return n.forEach((r) => {
    const o = Ke({ ...e, selection: r });
    t.push(...o);
  }), t;
}, Ke = (e) => {
  const n = e.formatDefinition.prefixStates.length > 0, t = Xe(e);
  if (e.node && n) {
    const r = e.formatDefinition.prefixStates.find((o) => t.startsWith(o));
    if (r) {
      const o = e.formatDefinition.prefixStates.indexOf(r), i = e.formatDefinition.prefixStates[o + 1], s = t.replace(new RegExp(`^${r}`), i);
      return [{ from: e.selection.start, to: e.selection.end, insert: s }];
    }
  } else if (e.node && t.startsWith(e.formatDefinition.prefix))
    return we(e);
  return [{ from: e.selection.start, insert: e.formatDefinition.prefix }];
}, Wn = (e) => {
  if (e.node) {
    const n = e.node.from, t = e.node.to;
    return we({ ...e, selection: { start: n, end: t } });
  } else {
    const { formatDefinition: n, selection: t } = e, r = Array.isArray(n.prefix) ? n.prefix[0] : n.prefix, o = n.suffix;
    return [
      { from: t.start, insert: r },
      { from: t.end, insert: o }
    ];
  }
}, Fn = (e) => e.formatDefinition.block ? Rn(e) : e.formatDefinition.multiline ? Vn(e) : e.formatDefinition.line ? Ke(e) : Wn(e), Ye = ([e], n, { selection: t } = {}) => {
  const { editor: r } = e(), o = Pn[n], i = qn({
    editor: r,
    formatDefinition: o,
    selection: t
  });
  if (i.start === i.end) {
    const s = [
      { from: i.start, insert: o.prefix },
      { from: i.start, insert: o.suffix }
    ], a = i.start + o.prefix.length, l = e().editor.state.update({
      changes: s,
      selection: { head: a, anchor: a }
    });
    e().editor.dispatch(l), e().editor.focus();
  } else {
    const s = In(r, o, i), l = Fn({
      editor: r,
      formatDefinition: o,
      node: s,
      selection: i
    }), c = l.reduce(
      (_, y) => {
        const S = y.insert.length - ((y.to || y.from) - y.from);
        return _ + S;
      },
      0
    ), f = e().editor.state.update({
      changes: l,
      selection: { head: i.start, anchor: i.end + c }
    });
    e().editor.dispatch(f), e().editor.focus();
  }
}, Un = ([e]) => {
  const { editor: n } = e();
  return n.state.sliceDoc();
}, _e = ([e]) => {
  const { editor: n } = e();
  return Qe(n.state.selection);
}, de = ([e, n], t, r, o = !1) => {
  const { editor: i } = e();
  let s = r?.start, a = r?.end || r?.start;
  if (typeof s > "u") {
    const c = _e([e, n]).pop();
    s = c.start, a = c.end;
  }
  const l = { changes: { from: s, to: a, insert: t } };
  if (o) {
    const c = s === a ? s + t.length : s, f = s + t.length;
    Object.assign(l, { selection: { anchor: c, head: f } });
  }
  i.dispatch(
    i.state.update(l)
  );
}, N = {
  array: "[object Array]",
  object: "[object Object]",
  string: "[object String]",
  undefined: "[object Undefined]",
  window: "[object Window]"
}, Qn = (e) => {
  if (Object.prototype.toString.call(e) === N.object)
    return `[object ${e.constructor.name}]`;
}, F = (e, n) => Qn(e) === n, Xn = (e, n) => {
  const t = /* @__PURE__ */ new WeakMap(), r = (o, i) => t.get(o) || (F(o, N.object) && t.set(o, !0), F(i, N.undefined)) ? o : F(o, N.array) && F(i, N.array) ? [...i] : F(o, N.object) && F(i, N.object) ? Object.keys(o).reduce((s, a) => (Object.hasOwnProperty.call(i, a) ? s[a] = r(o[a], i[a]) : s[a] = o[a], s), {}) : i;
  return r(e, n);
}, ee = (e, n) => Xn(e, n), Kn = {
  array: "[object Array]",
  asyncFunction: "[object AsyncFunction]",
  boolean: "[object Boolean]",
  function: "[object Function]",
  null: "[object Null]",
  number: "[object Number]",
  object: "[object Object]",
  promise: "[object Promise]",
  string: "[object String]",
  symbol: "[object Symbol]",
  undefined: "[object Undefined]",
  window: "[object Window]"
}, Yn = (e, n) => Object.prototype.toString.call(n) === e, Ze = (e) => Yn(Kn.promise, e), ue = (e) => Gn(e, Ze), Zn = (e, n) => n.type === e, Jn = (e, n) => !!e && e in n, Q = (e, n) => Je(n.plugins).reduce((t, r) => (Zn(e, r) && (!r.key || Jn(r.key, n) && n[r.key]) && t.push(r.value), t), []), Je = (e) => e.reduce((n, t) => Array.isArray(t) ? n.concat(Je(t)) : n.concat(t), []), Gn = (e, n) => e.reduce((t, r) => (n(r) ? t[0].push(r) : t[1].push(r), t), [[], []]), et = ([e, n]) => {
  const t = [], [r, o] = nt(e().options), [i, s] = tt(e().options);
  return Math.max(r.length, i.length) > 0 && e().workQueue.enqueue(async () => {
    const a = await fe([e, n]);
    e().editor.dispatch({ effects: a });
  }), Re({
    base: Ve,
    codeLanguages: [...We, ...s],
    extensions: [...t, ...o]
  });
}, nt = (e) => ue(Q(U.grammar, e)), tt = (e) => ue(Q(U.language, e)), rt = async ([e]) => {
  const n = [], t = await Promise.all(Q(U.grammar, e().options)), r = await Promise.all(Q(U.language, e().options));
  return Re({
    base: Ve,
    codeLanguages: [...We, ...r],
    extensions: [...n, ...t]
  });
}, ot = () => {
  const e = new $e();
  return {
    compartment: e,
    initialValue: (n) => e.of(et(n)),
    reconfigure: async (n) => e.reconfigure(await rt(n))
  };
}, Ae = () => document.createElement("div"), Ge = () => window.matchMedia("(prefers-color-scheme: dark)").matches, it = (e) => e === ae.Dark ? !0 : e === ae.Light ? !1 : Ge(), me = (e) => {
  const n = [
    // --ink-*
    { suffix: "border-radius", default: "0.25rem" },
    { suffix: "color", default: "currentColor" },
    { suffix: "flex-direction", default: "column" },
    { suffix: "font-family", default: "inherit" },
    // --ink-block-*
    { suffix: "block-background-color", default: "#121212", light: "#f5f5f5" },
    { suffix: "block-background-color-on-hover", default: "#0f0f0f", light: "#e0e0e0" },
    { suffix: "block-max-height", default: "20rem" },
    { suffix: "block-padding", default: "0.5rem" },
    // --ink-code-*
    { suffix: "code-background-color", default: "var(--ink-internal-block-background-color)" },
    { suffix: "code-color", default: "inherit" },
    { suffix: "code-font-family", default: "'Monaco', Courier, monospace" },
    // --ink-editor-*
    { suffix: "editor-font-size", default: "1em" },
    { suffix: "editor-line-height", default: "2em" },
    { suffix: "editor-padding", default: "0.5rem" },
    { suffix: "inline-padding", default: "0.125rem" },
    // --ink-modal-*
    { suffix: "modal-position", default: "fixed" },
    // --ink-syntax-*
    { suffix: "syntax-atom-color", default: "#d19a66" },
    { suffix: "syntax-comment-color", default: "#abb2bf" },
    { suffix: "syntax-comment-font-style", default: "italic" },
    { suffix: "syntax-emphasis-color", default: "inherit" },
    { suffix: "syntax-emphasis-font-style", default: "italic" },
    { suffix: "syntax-hashtag-background-color", default: "#222", light: "#eee" },
    { suffix: "syntax-hashtag-color", default: "inherit" },
    { suffix: "syntax-heading-color", default: "inherit" },
    { suffix: "syntax-heading-font-weight", default: "600" },
    { suffix: "syntax-heading1-color", default: "var(--ink-internal-syntax-heading-color, inherit)" },
    { suffix: "syntax-heading1-font-size", default: "1.6em" },
    { suffix: "syntax-heading1-font-weight", default: "600" },
    { suffix: "syntax-heading2-color", default: "var(--ink-internal-syntax-heading-color, inherit)" },
    { suffix: "syntax-heading2-font-size", default: "1.5em" },
    { suffix: "syntax-heading2-font-weight", default: "600" },
    { suffix: "syntax-heading3-color", default: "var(--ink-internal-syntax-heading-color, inherit)" },
    { suffix: "syntax-heading3-font-size", default: "1.4em" },
    { suffix: "syntax-heading3-font-weight", default: "600" },
    { suffix: "syntax-heading4-color", default: "var(--ink-internal-syntax-heading-color, inherit)" },
    { suffix: "syntax-heading4-font-size", default: "1.3em" },
    { suffix: "syntax-heading4-font-weight", default: "600" },
    { suffix: "syntax-heading5-color", default: "var(--ink-internal-syntax-heading-color, inherit)" },
    { suffix: "syntax-heading5-font-size", default: "1.2em" },
    { suffix: "syntax-heading5-font-weight", default: "600" },
    { suffix: "syntax-heading6-color", default: "var(--ink-internal-syntax-heading-color, inherit)" },
    { suffix: "syntax-heading6-font-size", default: "1.1em" },
    { suffix: "syntax-heading6-font-weight", default: "600" },
    { suffix: "syntax-highlight-background-color", default: "#555555" },
    { suffix: "syntax-keyword-color", default: "#c678dd" },
    { suffix: "syntax-link-color", default: "inherit" },
    { suffix: "syntax-meta-color", default: "#abb2bf" },
    { suffix: "syntax-monospace-color", default: "var(--ink-internal-code-color)" },
    { suffix: "syntax-monospace-font-family", default: "var(--ink-internal-code-font-family)" },
    { suffix: "syntax-name-color", default: "#d19a66" },
    { suffix: "syntax-name-label-color", default: "#abb2bf" },
    { suffix: "syntax-name-property-color", default: "#96c0d8" },
    { suffix: "syntax-name-property-definition-color", default: "#e06c75" },
    { suffix: "syntax-name-variable-color", default: "#e06c75" },
    { suffix: "syntax-name-variable-definition-color", default: "#e5c07b" },
    { suffix: "syntax-name-variable-local-color", default: "#d19a66" },
    { suffix: "syntax-name-variable-special-color", default: "inherit" },
    { suffix: "syntax-number-color", default: "#d19a66" },
    { suffix: "syntax-operator-color", default: "#96c0d8" },
    { suffix: "syntax-processing-instruction-color", default: "#444444", light: "#bbbbbb" },
    { suffix: "syntax-punctuation-color", default: "#abb2bf" },
    { suffix: "syntax-strikethrough-color", default: "inherit" },
    { suffix: "syntax-strikethrough-text-decoration", default: "line-through" },
    { suffix: "syntax-string-color", default: "#98c379" },
    { suffix: "syntax-string-special-color", default: "inherit" },
    { suffix: "syntax-strong-color", default: "inherit" },
    { suffix: "syntax-strong-font-weight", default: "600" },
    { suffix: "syntax-url-color", default: "#aaaaaa", light: "#666666" },
    { suffix: "toolbar-group-spacing", default: "2rem" },
    { suffix: "toolbar-item-spacing", default: "0" }
  ], t = !it(e.options.interface.appearance);
  return n.map((r) => {
    const o = t && r.light ? r.light : r.default;
    return `--ink-internal-${r.suffix}: var(--ink-${r.suffix}, ${o});`;
  });
}, at = (e) => [
  V.theme({
    ".cm-scroller": {
      fontFamily: "var(--ink-internal-font-family)"
    }
  }, { dark: e })
], st = ([e, n]) => e().extensions.map((r) => r.initialValue([e, n])), fe = async ([e, n]) => await Promise.all(
  e().extensions.map(async (r) => await r.reconfigure([e, n]))
), lt = (e) => {
  const n = new $e();
  return {
    compartment: n,
    initialValue: (t) => n.of(e(t)),
    reconfigure: (t) => n.reconfigure(e(t))
  };
}, ct = (e) => {
  const n = new $e();
  return {
    compartment: n,
    initialValue: () => n.of([]),
    reconfigure: (t) => e(t, n)
  };
}, dt = () => [
  ot(),
  ...ut.map((e) => lt(e)),
  ...ft.map((e) => ct(e))
], ut = [
  ([e]) => {
    const [n, t] = ue(Q(U.default, e().options));
    return t;
  },
  ([e]) => {
    const n = e().options.interface.appearance === Be.dark, t = e().options.interface.appearance === Be.auto;
    return at(n || t && Ge());
  }
], ft = [
  async ([e], n) => {
    const [t] = ue(Q(U.default, e().options));
    return t.length > 0 ? n.reconfigure(await Promise.all(t)) : n.reconfigure([]);
  },
  async ([e], n) => {
    if (e().options.interface.autocomplete) {
      const { autocomplete: t } = await import("./autocomplete-z_AqsyvV.js");
      return n.reconfigure(t(e().options));
    }
    return n.reconfigure([]);
  },
  async ([e], n) => {
    if (e().options.interface.images) {
      const { images: t } = await import("./images-u7VC9Q41.js");
      return n.reconfigure(t());
    }
    return n.reconfigure([]);
  },
  async ([e], n) => {
    const { keybindings: t, trapTab: r } = e().options, o = r ?? t.tab, i = r ?? t.shiftTab;
    if (o || i) {
      const { indentWithTab: s } = await import("./indentWithTab-ADkQMKa8.js");
      return n.reconfigure(s({ tab: o, shiftTab: i }));
    }
    return n.reconfigure([]);
  },
  async ([e], n) => {
    if (e().options.interface.lists) {
      const { lists: t } = await import("./lists-0jj7H_e2.js");
      return n.reconfigure(t());
    }
    return n.reconfigure([]);
  },
  async ([e], n) => {
    if (e().options.placeholder) {
      const { placeholder: t } = await import("./placeholder-E4_G3EYC.js");
      return n.reconfigure(t(e().options.placeholder));
    }
    return n.reconfigure([]);
  },
  async ([e], n) => {
    if (e().options.interface.readonly) {
      const { readonly: t } = await import("./readonly-WlHFWFmn.js");
      return n.reconfigure(t());
    }
    return n.reconfigure([]);
  },
  async ([e], n) => {
    if (e().options.search) {
      const { search: t } = await import("./search-VxR4ZcVd.js");
      return n.reconfigure(t());
    }
    return n.reconfigure([]);
  },
  async ([e], n) => {
    if (e().options.interface.spellcheck) {
      const { spellcheck: t } = await import("./spellcheck-XkgbXaRF.js");
      return n.reconfigure(t());
    }
    return n.reconfigure([]);
  },
  async ([e], n) => {
    if (e().options.vim) {
      const { vim: t } = await import("./vim-h1PoROEj.js");
      return n.reconfigure(t());
    }
    return n.reconfigure([]);
  }
], mt = [
  "Blockquote"
], gt = j.line({ attributes: { class: "cm-blockquote" } }), pt = j.line({ attributes: { class: "cm-blockquote-open" } }), kt = j.line({ attributes: { class: "cm-blockquote-close" } }), ht = Ie.define((e) => ({
  update: () => bt(e)
}), { decorations: (e) => e.update() }), bt = (e) => {
  const n = new qe(), t = ce(e.state);
  for (const r of e.visibleRanges)
    for (let o = r.from; o < r.to; ) {
      const i = e.state.doc.lineAt(o);
      t.iterate({
        enter({ type: s, from: a, to: l }) {
          if (s.name !== "Document" && mt.includes(s.name)) {
            n.add(i.from, i.from, gt);
            const c = e.state.doc.lineAt(a), f = e.state.doc.lineAt(l);
            return c.number === i.number && n.add(i.from, i.from, pt), f.number === i.number && n.add(i.from, i.from, kt), !1;
          }
        },
        from: i.from,
        to: i.to
      }), o = i.to + 1;
    }
  return n.finish();
}, xt = () => [
  ht
], vt = [
  "CodeBlock",
  "FencedCode",
  "HTMLBlock",
  "CommentBlock"
], X = {
  // Prevent spellcheck in all code blocks. The Grammarly extension might not respect these values.
  "data-enable-grammarly": "false",
  "data-gramm": "false",
  "data-grammarly-skip": "true",
  spellcheck: "false"
}, yt = j.line({ attributes: { ...X, class: "cm-codeblock" } }), $t = j.line({ attributes: { ...X, class: "cm-codeblock-open" } }), wt = j.line({ attributes: { ...X, class: "cm-codeblock-close" } }), _t = j.mark({ attributes: { ...X, class: "cm-code" } }), Mt = j.mark({ attributes: { ...X, class: "cm-code cm-code-open" } }), St = j.mark({ attributes: { ...X, class: "cm-code cm-code-close" } }), Ct = Ie.define((e) => ({
  update: () => Lt(e)
}), { decorations: (e) => e.update() }), Lt = (e) => {
  const n = new qe(), t = ce(e.state);
  for (const r of e.visibleRanges)
    for (let o = r.from; o < r.to; ) {
      const i = e.state.doc.lineAt(o);
      let s;
      t.iterate({
        enter({ type: a, from: l, to: c }) {
          if (a.name !== "Document")
            if (vt.includes(a.name)) {
              n.add(i.from, i.from, yt);
              const f = e.state.doc.lineAt(l), _ = e.state.doc.lineAt(c);
              return f.number === i.number && n.add(i.from, i.from, $t), _.number === i.number && n.add(i.from, i.from, wt), !1;
            } else
              a.name === "InlineCode" ? s = { from: l, to: c, innerFrom: l, innerTo: c } : a.name === "CodeMark" && (l === s.from ? (s.innerFrom = c, n.add(l, c, Mt)) : c === s.to && (s.innerTo = l, n.add(s.innerFrom, s.innerTo, _t), n.add(l, c, St)));
        },
        from: i.from,
        to: i.to
      }), o = i.to + 1;
    }
  return n.finish();
}, Et = () => [
  Ct
], jt = () => [
  V.editorAttributes.of({
    class: "ink-mde-container"
  }),
  V.contentAttributes.of({
    class: "ink-mde-editor-content"
  })
  // Todo: Maybe open a PR to add scrollerAttributes?
], Bt = () => [
  ...jt()
], At = () => V.lineWrapping, zt = () => [
  Pe(
    Oe.define([
      // ordered by lowest to highest precedence
      {
        tag: u.atom,
        color: "var(--ink-internal-syntax-atom-color)"
      },
      {
        tag: u.meta,
        color: "var(--ink-internal-syntax-meta-color)"
      },
      // emphasis types
      {
        tag: u.emphasis,
        color: "var(--ink-internal-syntax-emphasis-color)",
        fontStyle: "var(--ink-internal-syntax-emphasis-font-style)"
      },
      {
        tag: u.strong,
        color: "var(--ink-internal-syntax-strong-color)",
        fontWeight: "var(--ink-internal-syntax-strong-font-weight)"
      },
      {
        tag: u.strikethrough,
        color: "var(--ink-internal-syntax-strikethrough-color)",
        textDecoration: "var(--ink-internal-syntax-strikethrough-text-decoration)"
      },
      // comment group
      {
        tag: u.comment,
        color: "var(--ink-internal-syntax-comment-color)",
        fontStyle: "var(--ink-internal-syntax-comment-font-style)"
      },
      // monospace
      {
        tag: u.monospace,
        color: "var(--ink-internal-syntax-code-color)",
        fontFamily: "var(--ink-internal-syntax-code-font-family)"
      },
      // name group
      {
        tag: u.name,
        color: "var(--ink-internal-syntax-name-color)"
      },
      {
        tag: u.labelName,
        color: "var(--ink-internal-syntax-name-label-color)"
      },
      {
        tag: u.propertyName,
        color: "var(--ink-internal-syntax-name-property-color)"
      },
      {
        tag: u.definition(u.propertyName),
        color: "var(--ink-internal-syntax-name-property-definition-color)"
      },
      {
        tag: u.variableName,
        color: "var(--ink-internal-syntax-name-variable-color)"
      },
      {
        tag: u.definition(u.variableName),
        color: "var(--ink-internal-syntax-name-variable-definition-color)"
      },
      {
        tag: u.local(u.variableName),
        color: "var(--ink-internal-syntax-name-variable-local-color)"
      },
      {
        tag: u.special(u.variableName),
        color: "var(--ink-internal-syntax-name-variable-special-color)"
      },
      // headings
      {
        tag: u.heading,
        color: "var(--ink-internal-syntax-heading-color)",
        fontWeight: "var(--ink-internal-syntax-heading-font-weight)"
      },
      {
        tag: u.heading1,
        color: "var(--ink-internal-syntax-heading1-color)",
        fontSize: "var(--ink-internal-syntax-heading1-font-size)",
        fontWeight: "var(--ink-internal-syntax-heading1-font-weight)"
      },
      {
        tag: u.heading2,
        color: "var(--ink-internal-syntax-heading2-color)",
        fontSize: "var(--ink-internal-syntax-heading2-font-size)",
        fontWeight: "var(--ink-internal-syntax-heading2-font-weight)"
      },
      {
        tag: u.heading3,
        color: "var(--ink-internal-syntax-heading3-color)",
        fontSize: "var(--ink-internal-syntax-heading3-font-size)",
        fontWeight: "var(--ink-internal-syntax-heading3-font-weight)"
      },
      {
        tag: u.heading4,
        color: "var(--ink-internal-syntax-heading4-color)",
        fontSize: "var(--ink-internal-syntax-heading4-font-size)",
        fontWeight: "var(--ink-internal-syntax-heading4-font-weight)"
      },
      {
        tag: u.heading5,
        color: "var(--ink-internal-syntax-heading5-color)",
        fontSize: "var(--ink-internal-syntax-heading5-font-size)",
        fontWeight: "var(--ink-internal-syntax-heading5-font-weight)"
      },
      {
        tag: u.heading6,
        color: "var(--ink-internal-syntax-heading6-color)",
        fontSize: "var(--ink-internal-syntax-heading6-font-size)",
        fontWeight: "var(--ink-internal-syntax-heading6-font-weight)"
      },
      // contextual tag types
      {
        tag: u.keyword,
        color: "var(--ink-internal-syntax-keyword-color)"
      },
      {
        tag: u.number,
        color: "var(--ink-internal-syntax-number-color)"
      },
      {
        tag: u.operator,
        color: "var(--ink-internal-syntax-operator-color)"
      },
      {
        tag: u.punctuation,
        color: "var(--ink-internal-syntax-punctuation-color)"
      },
      {
        tag: u.link,
        color: "var(--ink-internal-syntax-link-color)"
      },
      {
        tag: u.url,
        color: "var(--ink-internal-syntax-url-color)"
      },
      // string group
      {
        tag: u.string,
        color: "var(--ink-internal-syntax-string-color)"
      },
      {
        tag: u.special(u.string),
        color: "var(--ink-internal-syntax-string-special-color)"
      },
      // processing instructions
      {
        tag: u.processingInstruction,
        color: "var(--ink-internal-syntax-processing-instruction-color)"
      }
    ])
  )
], Ht = (e) => {
  if (e.length > 0)
    return Ue(e);
}, Tt = ([
  e,
  n
]) => yn.create({
  doc: e().options.doc,
  selection: Ht(e().options.selections),
  extensions: [
    xt(),
    Et(),
    wn(),
    Bt(),
    At(),
    zt(),
    Ne.of([..._n, ...Mn]),
    ...st([e, n])
  ]
}), Dt = ([e, n], t) => {
  n(ee(e(), { options: { doc: t } })), e().editor.setState(Tt([e, n]));
}, Pt = ([e]) => e().options, Ot = async ([e, n], t) => {
  const { workQueue: r } = e();
  return r.enqueue(async () => {
    n(ee(e(), { options: t }));
    const o = await fe([e, n]);
    e().editor.dispatch({ effects: o });
  });
}, en = (e, n = {}) => {
  if (n.selections)
    return nn(e, n.selections);
  if (n.selection)
    return he(e, n.selection);
  if (n.at)
    return qt(e, n.at);
}, qt = (e, n) => {
  const [t] = e;
  if (n === ke.Start)
    return he(e, { start: 0, end: 0 });
  if (n === ke.End) {
    const r = t().editor.state.doc.length;
    return he(e, { start: r, end: r });
  }
}, nn = ([e], n) => {
  const { editor: t } = e();
  t.dispatch(
    t.state.update({
      selection: Ue(n)
    })
  );
}, he = (e, n) => nn(e, [n]), It = ([e], n) => {
  const { editor: t } = e();
  t.dispatch(
    t.state.update({
      changes: {
        from: 0,
        to: t.state.doc.length,
        insert: n
      }
    })
  );
}, Nt = ([e, n], { after: t, before: r, selection: o }) => {
  const { editor: i } = e(), s = o || _e([e, n]).pop() || { start: 0, end: 0 }, a = i.state.sliceDoc(s.start, s.end);
  de([e, n], `${r}${a}${t}`, s), en([e, n], { selections: [{ start: s.start + r.length, end: s.end + r.length }] });
}, Rt = (e, n) => {
  const t = {
    callbacks: {
      fulfilled: [],
      rejected: [],
      settled: []
    },
    status: "pending"
  }, r = (a, { resolve: l, reject: c }) => () => {
    try {
      const f = a(t.value);
      Promise.resolve(f).then(l, c);
    } catch (f) {
      c(f);
    }
  }, o = (a) => {
    t.status === "pending" && (t.status = "rejected", t.value = a, t.callbacks.rejected.forEach((l) => l()), t.callbacks.settled.forEach((l) => l()));
  }, i = (a) => {
    t.status === "pending" && (t.status = "fulfilled", t.value = a, t.callbacks.fulfilled.forEach((l) => l()), t.callbacks.settled.forEach((l) => l()));
  }, s = (a, l) => new Promise((c, f) => {
    t.status === "pending" && (a && t.callbacks.fulfilled.push(r(a, { resolve: c, reject: f })), l && t.callbacks.rejected.push(r(l, { resolve: void 0, reject: f }))), t.status === "fulfilled" && a && r(a, { resolve: c, reject: f })(), t.status === "rejected" && l && r(l, { resolve: void 0, reject: f })();
  });
  return queueMicrotask(() => {
    try {
      n(i, o);
    } catch (a) {
      o(a);
    }
  }), {
    ...e,
    [Symbol.toStringTag]: "awaitable",
    catch: s.bind(void 0, void 0),
    finally: (a) => new Promise((l, c) => {
      t.status === "pending" && t.callbacks.settled.push(r(a, { resolve: l, reject: c })), t.status === "fulfilled" && (a(), l(t.value)), t.status === "rejected" && (a(), c(t.value));
    }),
    then: s
  };
}, tn = (e) => {
  const n = {
    destroy: Dn.bind(void 0, e),
    focus: pe.bind(void 0, e),
    format: Ye.bind(void 0, e),
    getDoc: Un.bind(void 0, e),
    insert: de.bind(void 0, e),
    load: Dt.bind(void 0, e),
    options: Pt.bind(void 0, e),
    reconfigure: Ot.bind(void 0, e),
    select: en.bind(void 0, e),
    selections: _e.bind(void 0, e),
    update: It.bind(void 0, e),
    wrap: Nt.bind(void 0, e)
  };
  return Rt(n, (t, r) => {
    try {
      const [o] = e;
      o().workQueue.enqueue(() => t(n));
    } catch (o) {
      r(o);
    }
  });
}, Vt = (e) => an({
  block: !0,
  side: -1,
  ...e
}), rn = (e) => j.line({
  ...e,
  type: "line"
}), Wt = (e) => j.mark({
  ...e,
  type: "mark"
}), on = (e) => {
  const n = (t) => e.eq ? e.eq(t) : e.id ? e.id === t.id : !1;
  return {
    compare: (t) => n(t),
    coordsAt: () => null,
    destroy: () => {
    },
    eq: (t) => n(t),
    estimatedHeight: -1,
    ignoreEvent: () => !0,
    lineBreaks: 0,
    toDOM: () => document.createElement("span"),
    updateDOM: () => !1,
    ...e
  };
}, an = (e) => j.widget({
  block: !1,
  side: 0,
  ...e,
  widget: on({
    ...e.widget
  }),
  type: "widget"
}), ie = (e, n) => {
  const t = [];
  return ce(e).iterate({
    enter: (r) => {
      if (n.nodes.includes(r.type.name)) {
        const o = n.onMatch(e, r);
        if (!o)
          return;
        Array().concat(o).forEach((s) => {
          if (s.spec.type === "line") {
            const a = rn({ ...s.spec, node: { ...r } });
            for (let l = e.doc.lineAt(r.from); l.from < r.to; l = e.doc.lineAt(l.to + 1))
              t.push(a.range(l.from));
          }
          if (s.spec.type === "mark") {
            const a = Wt({ ...s.spec, node: { ...r } }).range(r.from, r.to);
            t.push(a);
          }
          if (s.spec.type === "widget") {
            const a = an({ ...s.spec, node: { ...r } }).range(r.from);
            t.push(a);
          }
        });
      }
    },
    from: n.range?.from,
    to: n.range?.to
  }), t.sort((r, o) => r.from - o.from);
}, Ft = (e, n, t) => {
  const r = [], o = e.iter(), i = [], s = [];
  for (; o.value; )
    i.push({ ...o }), o.next();
  n.changes.iterChangedRanges((c, f, _, y) => {
    i.forEach(($) => {
      if ($.value) {
        const q = $.value.spec.node.to - $.value.spec.node.from, I = $.from, T = $.from + q;
        Ut(I, T, _, y) && s.push($);
      }
    });
    const S = { from: _, to: y };
    r.push(...ie(n.state, { ...t, range: S }));
  });
  const a = i.filter((c) => !s.includes(c)).flatMap((c) => {
    const f = c.value?.range(c.from);
    return f ? [f] : [];
  });
  return r.push(...a), r.sort((c, f) => c.from - f.from);
}, Ut = (e, n, t, r) => Math.max(e, t) <= Math.min(n, r), ze = (e) => $n.define({
  create(n) {
    return te.of(ie(n, e));
  },
  update(n, t) {
    if (t.reconfigured || t.effects.length > 0)
      return te.of(ie(t.state, e));
    const r = n.map(t.changes);
    return t.docChanged ? e.optimize ? te.of(Ft(r, t, e)) : te.of(ie(t.state, e)) : r;
  },
  provide(n) {
    return V.decorations.from(n);
  }
}), Qt = (e) => Sn.define(e), Xt = (e) => e.charCodeAt(0), K = (e) => Me(e, [u.processingInstruction]), Me = (e, n = []) => {
  const t = Qt();
  return {
    node: Jt({
      name: e,
      style: [t, ...n]
    }),
    tag: t
  };
}, Kt = (e) => e, Yt = (e) => e, Zt = (e) => e, Jt = (e) => e, Gt = (e, n) => {
  const t = e[n];
  return t ? typeof t == "function" ? t() : Promise.resolve(t) : new Promise((r, o) => {
    (typeof queueMicrotask == "function" ? queueMicrotask : setTimeout)(o.bind(null, new Error("Unknown variable dynamic import: " + n)));
  });
}, re = new Proxy({}, {
  get: (e, n, t) => e[n] ? e[n] : e[n] = (async () => {
    const { importer: r } = await Gt(/* @__PURE__ */ Object.assign({ "./importers/katex.ts": () => import("./katex-deDlmqXG.js") }), `./importers/${n}.ts`), o = await r();
    return e[n] = o, o;
  })()
}), er = (e, n) => {
  if (!re[e])
    return console.error("[katex] module is not resolvable");
  if ("then" in re[e])
    return Promise.resolve(re[e]).then(n);
  n(re[e]);
}, G = {
  dollarSign: Xt("$")
}, nr = /\$.*?\$/, tr = /\$(?<math>.*?)\$/, se = Me("MathInline"), le = K("MathInlineMark"), Se = K("MathInlineMarkOpen"), Ce = K("MathInlineMarkClose"), rr = Yt({
  name: se.node.name,
  parse: (e, n, t) => {
    if (n !== G.dollarSign)
      return -1;
    const r = e.slice(t, e.end);
    if (!nr.test(r))
      return -1;
    const o = r.match(tr);
    if (!o?.groups?.math)
      return -1;
    const i = o.groups.math.length;
    return e.addElement(
      e.elt(
        se.node.name,
        t,
        t + i + 2,
        [
          e.elt(
            le.node.name,
            t,
            t + 1,
            [
              e.elt(
                Se.node.name,
                t,
                t + 1
              )
            ]
          ),
          e.elt(
            le.node.name,
            t + i + 1,
            t + i + 2,
            [
              e.elt(
                Ce.node.name,
                t + i + 1,
                t + i + 2
              )
            ]
          )
        ]
      )
    );
  }
}), sn = Me("MathBlock"), be = K("MathBlockMark"), ln = K("MathBlockMarkOpen"), cn = K("MathBlockMarkClose"), or = Kt({
  name: "MathBlock",
  parse: (e, n) => {
    if (n.next !== G.dollarSign || n.text.charCodeAt(n.pos + 1) !== G.dollarSign)
      return !1;
    const t = e.lineStart + n.pos, r = t + n.text.length;
    for (; e.nextLine(); )
      if (n.next === G.dollarSign && n.text.charCodeAt(n.pos + 1) === G.dollarSign) {
        const o = e.lineStart + n.pos, i = o + n.text.length;
        e.addElement(
          e.elt(
            sn.node.name,
            t,
            i,
            [
              e.elt(
                be.node.name,
                t,
                r,
                [
                  e.elt(
                    ln.node.name,
                    t,
                    r
                  )
                ]
              ),
              e.elt(
                be.node.name,
                o,
                i,
                [
                  e.elt(
                    cn.node.name,
                    o,
                    i
                  )
                ]
              )
            ]
          )
        ), e.nextLine();
        break;
      }
    return !0;
  }
}), ir = Zt({
  defineNodes: [
    se.node,
    le.node,
    Ce.node,
    Se.node,
    sn.node,
    be.node,
    ln.node,
    cn.node
  ],
  parseBlock: [
    or
  ],
  parseInline: [
    rr
  ]
}), He = (e, n) => {
  er("katex", (t) => {
    t.render(e, n, { output: "html", throwOnError: !1 });
  });
}, ar = () => [
  J({
    key: "katex",
    type: An.grammar,
    value: async () => ir
  }),
  J({
    key: "katex",
    value: async () => ze({
      nodes: ["MathBlock", "MathBlockMarkClose", "MathBlockMarkOpen"],
      onMatch: (e, n) => {
        const t = ["ink-mde-line-math-block"];
        return n.name === "MathBlockMarkOpen" && t.push("ink-mde-line-math-block-open"), n.name === "MathBlockMarkClose" && t.push("ink-mde-line-math-block-close"), rn({
          attributes: {
            class: t.join(" ")
          }
        });
      },
      optimize: !1
    })
  }),
  J({
    key: "katex",
    value: async () => ze({
      nodes: ["MathBlock"],
      onMatch: (e, n) => {
        const t = e.sliceDoc(n.from, n.to).split(`
`).slice(1, -1).join(`
`);
        if (t)
          return Vt({
            widget: on({
              id: t,
              toDOM: () => {
                const r = document.createElement("div"), o = document.createElement("div");
                return r.className = "ink-mde-block-widget-container", o.className = "ink-mde-block-widget ink-mde-katex-target", r.appendChild(o), He(t, o), r;
              },
              updateDOM: (r) => {
                const o = r.querySelector(".ink-mde-katex-target");
                return o ? (He(t, o), !0) : !1;
              }
            })
          });
      },
      optimize: !1
    })
  }),
  J({
    key: "katex",
    value: async () => Pe(
      Oe.define([
        {
          tag: [se.tag, le.tag],
          backgroundColor: "var(--ink-internal-block-background-color)"
        },
        {
          tag: [Ce.tag],
          backgroundColor: "var(--ink-internal-block-background-color)",
          borderRadius: "0 var(--ink-internal-border-radius) var(--ink-internal-border-radius) 0",
          paddingRight: "var(--ink-internal-inline-padding)"
        },
        {
          tag: [Se.tag],
          backgroundColor: "var(--ink-internal-block-background-color)",
          borderRadius: "var(--ink-internal-border-radius) 0 0 var(--ink-internal-border-radius)",
          paddingLeft: "var(--ink-internal-inline-padding)"
        }
      ])
    )
  }),
  J({
    key: "katex",
    value: async () => V.theme({
      ".ink-mde-line-math-block": {
        backgroundColor: "var(--ink-internal-block-background-color)",
        padding: "0 var(--ink-internal-block-padding) !important"
      },
      ".ink-mde-line-math-block-open": {
        borderRadius: "var(--ink-internal-border-radius) var(--ink-internal-border-radius) 0 0"
      },
      ".ink-mde-line-math-block-close": {
        borderRadius: "0 0 var(--ink-internal-border-radius) var(--ink-internal-border-radius)"
      }
    })
  })
], sr = () => {
  const e = {
    queue: [],
    workload: 0
  }, n = async () => {
    const t = e.queue.pop();
    t && (await t(), e.workload--, await n());
  };
  return {
    enqueue: (t) => new Promise((r, o) => {
      const i = async () => {
        try {
          await t(), r();
        } catch (s) {
          o(s);
        }
      };
      e.queue.push(i), e.workload++, !(e.workload > 1) && n();
    })
  };
}, xe = () => {
  const e = {
    doc: "",
    files: {
      clipboard: !1,
      dragAndDrop: !1,
      handler: () => {
      },
      injectMarkup: !0,
      types: ["image/*"]
    },
    hooks: {
      afterUpdate: () => {
      },
      beforeUpdate: () => {
      }
    },
    interface: {
      appearance: ae.Auto,
      attribution: !0,
      autocomplete: !1,
      images: !1,
      lists: !1,
      readonly: !1,
      spellcheck: !0,
      toolbar: !1
    },
    katex: !1,
    keybindings: {
      // Todo: Set these to false by default. https://codemirror.net/examples/tab
      tab: !0,
      shiftTab: !0
    },
    placeholder: "",
    plugins: [
      ar()
    ],
    readability: !1,
    search: !0,
    selections: [],
    toolbar: {
      bold: !0,
      code: !0,
      codeBlock: !0,
      heading: !0,
      image: !0,
      italic: !0,
      link: !0,
      list: !0,
      orderedList: !0,
      quote: !0,
      taskList: !0,
      upload: !1
    },
    // This value overrides both `tab` and `shiftTab` keybindings.
    trapTab: void 0,
    vim: !1
  };
  return {
    doc: "",
    editor: {},
    extensions: dt(),
    options: e,
    root: Ae(),
    target: Ae(),
    workQueue: sr()
  };
}, lr = (e) => ee(xe(), e), Le = (e, n = {}) => {
  const [t, r] = R(lr({ ...n, doc: e.doc || "", options: e }));
  return [t, r];
}, Ee = 225, cr = (e, n = Ee) => {
  const t = fr(e, n), r = mr(e), o = ur(e), i = dr(e);
  return [t, r, o, i].join(" | ");
}, dr = (e) => `${gr(e)} chars`, ur = (e) => `${pr(e)} lines`, fr = (e, n = Ee) => {
  const t = kr(e, n), r = Math.floor(t), o = Math.floor(t % 1 * 60);
  return r === 0 ? `${o}s read` : `${r}m ${o}s to read`;
}, mr = (e) => `${dn(e)} words`, gr = (e) => e.length, pr = (e) => e.split(/\n/).length, kr = (e, n = Ee) => dn(e) / n, dn = (e) => {
  const n = e.replace(/[']/g, "").replace(/[^\w\d]+/g, " ").trim();
  return n ? n.split(/\s+/).length : 0;
}, hr = /* @__PURE__ */ p("<div class=ink-mde-readability><span>"), br = /* @__PURE__ */ p("<span>&nbsp;|"), xr = /* @__PURE__ */ p('<div class=ink-mde-attribution><span>&nbsp;powered by <a class=ink-mde-attribution-link href=https://github.com/davidmyersdev/ink-mde rel="noopener noreferrer"target=_blank>ink-mde'), vr = /* @__PURE__ */ p("<div class=ink-mde-details><div class=ink-mde-container><div class=ink-mde-details-content><!$><!/><!$><!/><!$><!/>"), yr = () => {
  const [e] = Y();
  return (() => {
    const n = m(vr), t = n.firstChild, r = t.firstChild, o = r.firstChild, [i, s] = h(o.nextSibling), a = i.nextSibling, [l, c] = h(a.nextSibling), f = l.nextSibling, [_, y] = h(f.nextSibling);
    return g(r, d(x, {
      get when() {
        return e().options.readability;
      },
      get children() {
        const S = m(hr), $ = S.firstChild;
        return g($, () => cr(e().doc)), S;
      }
    }), i, s), g(r, d(x, {
      get when() {
        return gn(() => !!e().options.readability)() && e().options.interface.attribution;
      },
      get children() {
        return m(br);
      }
    }), l, c), g(r, d(x, {
      get when() {
        return e().options.interface.attribution;
      },
      get children() {
        return m(xr);
      }
    }), _, y), n;
  })();
}, $r = ".ink-drop-zone{align-items:center;background-color:#00000080;color:var(--ink-internal-color);display:flex;inset:0;justify-content:center;position:var(--ink-internal-modal-position);z-index:100}.ink-drop-zone:not(.visible){display:none}.ink-drop-zone-modal{background-color:var(--ink-internal-block-background-color);border-radius:var(--ink-internal-border-radius);box-sizing:border-box;height:100%;max-height:20rem;max-width:40rem;padding:1rem;position:relative;width:100%}.ink-drop-zone-hide{cursor:pointer;height:1.75rem;position:absolute;right:.25rem;top:.25rem;width:1.75rem}.ink-drop-zone-hide svg{background-color:var(--ink-internal-block-background-color)}.ink-drop-zone-droppable-area{align-items:center;border:.2rem dashed var(--ink-internal-color);border-radius:.125rem;box-sizing:border-box;display:flex;flex-direction:column;font-size:1.25em;gap:1rem;height:100%;justify-content:center;padding:1rem;text-align:center}.ink-drop-zone-file-preview{align-items:center;display:flex;flex-wrap:wrap;gap:.5rem;max-width:25.5rem}.ink-drop-zone-file-preview-image{border:.125rem solid #222;border-radius:.125rem;box-sizing:border-box;height:6rem;object-fit:cover;padding:.5rem;width:6rem}", wr = /* @__PURE__ */ p("<span>uploading files..."), _r = /* @__PURE__ */ p('<div class=ink-drop-zone><style></style><div class=ink-drop-zone-modal><div class=ink-drop-zone-droppable-area><div class=ink-drop-zone-file-preview></div><!$><!/></div><div class=ink-drop-zone-hide><svg xmlns=http://www.w3.org/2000/svg fill=none viewBox="0 0 24 24"stroke=currentColor><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z">'), Mr = /* @__PURE__ */ p("<img class=ink-drop-zone-file-preview-image>"), Sr = /* @__PURE__ */ p("<span>drop files here"), Cr = () => {
  const [e, n] = R(0), [t, r] = R([]), [o, i] = R(!1), [s, a] = R(!1), [l, c] = Y(), f = () => {
    a(!1);
  }, _ = (b) => {
    if (l().options.files.dragAndDrop) {
      b.preventDefault(), b.stopPropagation();
      const w = b.dataTransfer;
      w?.files ? T(w.files) : (n(0), a(!1), r([]));
    }
  }, y = (b) => {
    l().options.files.dragAndDrop && (b.preventDefault(), n(e() + 1), a(!0));
  }, S = (b) => {
    l().options.files.dragAndDrop && (b.preventDefault(), n(e() - 1), e() === 0 && a(!1));
  }, $ = (b) => {
    l().options.files.dragAndDrop && (b.preventDefault(), a(!0));
  }, q = (b) => {
    l().options.files.dragAndDrop && (b.preventDefault(), n(0), a(!1));
  }, I = (b) => {
    if (l().options.files.clipboard) {
      b.preventDefault();
      const w = b.clipboardData;
      w?.files && w.files.length > 0 && T(w.files);
    }
  }, T = (b) => {
    Array.from(b).forEach((w) => {
      r([...t(), w]);
    }), i(!0), a(!0), Promise.resolve(l().options.files.handler(b)).then((w) => {
      if (l().options.files.injectMarkup && w) {
        const Z = `![](${w})`;
        de([l, c], Z);
      }
    }).finally(() => {
      n(0), i(!1), a(!1), r([]);
    });
  };
  return Fe(() => {
    document.addEventListener("dragenter", y), document.addEventListener("dragleave", S), document.addEventListener("dragover", $), document.addEventListener("drop", q), l().root.addEventListener("paste", I);
  }), Cn(() => {
    document.removeEventListener("dragenter", y), document.removeEventListener("dragleave", S), document.removeEventListener("dragover", $), document.removeEventListener("drop", q), l().root.removeEventListener("paste", I);
  }), (() => {
    const b = m(_r), w = b.firstChild, Z = w.nextSibling, W = Z.firstChild, k = W.firstChild, D = k.nextSibling, [C, P] = h(D.nextSibling), O = W.nextSibling;
    return ve(w, "textContent", $r), W.addEventListener("drop", _), g(k, d(Ln, {
      get each() {
        return t().slice(0, 8);
      },
      children: (M) => (() => {
        const B = m(Mr);
        return ge((L) => {
          const z = M.name, H = URL.createObjectURL(M);
          return z !== L._v$ && je(B, "alt", L._v$ = z), H !== L._v$2 && je(B, "src", L._v$2 = H), L;
        }, {
          _v$: void 0,
          _v$2: void 0
        }), B;
      })()
    })), g(W, d(x, {
      get when() {
        return o();
      },
      get fallback() {
        return m(Sr);
      },
      get children() {
        return m(wr);
      }
    }), C, P), O.$$click = f, ge(() => b.classList.toggle("visible", !!s())), ye(), b;
  })();
};
Te(["click"]);
const Lr = ([e, n], t) => {
  const r = t?.getRootNode(), o = r?.nodeType === 11 ? r : void 0, i = new V({
    dispatch: (s) => {
      const { options: a } = e(), l = s.newDoc.toString();
      a.hooks.beforeUpdate(l), i.update([s]), s.docChanged && (n({ ...e(), doc: l }), a.hooks.afterUpdate(l));
    },
    root: o,
    // state: makeState([state, setState]),
    extensions: [Ne.of([
      {
        key: "Mod-k",
        run: () => (console.log("hi"), !0)
      }
    ])]
  });
  return i;
}, Er = (e) => {
  const [n, t] = Y(), r = Lr([n, t], e.target), {
    workQueue: o
  } = n();
  return t(ee(n(), {
    editor: r
  })), o.enqueue(async () => {
    const i = await fe([n, t]);
    r.dispatch({
      effects: i
    });
  }), r.dom;
}, jr = /* @__PURE__ */ p("<button class=ink-button type=button>"), E = (e) => (() => {
  const n = m(jr);
  return n.$$click = (t) => e.onclick(t), g(n, () => e.children), ye(), n;
})();
Te(["click"]);
const Br = ".ink-mde .ink-mde-toolbar{background-color:var(--ink-internal-block-background-color);color:inherit;display:flex;flex-shrink:0;overflow-x:auto;padding:.25rem}.ink-mde .ink-mde-toolbar .ink-mde-container{display:flex;gap:var(--ink-internal-toolbar-group-spacing)}.ink-mde .ink-mde-toolbar-group{display:flex;gap:var(--ink-internal-toolbar-item-spacing)}.ink-mde .ink-mde-toolbar .ink-button{align-items:center;background:none;border:none;border-radius:var(--ink-internal-border-radius);color:inherit;cursor:pointer;display:flex;height:2.25rem;justify-content:center;padding:.4rem;width:2.25rem}.ink-mde .ink-mde-toolbar .ink-button:hover{background-color:var(--ink-internal-block-background-color-on-hover)}.ink-mde .ink-mde-toolbar .ink-button>*{align-items:center;display:flex;height:100%}", Ar = /* @__PURE__ */ p('<svg viewBox="0 0 20 20"fill=none stroke=currentColor stroke-miterlimit=5 stroke-linecap=round stroke-linejoin=round><path d="M6 4V10M6 16V10M6 10H14M14 10V4M14 10V16">'), zr = /* @__PURE__ */ p('<svg viewBox="0 0 20 20"fill=none stroke=currentColor stroke-width=1.5 stroke-miterlimit=5 stroke-linecap=round stroke-linejoin=round><path d="M6.5 10H10.5C12.1569 10 13.5 11.3431 13.5 13C13.5 14.6569 12.1569 16 10.5 16H6.5V4H9.5C11.1569 4 12.5 5.34315 12.5 7C12.5 8.65686 11.1569 10 9.5 10">'), Hr = /* @__PURE__ */ p('<svg viewBox="0 0 20 20"fill=none stroke=currentColor stroke-miterlimit=5 stroke-linecap=round stroke-linejoin=round><path d="M11 4L9 16M13 4H9M7 16H11">'), oe = /* @__PURE__ */ p("<div class=ink-mde-toolbar-group><!$><!/><!$><!/><!$><!/>"), Tr = /* @__PURE__ */ p('<svg viewBox="0 0 20 20"fill=none stroke=currentColor stroke-miterlimit=5 stroke-linecap=round stroke-linejoin=round><path d="M2.00257 16H17.9955M2.00055 4H18M7 10H18.0659M2 8.5V11.4999C2.4 11.5 2.5 11.5 2.5 11.5V11V10.5M4 8.5V11.4999H4.5V11V10.5">'), Dr = /* @__PURE__ */ p('<svg viewBox="0 0 20 20"fill=none stroke=currentColor stroke-miterlimit=5 stroke-linecap=round stroke-linejoin=round><path d="M13 4L7 16"></path><path d="M5 7L2 10L5 13"></path><path d="M15 7L18 10L15 13">'), Pr = /* @__PURE__ */ p('<svg viewBox="0 0 20 20"fill=none stroke=currentColor stroke-miterlimit=5 stroke-linecap=round stroke-linejoin=round><path d="M7 4L8 6">'), Or = /* @__PURE__ */ p('<svg viewBox="0 0 20 20"fill=none stroke=currentColor stroke-miterlimit=5 stroke-linecap=round stroke-linejoin=round><path d="M7 16H17.8294"></path><path d="M2 16H4"></path><path d="M7 10H17.8294"></path><path d="M2 10H4"></path><path d="M7 4H17.8294"></path><path d="M2 4H4">'), qr = /* @__PURE__ */ p('<svg viewBox="0 0 20 20"fill=none stroke=currentColor stroke-miterlimit=5 stroke-linecap=round stroke-linejoin=round><path d="M7 16H18"></path><path d="M2 17.0242C2.48314 17.7569 3.94052 17.6154 3.99486 16.7919C4.05315 15.9169 3.1975 16.0044 2.99496 16.0044M2.0023 14.9758C2.48544 14.2431 3.94282 14.3846 3.99716 15.2081C4.05545 16.0831 3.1998 16.0002 2.99726 16.0002"></path><path d="M7 10H18"></path><path d="M2.00501 11.5H4M2.00193 8.97562C2.48449 8.24319 3.9401 8.38467 3.99437 9.20777C4.05259 10.0825 2.04342 10.5788 2 11.4996"></path><path d="M7 4H18"></path><path d="M2 5.5H4M2.99713 5.49952V2.5L2.215 2.93501">'), Ir = /* @__PURE__ */ p('<svg viewBox="0 0 20 20"fill=none stroke=currentColor stroke-miterlimit=5 stroke-linecap=round stroke-linejoin=round><path d="M7 16H17.8294"></path><path d="M5 15L3 17L2 16"></path><path d="M7 10H17.8294"></path><path d="M5 9L3 11L2 10"></path><path d="M7 4H17.8294"></path><path d="M5 3L3 5L2 4">'), Nr = /* @__PURE__ */ p('<svg viewBox="0 0 20 20"fill=none stroke=currentColor stroke-miterlimit=5 stroke-linecap=round stroke-linejoin=round><path d="M9.12127 10.881C10.02 11.78 11.5237 11.7349 12.4771 10.7813L15.2546 8.00302C16.2079 7.04937 16.253 5.54521 15.3542 4.6462C14.4555 3.74719 12.9512 3.79174 11.9979 4.74539L10.3437 6.40007M10.8787 9.11903C9.97997 8.22002 8.47626 8.26509 7.52288 9.21874L4.74545 11.997C3.79208 12.9506 3.74701 14.4548 4.64577 15.3538C5.54452 16.2528 7.04876 16.2083 8.00213 15.2546L9.65633 13.5999">'), Rr = /* @__PURE__ */ p('<svg viewBox="0 0 20 20"fill=none stroke=currentColor stroke-miterlimit=5 stroke-linecap=round stroke-linejoin=round><rect x=2 y=4 width=16 height=12 rx=1></rect><path d="M7.42659 7.67597L13.7751 13.8831M2.00208 12.9778L7.42844 7.67175"></path><path d="M11.9119 12.0599L14.484 9.54443L17.9973 12.9785"></path><path d="M10.9989 7.95832C11.551 7.95832 11.9986 7.52072 11.9986 6.98092C11.9986 6.44113 11.551 6.00354 10.9989 6.00354C10.4468 6.00354 9.99921 6.44113 9.99921 6.98092C9.99921 7.52072 10.4468 7.95832 10.9989 7.95832Z">'), Vr = /* @__PURE__ */ p('<svg viewBox="0 0 20 20"fill=none stroke=currentColor stroke-miterlimit=5 stroke-linecap=round stroke-linejoin=round><path d="M10 13V4M10 4L13 7M10 4L7 7"></path><path d="M2 13V15C2 15.5523 2.44772 16 3 16H17C17.5523 16 18 15.5523 18 15V13">'), Wr = /* @__PURE__ */ p("<input type=file>"), Fr = /* @__PURE__ */ p("<div class=ink-mde-toolbar><style></style><div class=ink-mde-container><!$><!/><!$><!/><!$><!/><!$><!/>"), Ur = () => {
  const [e, n] = Y(), [t, r] = R(), o = (a) => {
    Ye([e, n], a), pe([e, n]);
  }, i = (a) => {
    const l = a.target;
    l?.files && Promise.resolve(e().options.files.handler(l.files)).then((c) => {
      if (c) {
        const f = `![](${c})`;
        de([e, n], f), pe([e, n]);
      }
    });
  }, s = () => {
    t()?.click();
  };
  return (() => {
    const a = m(Fr), l = a.firstChild, c = l.nextSibling, f = c.firstChild, [_, y] = h(f.nextSibling), S = _.nextSibling, [$, q] = h(S.nextSibling), I = $.nextSibling, [T, b] = h(I.nextSibling), w = T.nextSibling, [Z, W] = h(w.nextSibling);
    return ve(l, "textContent", Br), g(c, d(x, {
      get when() {
        return e().options.toolbar.heading || e().options.toolbar.bold || e().options.toolbar.italic;
      },
      get children() {
        const k = m(oe), D = k.firstChild, [C, P] = h(D.nextSibling), O = C.nextSibling, [M, B] = h(O.nextSibling), L = M.nextSibling, [z, H] = h(L.nextSibling);
        return g(k, d(x, {
          get when() {
            return e().options.toolbar.heading;
          },
          get children() {
            return d(E, {
              onclick: () => o(v.Heading),
              get children() {
                return m(Ar);
              }
            });
          }
        }), C, P), g(k, d(x, {
          get when() {
            return e().options.toolbar.bold;
          },
          get children() {
            return d(E, {
              onclick: () => o(v.Bold),
              get children() {
                return m(zr);
              }
            });
          }
        }), M, B), g(k, d(x, {
          get when() {
            return e().options.toolbar.italic;
          },
          get children() {
            return d(E, {
              onclick: () => o(v.Italic),
              get children() {
                return m(Hr);
              }
            });
          }
        }), z, H), k;
      }
    }), _, y), g(c, d(x, {
      get when() {
        return e().options.toolbar.quote || e().options.toolbar.codeBlock || e().options.toolbar.code;
      },
      get children() {
        const k = m(oe), D = k.firstChild, [C, P] = h(D.nextSibling), O = C.nextSibling, [M, B] = h(O.nextSibling), L = M.nextSibling, [z, H] = h(L.nextSibling);
        return g(k, d(x, {
          get when() {
            return e().options.toolbar.quote;
          },
          get children() {
            return d(E, {
              onclick: () => o(v.Quote),
              get children() {
                return m(Tr);
              }
            });
          }
        }), C, P), g(k, d(x, {
          get when() {
            return e().options.toolbar.codeBlock;
          },
          get children() {
            return d(E, {
              onclick: () => o(v.CodeBlock),
              get children() {
                return m(Dr);
              }
            });
          }
        }), M, B), g(k, d(x, {
          get when() {
            return e().options.toolbar.code;
          },
          get children() {
            return d(E, {
              onclick: () => o(v.Code),
              get children() {
                return m(Pr);
              }
            });
          }
        }), z, H), k;
      }
    }), $, q), g(c, d(x, {
      get when() {
        return e().options.toolbar.list || e().options.toolbar.orderedList || e().options.toolbar.taskList;
      },
      get children() {
        const k = m(oe), D = k.firstChild, [C, P] = h(D.nextSibling), O = C.nextSibling, [M, B] = h(O.nextSibling), L = M.nextSibling, [z, H] = h(L.nextSibling);
        return g(k, d(x, {
          get when() {
            return e().options.toolbar.list;
          },
          get children() {
            return d(E, {
              onclick: () => o(v.List),
              get children() {
                return m(Or);
              }
            });
          }
        }), C, P), g(k, d(x, {
          get when() {
            return e().options.toolbar.orderedList;
          },
          get children() {
            return d(E, {
              onclick: () => o(v.OrderedList),
              get children() {
                return m(qr);
              }
            });
          }
        }), M, B), g(k, d(x, {
          get when() {
            return e().options.toolbar.taskList;
          },
          get children() {
            return d(E, {
              onclick: () => o(v.TaskList),
              get children() {
                return m(Ir);
              }
            });
          }
        }), z, H), k;
      }
    }), T, b), g(c, d(x, {
      get when() {
        return e().options.toolbar.link || e().options.toolbar.image || e().options.toolbar.upload;
      },
      get children() {
        const k = m(oe), D = k.firstChild, [C, P] = h(D.nextSibling), O = C.nextSibling, [M, B] = h(O.nextSibling), L = M.nextSibling, [z, H] = h(L.nextSibling);
        return g(k, d(x, {
          get when() {
            return e().options.toolbar.link;
          },
          get children() {
            return d(E, {
              onclick: () => o(v.Link),
              get children() {
                return m(Nr);
              }
            });
          }
        }), C, P), g(k, d(x, {
          get when() {
            return e().options.toolbar.image;
          },
          get children() {
            return d(E, {
              onclick: () => o(v.Image),
              get children() {
                return m(Rr);
              }
            });
          }
        }), M, B), g(k, d(x, {
          get when() {
            return e().options.toolbar.upload;
          },
          get children() {
            return d(E, {
              onclick: s,
              get children() {
                return [m(Vr), (() => {
                  const ne = m(Wr);
                  return De(r, ne), ne.addEventListener("change", i), ne.style.setProperty("display", "none"), ne;
                })()];
              }
            });
          }
        }), z, H), k;
      }
    }), Z, W), a;
  })();
}, Qr = ".ink-mde{border:2px solid var(--ink-internal-block-background-color);border-radius:var(--ink-internal-border-radius);color:var(--ink-internal-color, inherit);display:flex;flex-direction:var(--ink-internal-flex-direction, column);font-family:var(--ink-internal-font-family)}.ink-mde .cm-cursor{border-left-color:var(--ink-internal-color, inherit);margin-left:0}.ink-mde .cm-tooltip{background-color:var(--ink-internal-block-background-color);border-radius:var(--ink-internal-border-radius);font-family:inherit;padding:.25rem}.ink-mde .cm-tooltip.cm-tooltip-autocomplete ul{font-family:inherit}.ink-mde .cm-tooltip.cm-tooltip-autocomplete ul li.ink-tooltip-option{border-radius:var(--ink-internal-border-radius);padding:.25rem}.ink-mde .cm-tooltip.cm-tooltip-autocomplete ul li.ink-tooltip-option[aria-selected]{background-color:#96969640}.ink-mde .cm-completionLabel{font-family:inherit}.ink-mde,.ink-mde *{box-sizing:border-box}.ink-mde,.ink-mde .ink-mde-editor{display:flex;flex-direction:column;flex-grow:1;flex-shrink:1;min-height:0}.ink-mde .ink-mde-editor{overflow:auto;padding:.5rem}.ink-mde .ink-mde-toolbar,.ink-mde .ink-mde-details{display:flex;flex-grow:0;flex-shrink:0}.ink-mde .ink-mde-details{background-color:var(--ink-internal-block-background-color);display:flex;padding:.5rem}.ink-mde .ink-mde-details-content{color:inherit;display:flex;filter:brightness(.75);flex-wrap:wrap;font-size:.75em;justify-content:flex-end}.ink-mde .ink-mde-attribution{display:flex;justify-content:flex-end}.ink-mde .ink-mde-attribution-link{color:currentColor;font-weight:600;text-decoration:none}.ink-mde .ink-mde-container{margin-left:auto;margin-right:auto;width:100%}.ink-mde .ink-mde-search-panel{background-color:var(--ink-internal-block-background-color);border-radius:.25rem;padding:.25rem;position:absolute;right:.25rem;top:.25rem;width:clamp(10rem,30%,100%)}.ink-mde .ink-mde-search-panel:focus-within{outline-color:#6495ed;outline-style:solid}.ink-mde .ink-mde-search-input{background-color:transparent;border:none;border-radius:.25rem;color:inherit;font-size:inherit;outline:none;width:100%}.ink-mde .ink-mde-task-toggle{cursor:pointer;height:1rem;line-height:2em;margin:0 .25rem 0 0;position:relative;top:-1px;vertical-align:middle;width:1rem}.ink-mde .cm-editor{display:flex;flex-direction:column;position:relative}.ink-mde .cm-panels{background-color:unset;border:unset;z-index:10}.ink-mde .cm-searchMatch{background-color:#6495ed50}.ink-mde .cm-searchMatch-selected{background-color:#6495edcc}.ink-mde .cm-scroller{align-items:flex-start;display:flex;font-family:var(--ink-internal-font-family);font-size:var(--ink-internal-editor-font-size);line-height:var(--ink-internal-editor-line-height);overflow-x:auto;position:relative}.ink-mde .cm-content{display:block;flex-grow:2;flex-shrink:0;margin:0;outline:none;padding:0;white-space:nowrap}.ink-mde .cm-lineWrapping{display:flex;flex-direction:column;flex-shrink:1;overflow-wrap:unset;word-break:break-word;white-space:pre-wrap;width:100%;overflow-x:hidden}.ink-mde .cm-line .cm-code,.ink-mde .cm-line .cm-blockquote{word-break:break-all}.ink-mde .cm-line{font-family:var(--ink-internal-font-family);padding:0}.ink-mde .cm-line span{display:inline}.ink-mde .cm-line.cm-blockquote{background-color:var(--ink-internal-block-background-color);border-left:.25rem solid currentColor;padding:0 var(--ink-internal-block-padding)}.ink-mde .cm-line.cm-blockquote.cm-blockquote-open{border-top-left-radius:var(--ink-internal-border-radius);border-top-right-radius:var(--ink-internal-border-radius);padding-top:var(--ink-internal-block-padding)}.ink-mde .cm-line.cm-blockquote.cm-blockquote-close{border-bottom-left-radius:var(--ink-internal-border-radius);border-bottom-right-radius:var(--ink-internal-border-radius);padding-bottom:var(--ink-internal-block-padding)}.ink-mde .cm-line.cm-codeblock{background-color:var(--ink-internal-block-background-color);font-family:var(--ink-internal-code-font-family);padding:0 var(--ink-internal-block-padding)}.ink-mde .cm-line.cm-codeblock.cm-codeblock-open{border-radius:var(--ink-internal-border-radius) var(--ink-internal-border-radius) 0 0;padding-top:var(--ink-internal-block-padding)}.ink-mde .cm-line.cm-codeblock.cm-codeblock-close{border-radius:0 0 var(--ink-internal-border-radius) var(--ink-internal-border-radius);padding-bottom:var(--ink-internal-block-padding)}.ink-mde .cm-line .cm-code{background-color:var(--ink-internal-block-background-color);font-family:var(--ink-internal-code-font-family);padding:var(--ink-internal-inline-padding) 0}.ink-mde .cm-line .cm-code.cm-code-open{border-radius:var(--ink-internal-border-radius) 0 0 var(--ink-internal-border-radius);padding-left:var(--ink-internal-inline-padding)}.ink-mde .cm-line .cm-code.cm-code-close{border-radius:0 var(--ink-internal-border-radius) var(--ink-internal-border-radius) 0;padding-right:var(--ink-internal-inline-padding)}.ink-mde .cm-image-backdrop{background-color:var(--ink-internal-block-background-color)}.ink-mde .ink-mde-block-widget-container{padding:.5rem 0}.ink-mde .ink-mde-block-widget{background-color:var(--ink-internal-block-background-color);border-radius:var(--ink-internal-border-radius);padding:var(--ink-internal-block-padding)}", Xr = /* @__PURE__ */ p("<style> "), Kr = () => {
  const [e, n] = Y(), [t, r] = R(me(e()));
  return En(() => {
    r(me(e()));
  }), Fe(() => {
    const o = window.matchMedia("(prefers-color-scheme: dark)"), i = (s) => {
      const {
        editor: a,
        root: l,
        workQueue: c
      } = e();
      l.isConnected ? c.enqueue(async () => {
        const f = await fe([e, n]);
        a.dispatch({
          effects: f
        }), r(me(e()));
      }) : o.removeEventListener("change", i);
    };
    o.addEventListener("change", i);
  }), (() => {
    const o = m(Xr), i = o.firstChild;
    return ge(() => ve(i, "data", `.ink {
  ${t().join(`
  `)}
}
${Qr}`)), o;
  })();
}, Yr = /* @__PURE__ */ p('<div class="ink ink-mde"><!$><!/><!$><!/><!$><!/><div class=ink-mde-editor></div><!$><!/>'), Zr = (e) => {
  const [n, t] = Y(), r = (o) => {
    t(ee(n(), {
      root: o
    }));
  };
  return (() => {
    const o = m(Yr), i = o.firstChild, [s, a] = h(i.nextSibling), l = s.nextSibling, [c, f] = h(l.nextSibling), _ = c.nextSibling, [y, S] = h(_.nextSibling), $ = y.nextSibling, q = $.nextSibling, [I, T] = h(q.nextSibling);
    return De(r, o), pn(o, kn(Tn), !1, !0), g(o, d(Kr, {}), s, a), g(o, d(x, {
      get when() {
        return n().options.files.clipboard || n().options.files.dragAndDrop;
      },
      get children() {
        return d(Cr, {});
      }
    }), c, f), g(o, d(x, {
      get when() {
        return n().options.interface.toolbar;
      },
      get children() {
        return d(Ur, {});
      }
    }), y, S), g($, d(Er, {
      get target() {
        return e.target;
      }
    })), g(o, d(x, {
      get when() {
        return n().options.readability || n().options.interface.attribution;
      },
      get children() {
        return d(yr, {
          store: [n, t]
        });
      }
    }), I, T), ye(), o;
  })();
}, un = jn([() => xe(), (e) => typeof e == "function" ? e(xe()) : e]), Jr = (e) => (
  // eslint-disable-next-line solid/reactivity
  d(un.Provider, {
    get value() {
      return e.store;
    },
    get children() {
      return e.children;
    }
  })
), Y = () => Bn(un), fn = (e) => d(Jr, {
  get store() {
    return e.store;
  },
  get children() {
    return d(Zr, {
      get store() {
        return e.store;
      },
      get target() {
        return e.target;
      }
    });
  }
}), Gr = /* @__PURE__ */ p("<div class=ink-mde-textarea>"), go = (e) => e, po = (e) => e, ko = (e) => e, eo = (e, n = {}) => {
  const t = Le(n);
  return to(), hn(() => d(fn, {
    store: t,
    target: e
  }), e), tn(t);
}, ho = (e, n = {}) => e.querySelector(Hn) ? eo(e, n) : mn(e, n), no = ({
  key: e = "",
  type: n,
  value: t
}) => new Proxy({
  key: e,
  type: n || "default"
}, {
  get: (r, o, i) => o === "value" && !r[o] ? (r.value = t(), Ze(r.value) ? r.value.then((s) => r.value = s) : r.value) : r[o]
}), bo = no, mn = (e, n = {}) => {
  const t = Le(n);
  return bn(() => d(fn, {
    store: t,
    target: e
  }), e), tn(t);
}, xo = (e = {}) => (Le(e), ""), to = () => {
  let e, n;
  e = window._$HY || (window._$HY = {
    events: [],
    completed: /* @__PURE__ */ new WeakSet(),
    r: {}
  }), n = (t) => t && t.hasAttribute && (t.hasAttribute("data-hk") ? t : n(t.host && t.host instanceof Node ? t.host : t.parentNode)), ["click", "input"].forEach((t) => document.addEventListener(t, (r) => {
    let o = r.composedPath && r.composedPath()[0] || r.target, i = n(o);
    i && !e.completed.has(i) && e.events.push([i, r]);
  })), e.init = (t, r) => {
    e.r[t] = [new Promise((o, i) => r = o), r];
  }, e.set = (t, r, o) => {
    (o = e.r[t]) && o[1](r), e.r[t] = [r];
  }, e.unset = (t) => {
    delete e.r[t];
  }, e.load = (t, r) => {
    if (r = e.r[t])
      return r[0];
  };
}, vo = (e, n = {}) => {
  const t = m(Gr), r = e.value;
  e.after(t), e.style.display = "none";
  const o = mn(t, {
    doc: r,
    ...n
  });
  return e.form && e.form.addEventListener("submit", () => {
    e.value = o.getDoc();
  }), o;
};
export {
  U as a,
  on as b,
  po as c,
  go as d,
  ko as e,
  Q as f,
  no as g,
  eo as h,
  ho as i,
  bo as j,
  xo as k,
  Be as l,
  ue as p,
  mn as r,
  to as s,
  vo as w
};
//# sourceMappingURL=index-2b9Bjr3S.js.map
