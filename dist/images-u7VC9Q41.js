import { syntaxTree as m } from "@codemirror/language";
import { StateField as g, RangeSet as u } from "@codemirror/state";
import { EditorView as p, Decoration as d, WidgetType as h } from "@codemirror/view";
class y extends h {
  url;
  constructor({ url: t }) {
    super(), this.url = t;
  }
  eq(t) {
    return t.url === this.url;
  }
  toDOM() {
    const t = document.createElement("div"), r = t.appendChild(document.createElement("div")), n = r.appendChild(document.createElement("figure")), e = n.appendChild(document.createElement("img"));
    return t.setAttribute("aria-hidden", "true"), t.className = "cm-image-container", r.className = "cm-image-backdrop", n.className = "cm-image-figure", e.className = "cm-image-img", e.src = this.url, t.style.paddingBottom = "0.5rem", t.style.paddingTop = "0.5rem", r.classList.add("cm-image-backdrop"), r.style.borderRadius = "var(--ink-internal-border-radius)", r.style.display = "flex", r.style.alignItems = "center", r.style.justifyContent = "center", r.style.overflow = "hidden", r.style.maxWidth = "100%", n.style.margin = "0", e.style.display = "block", e.style.maxHeight = "var(--ink-internal-block-max-height)", e.style.maxWidth = "100%", e.style.width = "100%", t;
  }
}
const k = () => {
  const s = /!\[.*?\]\((?<url>.*?)\)/, t = (e) => d.widget({
    widget: new y(e),
    side: -1,
    block: !0
  }), r = (e) => {
    const i = [];
    return m(e).iterate({
      enter: ({ type: c, from: o, to: l }) => {
        if (c.name === "Image") {
          const a = s.exec(e.doc.sliceString(o, l));
          a && a.groups && a.groups.url && i.push(t({ url: a.groups.url }).range(e.doc.lineAt(o).from));
        }
      }
    }), i.length > 0 ? u.of(i) : d.none;
  };
  return [
    g.define({
      create(e) {
        return r(e);
      },
      update(e, i) {
        return i.docChanged ? r(i.state) : e.map(i.changes);
      },
      provide(e) {
        return p.decorations.from(e);
      }
    })
  ];
};
export {
  k as images
};
//# sourceMappingURL=images-u7VC9Q41.js.map
