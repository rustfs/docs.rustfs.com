import { ButtonProps } from "../../../components/ui/button.js";
import { ComponentProps } from "react";
//#region src/layouts/shared/slots/search-trigger.d.ts
interface SearchTriggerProps extends Omit<ComponentProps<'button'>, 'color'>, ButtonProps {
  hideIfDisabled?: boolean;
}
declare function SearchTrigger({ hideIfDisabled, size, color, ...props }: SearchTriggerProps): import("react").JSX.Element | null;
interface FullSearchTriggerProps extends ComponentProps<'button'> {
  hideIfDisabled?: boolean;
}
declare function FullSearchTrigger({ hideIfDisabled, ...props }: FullSearchTriggerProps): import("react").JSX.Element | null;
//#endregion
export { FullSearchTrigger, FullSearchTriggerProps, SearchTrigger, SearchTriggerProps };