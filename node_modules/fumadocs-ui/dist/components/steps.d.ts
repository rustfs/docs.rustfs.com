import { ReactNode } from "react";
//#region src/components/steps.d.ts
declare function Steps({ children }: {
  children: ReactNode;
}): import("react").JSX.Element;
declare function Step({ children }: {
  children: ReactNode;
}): import("react").JSX.Element;
//#endregion
export { Step, Steps };