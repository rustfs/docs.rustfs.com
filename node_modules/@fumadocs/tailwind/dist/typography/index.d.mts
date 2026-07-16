import plugin from "tailwindcss/plugin";
//#region src/typography/index.d.ts
interface Options {
  className?: string;
  /**
   * Disable custom table styles
   */
  disableRoundedTable?: boolean;
}
declare const typography: ReturnType<typeof plugin.withOptions<Options>>;
//#endregion
export { Options, typography as default, typography };