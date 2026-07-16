import { ComponentProps, ReactNode, RefObject } from "react";
//#region src/toc.d.ts
interface TOCItemType {
  title: ReactNode;
  url: string;
  depth: number;
  /** [remark-steps] the step number */
  _step?: number;
}
type TableOfContents = TOCItemType[];
interface TOCItemInfo {
  id: string;
  active: boolean;
  /** last time the item is updated */
  t: number;
  /** currently active but not intersecting in viewport */
  fallback: boolean;
  original: TOCItemType;
}
interface AnchorProviderProps {
  toc: TOCItemType[];
  /**
   * Only accept one active item at most
   *
   * @defaultValue false
   */
  single?: boolean;
  children?: ReactNode;
}
interface ScrollProviderProps {
  /**
   * Scroll into the view of container when active
   */
  containerRef: RefObject<HTMLElement | null>;
  children?: ReactNode;
}
/** Optional: add auto-scroll to TOC items. */
declare function ScrollProvider({ containerRef, children }: ScrollProviderProps): import("react").JSX.Element;
declare function AnchorProvider({ toc, single, children }: AnchorProviderProps): import("react").JSX.Element;
interface TOCItemProps extends ComponentProps<'a'> {
  onActiveChange?: (v: boolean) => void;
}
declare function TOCItem({ ref, onActiveChange, ...props }: TOCItemProps): import("react").JSX.Element;
/** @returns static info object, useful for custom rendering logic */
declare function useTOC(): {
  get(): TOCItemInfo[];
  listen: (listener: ChangeListener) => void;
  unlisten: (listener: ChangeListener) => void;
};
declare function useTOCListener(listener: ChangeListener): void;
declare function useTOCSelector<T>(select: (items: TOCItemInfo[]) => T, isEqual?: (a: T, b: T) => boolean): T;
/**
 * The estimated active heading ID
 */
declare function useActiveAnchor(): string | undefined;
/**
 * The id of visible anchors
 */
declare function useActiveAnchors(): string[];
declare function useItems(): TOCItemInfo[];
type ChangeListener = (items: TOCItemInfo[]) => void;
//#endregion
export { TOCItem as a, TOCItemType as c, useActiveAnchors as d, useItems as f, useTOCSelector as h, ScrollProviderProps as i, TableOfContents as l, useTOCListener as m, AnchorProviderProps as n, TOCItemInfo as o, useTOC as p, ScrollProvider as r, TOCItemProps as s, AnchorProvider as t, useActiveAnchor as u };