import { jsx } from "react/jsx-runtime";
//#region src/components/steps.tsx
function Steps({ children }) {
	return /* @__PURE__ */ jsx("div", {
		className: "fd-steps",
		children
	});
}
function Step({ children }) {
	return /* @__PURE__ */ jsx("div", {
		className: "fd-step",
		children
	});
}
//#endregion
export { Step, Steps };
