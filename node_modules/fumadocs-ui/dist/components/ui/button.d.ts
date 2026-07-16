import { VariantProps } from "class-variance-authority";
//#region src/components/ui/button.d.ts
declare const buttonVariants: (props?: ({
  variant?: "primary" | "outline" | "ghost" | "secondary" | null | undefined;
  color?: "primary" | "outline" | "ghost" | "secondary" | null | undefined;
  size?: "icon" | "sm" | "icon-sm" | "icon-xs" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
type ButtonProps = VariantProps<typeof buttonVariants>;
//#endregion
export { ButtonProps, buttonVariants };