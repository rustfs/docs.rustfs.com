import { buttonVariants } from "../../../components/ui/button.js";
import { VariantProps } from "class-variance-authority";
import { ComponentProps } from "react";
//#region src/layouts/shared/slots/language-select.d.ts
interface LanguageSelectProps extends ComponentProps<'button'> {
  variant?: VariantProps<typeof buttonVariants>['variant'];
}
declare function LanguageSelect({ className, variant, children, ...rest }: LanguageSelectProps): React.ReactElement;
type LanguageSelectTextProps = ComponentProps<'span'>;
declare function LanguageSelectText(props: LanguageSelectTextProps): import("react").JSX.Element;
//#endregion
export { LanguageSelect, LanguageSelectProps, LanguageSelectText, LanguageSelectTextProps };