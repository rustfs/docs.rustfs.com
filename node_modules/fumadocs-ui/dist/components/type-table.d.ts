import { ComponentProps, ReactNode } from "react";
//#region src/components/type-table.d.ts
interface ParameterNode {
  name: string;
  description: ReactNode;
}
interface TypeNode {
  /**
   * Additional description of the field
   */
  description?: ReactNode;
  /**
   * type signature (short)
   */
  type: ReactNode;
  /**
   * type signature (full)
   */
  typeDescription?: ReactNode;
  /**
   * Optional `href` for the type
   */
  typeDescriptionLink?: string;
  default?: ReactNode;
  required?: boolean;
  deprecated?: boolean;
  /**
   * a list of parameters info if the type is a function.
   */
  parameters?: ParameterNode[];
  returns?: ReactNode;
}
declare function TypeTable({ id, type, className, ...props }: {
  type: Record<string, TypeNode>;
} & ComponentProps<'div'>): import("react").JSX.Element;
//#endregion
export { ParameterNode, TypeNode, TypeTable };