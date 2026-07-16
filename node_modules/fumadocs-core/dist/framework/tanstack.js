import { FrameworkProvider } from "./index.js";
import { useMemo, useRef } from "react";
import { jsx } from "react/jsx-runtime";
import { Link, useParams, useRouter, useRouterState } from "@tanstack/react-router";
//#region src/framework/tanstack.tsx
const framework = {
	Link({ href, prefetch = true, ...props }) {
		return /* @__PURE__ */ jsx(Link, {
			to: href,
			preload: prefetch ? "intent" : false,
			...props,
			children: props.children
		});
	},
	usePathname() {
		const { isLoading, pathname } = useRouterState({ select: (state) => ({
			isLoading: state.isLoading,
			pathname: state.location.pathname
		}) });
		const activePathname = useRef(pathname);
		return useMemo(() => {
			if (isLoading) return activePathname.current;
			activePathname.current = pathname;
			return pathname;
		}, [isLoading, pathname]);
	},
	useRouter() {
		const router = useRouter();
		return useMemo(() => ({
			push(url) {
				router.navigate({ href: url });
			},
			refresh() {
				router.invalidate();
			}
		}), [router]);
	},
	useParams() {
		return useParams({ strict: false });
	}
};
/**
* Fumadocs adapter for Tanstack Router/Start
*/
function TanstackProvider({ children, Link: CustomLink, Image: CustomImage }) {
	return /* @__PURE__ */ jsx(FrameworkProvider, {
		...framework,
		Link: CustomLink ?? framework.Link,
		Image: CustomImage ?? framework.Image,
		children
	});
}
//#endregion
export { TanstackProvider };
