import { ComponentProps } from "react";
import { BreadcrumbOptions } from "fumadocs-core/breadcrumb";
//#region src/layouts/docs/page/slots/breadcrumb.d.ts
type BreadcrumbProps = BreadcrumbOptions & ComponentProps<'div'>;
declare function Breadcrumb({ includeRoot, includeSeparator, includePage, ...props }: BreadcrumbProps): import("react").JSX.Element | null;
//#endregion
export { Breadcrumb, BreadcrumbProps };