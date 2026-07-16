//#region src/clsx.d.ts
interface ClassDictionary {
  [className: string]: any;
}
type ClassValue = string | number | bigint | boolean | null | undefined | ClassValue[] | ClassDictionary;
declare const clsx: (...inputs: ClassValue[]) => string;
//#endregion
//#region src/lib/tw-join.d.ts
/**
 * The code in this file is copied from https://github.com/lukeed/clsx and modified to suit the needs of tailwind-merge better.
 *
 * Specifically:
 * - Runtime code from https://github.com/lukeed/clsx/blob/v1.2.1/src/index.js
 * - TypeScript types from https://github.com/lukeed/clsx/blob/v1.2.1/clsx.d.ts
 *
 * Original code has MIT license: Copyright (c) Luke Edwards <luke.edwards05@gmail.com> (lukeed.com)
 */
type ClassNameValue = ClassNameArray | string | null | undefined | 0 | 0n | false;
type ClassNameArray = readonly ClassNameValue[];
declare const twJoin: (...classLists: ClassNameValue[]) => string;
//#endregion
//#region src/lib/create-tailwind-merge.d.ts
interface TailwindMerge {
  (...classLists: ClassNameValue[]): string;
  /**
   * Merge an already-joined, space-separated class string, skipping the `twJoin` pass.
   * Used by `cn`, whose `clsx` step already produces a single string.
   */
  mergeString(classList: string): string;
}
//#endregion
//#region src/lib/tw-merge.d.ts
declare const twMerge: TailwindMerge;
//#endregion
//#region src/index.d.ts
interface ClassNameFunction {
  /** Tagged-template form: ``cn`px-2 ${active && "bg-blue-500"}` `` — identity-cached per call site. */
  (strings: TemplateStringsArray, ...values: ClassValue[]): string;
  /** Standard variadic form: `cn("px-2", active && "bg-blue-500")`. */
  (...inputs: ClassValue[]): string;
}
declare const cn: ClassNameFunction;
//#endregion
export { type ClassDictionary, ClassNameFunction, type ClassNameValue, type ClassValue, clsx, cn, cn as default, twJoin, twMerge };