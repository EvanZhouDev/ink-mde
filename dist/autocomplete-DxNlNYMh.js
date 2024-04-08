import { autocompletion, closeBrackets } from '@codemirror/autocomplete';
import { p as partitionPlugins, f as filterPlugins, pluginTypes } from './index.js';
import 'solid-js/web';
import '@codemirror/language';
import '@codemirror/state';
import '@codemirror/commands';
import '@codemirror/view';
import '@codemirror/lang-markdown';
import '@codemirror/language-data';
import '@lezer/highlight';
import 'solid-js';
import 'ink-mde';

const autocomplete = (options) => {
  const [_lazyCompletions, completions] = partitionPlugins(filterPlugins(pluginTypes.completion, options));
  return [
    autocompletion({
      defaultKeymap: true,
      icons: false,
      override: completions,
      optionClass: () => "ink-tooltip-option"
    }),
    closeBrackets()
  ];
};

export { autocomplete };
//# sourceMappingURL=autocomplete-DxNlNYMh.js.map
