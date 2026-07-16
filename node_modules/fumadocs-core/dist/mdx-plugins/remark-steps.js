import { r as handleTag } from "../utils-Yx0IL9eW.js";
import { visit } from "unist-util-visit";
//#region src/mdx-plugins/remark-steps.ts
const StepRegex = /^(\d+)\.\s(.+)$/;
const StepTag = "[step]";
/**
* Convert headings in the format of `1. Hello World` into steps.
*/
function remarkSteps({ steps = "fd-steps", step = "fd-step" } = {}) {
	function convertToSteps(nodes) {
		const depth = nodes[0].depth;
		const children = [];
		for (const node of nodes) if (node.type === "heading" && node.depth === depth) children.push({
			type: "mdxJsxFlowElement",
			name: "div",
			attributes: [{
				type: "mdxJsxAttribute",
				name: "className",
				value: step
			}],
			children: [node]
		});
		else children[children.length - 1].children.push(node);
		return {
			type: "mdxJsxFlowElement",
			name: "div",
			attributes: [{
				type: "mdxJsxAttribute",
				name: "className",
				value: steps
			}],
			children
		};
	}
	function handleHeadingStep(node) {
		const head = node.children[0];
		if (head && head.type === "text") {
			const match = StepRegex.exec(head.value);
			if (match) {
				head.value = match[2];
				return true;
			}
		}
		const tail = node.children[node.children.length - 1];
		if (tail && tail.type === "text") {
			const step = handleTag(tail.value, StepTag);
			if (step !== false) {
				tail.value = step;
				return true;
			}
		}
		return false;
	}
	return (tree) => {
		visit(tree, (parent) => {
			if (!("children" in parent) || parent.type === "heading") return "skip";
			let startIdx = -1;
			let i = 0;
			let currentStep = 1;
			const onEnd = () => {
				if (startIdx === -1) return;
				const item = {};
				const nodes = parent.children.splice(startIdx, i - startIdx, item);
				Object.assign(item, convertToSteps(nodes));
				i = startIdx + 1;
				startIdx = -1;
				currentStep = 1;
			};
			for (; i < parent.children.length; i++) {
				const node = parent.children[i];
				if (node.type !== "heading" || node.data?.hProperties?.["data-fd-step"] !== void 0) continue;
				if (startIdx !== -1) {
					const startDepth = parent.children[startIdx].depth;
					if (node.depth !== startDepth) {
						if (node.depth < startDepth) onEnd();
						continue;
					}
				}
				if (!handleHeadingStep(node)) {
					onEnd();
					continue;
				}
				node.data ??= {};
				node.data.hProperties ??= {};
				node.data.hProperties["data-fd-step"] = currentStep++;
				if (startIdx === -1) startIdx = i;
			}
			onEnd();
		});
	};
}
//#endregion
export { remarkSteps };
