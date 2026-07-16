import { ComponentProps } from "react";
import * as Primitive from "fumadocs-core/toc";
//#region src/components/toc/default.d.ts
interface TOCItemsProps extends ComponentProps<'div'> {
  thumbBox?: boolean;
}
declare function TOCItems({ ref, className, thumbBox, children, ...props }: TOCItemsProps): import("react").JSX.Element;
declare function TOCEmpty(): import("react").JSX.Element;
declare function TOCItem({ item, ...props }: Primitive.TOCItemProps & {
  item: Primitive.TOCItemType;
}): import("react").JSX.Element;
//#endregion
export { TOCEmpty, TOCItem, TOCItems, TOCItemsProps };