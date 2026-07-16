import { ReactElement, ReactNode } from "react";

//#region src/index.d.ts
/** add translations, you can stack multiple <TranslationProvider /> to override/extend translations */
declare function TranslationProvider({
  translations,
  children
}: {
  translations: Partial<Record<string, string>>;
  children: ReactNode;
}): import("react").JSX.Element;
type GetVariables<T extends string> = T extends `${infer Before}{${infer K}}${infer After}` ? (Before extends `${string}\\` ? never : K) | GetVariables<After> : never;
type GetTags<T extends string> = T extends `${infer Before}<${infer K}>${infer After}` ? (Before extends `${string}\\` ? never : K extends `/${string}` ? never : K extends `${infer Tag}/` ? Tag : K) | GetTags<After> : never;
interface HookOptions {
  /** provide additional context to all t() calls */
  note?: string;
}
interface TranslationsHook {
  translations: Partial<Record<string, string>>;
  <Text extends string>(text: Text, opts?: {
    /**
     * add more context to `text`.
     * @example "The aria-label of close dialog button"
     */
    note?: string;
    variables?: Record<GetVariables<Text>, string>;
  }): string;
  jsx<Text extends string>(text: Text, opts?: {
    /**
     * add more context to `text`.
     * @example "The aria-label of close dialog button"
     */
    note?: string;
    variables?: Record<GetVariables<Text>, ReactNode>;
    tags?: Record<GetTags<Text>, TagRenderer>;
  }): ReactNode;
}
declare function useTranslations({
  note
}?: HookOptions): TranslationsHook;
/** create a translation function from a translations object (e.g. outside React) */
declare function fromTranslations(translations: Partial<Record<string, string>>, {
  note: hookNote
}?: HookOptions): TranslationsHook;
interface TProps<Text extends string> {
  text: Text;
  /**
   * add more context to `text`.
   * @example "The aria-label of close dialog button"
   */
  note?: string;
  variables?: Record<GetVariables<Text>, ReactNode>;
  tags?: Record<GetTags<Text>, TagRenderer>;
}
declare function T<const Text extends string>({
  text,
  note,
  variables,
  tags
}: TProps<Text>): ReactNode;
/** render tags, also allows React elements like `<a href="/xxx" />` for RSC usages */
type TagRenderer = ReactElement | ((children: ReactNode) => ReactNode);
//#endregion
export { T, TranslationProvider, TranslationsHook, fromTranslations, useTranslations };
//# sourceMappingURL=index.d.mts.map