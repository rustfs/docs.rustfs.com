import { HTMLAttributes, ReactNode } from "react";
//#region src/components/card.d.ts
declare function Cards(props: HTMLAttributes<HTMLDivElement>): import("react").JSX.Element;
type CardProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  href?: string;
  external?: boolean;
};
declare function Card({ icon, title, description, ...props }: CardProps): import("react").JSX.Element;
//#endregion
export { Card, CardProps, Cards };