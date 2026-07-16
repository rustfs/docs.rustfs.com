"use client";
import { FrameworkProvider } from "./index.js";
import { useMemo, useRef } from "react";
import { jsx } from "react/jsx-runtime";
import { Link, useRouter } from "waku/router/client";
//#region src/framework/waku.tsx
const framework = {
	usePathname() {
		return useRouter().path;
	},
	useParams() {
		console.warn("[Fumadocs] useParams() is not supported on Waku");
		return useMemo(() => ({}), []);
	},
	useRouter() {
		const router = useRouter();
		const routerRef = useRef(router);
		routerRef.current = router;
		return useMemo(() => ({
			push(url) {
				return routerRef.current.push(url);
			},
			refresh() {
				return routerRef.current.reload();
			}
		}), []);
	},
	Link({ href, prefetch = true, ...props }) {
		return /* @__PURE__ */ jsx(Link, {
			to: href,
			unstable_prefetchOnEnter: prefetch,
			...props,
			children: props.children
		});
	}
};
function WakuProvider({ children, Link: CustomLink, Image: CustomImage }) {
	return /* @__PURE__ */ jsx(FrameworkProvider, {
		...framework,
		Link: CustomLink ?? framework.Link,
		Image: CustomImage ?? framework.Image,
		children
	});
}
//#endregion
export { WakuProvider };
