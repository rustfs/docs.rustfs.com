"use client";
import { createContext, use, useMemo } from "react";
import { jsx } from "react/jsx-runtime";
//#region src/framework/index.tsx
const notImplemented = () => {
	throw new Error("You need to wrap your application inside `FrameworkProvider`.");
};
const FrameworkContext = createContext({
	useParams: notImplemented,
	useRouter: notImplemented,
	usePathname: notImplemented
});
function FrameworkProvider({ Link, useRouter, useParams, usePathname, Image, children }) {
	const framework = useMemo(() => ({
		usePathname,
		useRouter,
		Link,
		Image,
		useParams
	}), [
		Link,
		usePathname,
		useRouter,
		useParams,
		Image
	]);
	return /* @__PURE__ */ jsx(FrameworkContext, {
		value: framework,
		children
	});
}
function usePathname() {
	return use(FrameworkContext).usePathname();
}
function useRouter() {
	return use(FrameworkContext).useRouter();
}
function useParams() {
	return use(FrameworkContext).useParams();
}
function Image(props) {
	const { Image } = use(FrameworkContext);
	if (!Image) {
		const { src, alt, priority, ...rest } = props;
		return /* @__PURE__ */ jsx("img", {
			alt,
			src,
			fetchPriority: priority ? "high" : "auto",
			...rest
		});
	}
	return /* @__PURE__ */ jsx(Image, { ...props });
}
function Link(props) {
	const { Link } = use(FrameworkContext);
	if (!Link) {
		const { href, prefetch: _, ...rest } = props;
		return /* @__PURE__ */ jsx("a", {
			href,
			...rest
		});
	}
	return /* @__PURE__ */ jsx(Link, { ...props });
}
//#endregion
export { FrameworkProvider, Image, Link, useParams, usePathname, useRouter };
