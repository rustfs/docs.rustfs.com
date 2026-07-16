import { cn } from "./utils/cn.js";
import { Card, Cards } from "./components/card.js";
import { Callout, CalloutContainer, CalloutDescription, CalloutTitle } from "./components/callout.js";
import { Heading } from "./components/heading.js";
import { CodeBlock, CodeBlockTab, CodeBlockTabs, CodeBlockTabsList, CodeBlockTabsTrigger, Pre } from "./components/codeblock.js";
import Link from "fumadocs-core/link";
import { Image } from "fumadocs-core/framework";
import { jsx } from "react/jsx-runtime";
//#region src/mdx.tsx
function Image$1(props) {
	return /* @__PURE__ */ jsx(Image, {
		sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 900px",
		...props,
		className: cn("rounded-lg", props.className)
	});
}
function Table(props) {
	return /* @__PURE__ */ jsx("div", {
		className: "relative overflow-auto prose-no-margin my-6",
		children: /* @__PURE__ */ jsx("table", { ...props })
	});
}
const defaultMdxComponents = {
	CodeBlockTab,
	CodeBlockTabs,
	CodeBlockTabsList,
	CodeBlockTabsTrigger,
	pre: (props) => /* @__PURE__ */ jsx(CodeBlock, {
		...props,
		children: /* @__PURE__ */ jsx(Pre, { children: props.children })
	}),
	Card,
	Cards,
	a: Link,
	img: Image$1,
	h1: (props) => /* @__PURE__ */ jsx(Heading, {
		as: "h1",
		...props
	}),
	h2: (props) => /* @__PURE__ */ jsx(Heading, {
		as: "h2",
		...props
	}),
	h3: (props) => /* @__PURE__ */ jsx(Heading, {
		as: "h3",
		...props
	}),
	h4: (props) => /* @__PURE__ */ jsx(Heading, {
		as: "h4",
		...props
	}),
	h5: (props) => /* @__PURE__ */ jsx(Heading, {
		as: "h5",
		...props
	}),
	h6: (props) => /* @__PURE__ */ jsx(Heading, {
		as: "h6",
		...props
	}),
	table: Table,
	Callout,
	CalloutContainer,
	CalloutTitle,
	CalloutDescription
};
const createRelativeLink = () => {
	throw new Error("`createRelativeLink` is only supported in Node.js environment");
};
//#endregion
export { createRelativeLink, defaultMdxComponents as default };
