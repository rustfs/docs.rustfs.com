import { MouseEventHandler } from "react";
//#region src/utils/use-copy-button.d.ts
declare function useCopyButton(onCopy: () => void | Promise<void>): [checked: boolean, onClick: MouseEventHandler];
//#endregion
export { useCopyButton };