import { Transformer } from "unified";
import { Root } from "mdast";
//#region src/mdx-plugins/remark-steps.d.ts
interface RemarkStepsOptions {
  /**
   * Class name for steps container
   *
   * @defaultValue fd-steps
   */
  steps?: string;
  /**
   * Class name for step container
   *
   * @defaultValue fd-step
   */
  step?: string;
}
/**
 * Convert headings in the format of `1. Hello World` into steps.
 */
declare function remarkSteps({ steps, step }?: RemarkStepsOptions): Transformer<Root, Root>;
//#endregion
export { remarkSteps as n, RemarkStepsOptions as t };