import { indentMore, indentLess } from '@codemirror/commands';
import { keymap } from '@codemirror/view';

const indentWithTab = ({ tab = true, shiftTab = true } = {}) => {
  return keymap.of([
    {
      key: "Tab",
      run: tab ? indentMore : void 0
    },
    {
      key: "Shift-Tab",
      run: shiftTab ? indentLess : void 0
    }
  ]);
};

export { indentWithTab };
//# sourceMappingURL=indentWithTab-yzP9bxnx.js.map
