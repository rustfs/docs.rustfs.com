import { ComponentProps } from "react";
import * as Primitive from "fumadocs-core/toc";
//#region src/components/toc/index.d.ts
declare function useTOCItems(): Primitive.TOCItemType[];
type TOCProviderProps = Primitive.AnchorProviderProps;
declare const useActiveAnchor: typeof Primitive.useActiveAnchor, useActiveAnchors: typeof Primitive.useActiveAnchors, useItems: typeof Primitive.useItems;
declare function TOCProvider({ toc, children, ...props }: TOCProviderProps): import("react").JSX.Element;
declare function TOCScrollArea({ ref, className, ...props }: ComponentProps<'div'>): import("react").JSX.Element;
//#endregion
export { TOCProvider, TOCProviderProps, TOCScrollArea, useActiveAnchor, useActiveAnchors, useItems, useTOCItems };