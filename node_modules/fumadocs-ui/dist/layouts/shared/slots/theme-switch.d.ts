import { ComponentProps } from "react";
//#region src/layouts/shared/slots/theme-switch.d.ts
interface ThemeSwitchProps extends ComponentProps<'div'> {
  mode?: 'light-dark' | 'light-dark-system';
}
declare function ThemeSwitch({ className, mode, ...props }: ThemeSwitchProps): import("react").JSX.Element;
//#endregion
export { ThemeSwitch, ThemeSwitchProps };