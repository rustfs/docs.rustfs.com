"use client";
import { FrameworkProvider } from "./index.js";
import { useMemo } from "react";
import { jsx } from "react/jsx-runtime";
//#region src/framework/astro.tsx
function normalizeParams(params = {}) {
	const out = {};
	for (const [key, value] of Object.entries(params)) if (value !== void 0) out[key] = value;
	return out;
}
/**
* Fumadocs adapter for Astro with React islands.
*
* Pass `pathname` and `params` from `Astro.url.pathname` and `Astro.params`.
* You can pass `navigate` from `astro:transitions/client` to preserve client navigation.
*/
function AstroProvider({ children, pathname, params, navigate, Link, Image }) {
	const resolvedParams = useMemo(() => normalizeParams(params), [params]);
	return /* @__PURE__ */ jsx(FrameworkProvider, {
		...useMemo(() => ({
			usePathname() {
				return pathname;
			},
			useParams() {
				return resolvedParams;
			},
			useRouter() {
				return {
					push(url) {
						if (navigate) return navigate(url);
						window.location.assign(url);
					},
					refresh() {
						window.location.reload();
					}
				};
			},
			Link,
			Image
		}), [
			Image,
			Link,
			navigate,
			pathname,
			resolvedParams
		]),
		children
	});
}
//#endregion
export { AstroProvider };
