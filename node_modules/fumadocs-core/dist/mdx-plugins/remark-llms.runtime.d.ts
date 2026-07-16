import { t as Awaitable } from "../types-D89QoQR-.js";
//#region src/mdx-plugins/remark-llms.runtime.d.ts
interface PlaceholderData {
  name: string | null;
  attributes: Record<string, unknown>;
  children: string;
}
declare function renderPlaceholder(text: string, renderers: Record<string, (data: PlaceholderData) => Awaitable<string>>): Promise<string>;
//#endregion
export { PlaceholderData, renderPlaceholder };