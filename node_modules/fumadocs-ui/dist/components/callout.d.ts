import { ComponentProps, ReactNode } from "react";
//#region src/components/callout.d.ts
type CalloutType = 'info' | 'warn' | 'error' | 'success' | 'warning' | 'idea';
declare function Callout({ children, title, ...props }: {
  title?: ReactNode;
} & Omit<CalloutContainerProps, 'title'>): import("react").JSX.Element;
interface CalloutContainerProps extends ComponentProps<'div'> {
  /**
   * @defaultValue info
   */
  type?: CalloutType;
  /**
   * Force an icon
   */
  icon?: ReactNode;
}
declare function CalloutContainer({ type: inputType, icon, children, className, style, ...props }: CalloutContainerProps): import("react").JSX.Element;
declare function CalloutTitle({ children, className, ...props }: ComponentProps<'p'>): import("react").JSX.Element;
declare function CalloutDescription({ children, className, ...props }: ComponentProps<'p'>): import("react").JSX.Element;
//#endregion
export { Callout, CalloutContainer, CalloutContainerProps, CalloutDescription, CalloutTitle, CalloutType };