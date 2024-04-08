import { type Extension } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { format } from "/src/api";
import { InkInternal } from "/types";
import { Prec } from "@codemirror/state";

export const markdownKeymap = (state: InkInternal.Store) => (): Extension => {
	return Prec.highest(
		keymap.of([
			{
				key: "Mod-b",
				run: () => {
					format(state, "bold");
					return true;
				},
				preventDefault: true,
			},
			{
				key: "Mod-i",
				run: () => {
					format(state, "italic");
					return true;
				},
				preventDefault: true,
			},
		])
	);
};
