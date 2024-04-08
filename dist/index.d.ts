import { CompletionSource } from '@codemirror/autocomplete';
import { LanguageDescription } from '@codemirror/language';
import { Extension } from '@codemirror/state';
import { MarkdownConfig } from '@lezer/markdown';

declare enum Appearance {
    Auto = "auto",
    Dark = "dark",
    Light = "light"
}
declare enum Extensions {
    Appearance = "appearance",
    Attribution = "attribution",
    Autocomplete = "autocomplete",
    Images = "images",
    ReadOnly = "readonly",
    Spellcheck = "spellcheck",
    Vim = "vim"
}
declare enum Markup$1 {
    Bold = "bold",
    Code = "code",
    CodeBlock = "code_block",
    Heading = "heading",
    Image = "image",
    Italic = "italic",
    Link = "link",
    List = "list",
    OrderedList = "ordered_list",
    Quote = "quote",
    TaskList = "task_list"
}
declare enum PluginType {
    Completion = "completion",
    Default = "default",
    Grammar = "grammar",
    Language = "language"
}
declare enum Selection {
    End = "end",
    Start = "start"
}
declare const appearanceTypes: {
    auto: string;
    dark: string;
    light: string;
};
declare const pluginTypes: {
    readonly completion: "completion";
    readonly default: "default";
    readonly grammar: "grammar";
    readonly language: "language";
};

type VendorCompletion = CompletionSource;
type VendorExtension = Extension;
type VendorGrammar = MarkdownConfig;
type VendorLanguage = LanguageDescription;
declare namespace Editor {
    interface Selection {
        end: number;
        start: number;
    }
}
type EnumString<T extends string> = `${T}`;
type Awaitable<T> = T & Promise<T>;
type AwaitableInstance = Awaitable<Instance>;
interface Instance {
    destroy: () => void;
    focus: () => void;
    format: (type: EnumString<Markup$1>, options: Instance.FormatOptions) => void;
    getDoc: () => string;
    insert: (text: string, selection?: Editor.Selection) => void;
    load: (doc: string) => void;
    options: () => OptionsResolved;
    reconfigure: (updates: Options) => void;
    select: (options: Instance.SelectOptions) => void;
    selections: () => Editor.Selection[];
    update: (doc: string) => void;
    wrap: (options: Instance.WrapOptions) => void;
}
declare namespace Instance {
    interface FormatOptions {
        selection?: Editor.Selection;
    }
    interface SelectOptions {
        at?: EnumString<Selection>;
        selection?: Editor.Selection;
        selections?: Editor.Selection[];
    }
    interface WrapOptions {
        after: string;
        before: string;
        selection?: Editor.Selection;
    }
}
interface Markup {
    [Markup$1.Bold]: Markup.Definition;
    [Markup$1.Code]: Markup.Definition;
    [Markup$1.CodeBlock]: Markup.Definition;
    [Markup$1.Heading]: Markup.Definition;
    [Markup$1.Image]: Markup.Definition;
    [Markup$1.Italic]: Markup.Definition;
    [Markup$1.Link]: Markup.Definition;
    [Markup$1.List]: Markup.Definition;
    [Markup$1.OrderedList]: Markup.Definition;
    [Markup$1.Quote]: Markup.Definition;
    [Markup$1.TaskList]: Markup.Definition;
}
declare namespace Markup {
    interface Definition {
        block: boolean;
        line: boolean;
        multiline: boolean;
        nodes: string[];
        prefix: string;
        prefixStates: string[];
        suffix: string;
    }
}
interface OptionsResolved {
    doc: string;
    files: Required<Options.Files>;
    hooks: Required<Options.Hooks>;
    interface: Required<Options.Interface>;
    katex: boolean;
    keybindings: {
        shiftTab: boolean;
        tab: boolean;
    };
    placeholder: string;
    plugins: Options.RecursivePlugin[];
    readability: boolean;
    search: boolean;
    selections: Editor.Selection[];
    toolbar: Required<Options.Toolbar>;
    trapTab?: boolean;
    vim: boolean;
}
interface Options {
    doc?: string;
    files?: Partial<Options.Files>;
    hooks?: Partial<Options.Hooks>;
    interface?: Partial<Options.Interface>;
    katex?: boolean;
    keybindings?: {
        shiftTab?: boolean;
        tab?: boolean;
    };
    placeholder?: string;
    plugins?: Options.RecursivePlugin[];
    readability?: boolean;
    search?: boolean;
    selections?: Editor.Selection[];
    toolbar?: Partial<Options.Toolbar>;
    trapTab?: boolean;
    vim?: boolean;
}
declare namespace Options {
    type ExtensionNames = keyof Options.Extensions;
    type Plugin = Plugins.Completion | Plugins.Default | Plugins.Grammar | Plugins.Language;
    type RecursivePlugin = Plugin | RecursivePlugin[];
    namespace Plugins {
        interface Completion {
            key?: string;
            type: EnumString<PluginType.Completion>;
            value: VendorCompletion | Promise<VendorCompletion>;
        }
        interface Default {
            key?: string;
            type: EnumString<PluginType.Default>;
            value: VendorExtension | Promise<VendorExtension>;
        }
        interface Grammar {
            key?: string;
            type: EnumString<PluginType.Grammar>;
            value: VendorGrammar | Promise<VendorGrammar>;
        }
        interface Language {
            key?: string;
            type: EnumString<PluginType.Language>;
            value: VendorLanguage | Promise<VendorLanguage>;
        }
    }
    interface Extensions {
        [Extensions.Appearance]: EnumString<Appearance>;
        [Extensions.Autocomplete]: boolean;
        [Extensions.Images]: boolean;
        [Extensions.ReadOnly]: boolean;
        [Extensions.Spellcheck]: boolean;
        [Extensions.Vim]: boolean;
    }
    interface Files {
        clipboard: boolean;
        dragAndDrop: boolean;
        handler: (files: FileList) => Promise<string | void> | string | void;
        injectMarkup: boolean;
        types: string[];
    }
    interface Hooks {
        afterUpdate: (doc: string) => void;
        beforeUpdate: (doc: string) => void;
    }
    namespace Hooks {
        type AfterUpdate = (doc: string) => void;
        type BeforeUpdate = (doc: string) => void;
    }
    interface Interface {
        [Extensions.Appearance]: Options.Extensions[Extensions.Appearance];
        [Extensions.Autocomplete]: Options.Extensions[Extensions.Autocomplete];
        [Extensions.Images]: Options.Extensions[Extensions.Images];
        [Extensions.ReadOnly]: Options.Extensions[Extensions.ReadOnly];
        [Extensions.Spellcheck]: Options.Extensions[Extensions.Spellcheck];
        attribution: boolean;
        lists: boolean;
        toolbar: boolean;
    }
    interface Toolbar {
        bold: boolean;
        code: boolean;
        codeBlock: boolean;
        heading: boolean;
        image: boolean;
        italic: boolean;
        link: boolean;
        list: boolean;
        orderedList: boolean;
        quote: boolean;
        taskList: boolean;
        upload: boolean;
    }
}
declare namespace Values {
    type Appearance = EnumString<Appearance>;
    type Extensions = EnumString<Extensions>;
    type Markup = EnumString<Markup$1>;
    type PluginType = EnumString<PluginType>;
    type Selection = EnumString<Selection>;
}

type PluginForType<T extends Values.PluginType> = Extract<Options.Plugin, {
    type: T;
}>;
type PluginValueForType<T extends Values.PluginType> = PluginForType<T>['value'];

declare const defineConfig: <T extends Options>(config: T) => T;
declare const defineOptions: <T extends Options>(options: T) => T;
declare const definePlugin: <T extends Options.RecursivePlugin>(plugin: T) => T;
declare const hydrate: (target: HTMLElement, options?: Options) => AwaitableInstance;
declare const ink: (target: HTMLElement, options?: Options) => AwaitableInstance;
declare const inkPlugin: <T extends "completion" | "default" | "grammar" | "language">({ key, type, value }: {
    key?: string | undefined;
    type?: T | undefined;
    value: () => PluginValueForType<T>;
}) => Options.Plugin;
declare const plugin: <T extends "completion" | "default" | "grammar" | "language">({ key, type, value }: {
    key?: string | undefined;
    type?: T | undefined;
    value: () => PluginValueForType<T>;
}) => Options.Plugin;
declare const render: (target: HTMLElement, options?: Options) => AwaitableInstance;
declare const renderToString: (options?: Options) => string;
declare const solidPrepareForHydration: () => void;
declare const wrap: (textarea: HTMLTextAreaElement, options?: Options) => AwaitableInstance;

export { type Awaitable, type AwaitableInstance, Editor, type EnumString, Instance, Markup, Options, type OptionsResolved, Values, type VendorCompletion, type VendorExtension, type VendorGrammar, type VendorLanguage, appearanceTypes, ink as default, defineConfig, defineOptions, definePlugin, hydrate, ink, inkPlugin, plugin, pluginTypes, render, renderToString, solidPrepareForHydration, wrap };
