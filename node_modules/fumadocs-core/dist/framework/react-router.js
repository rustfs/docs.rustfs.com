import { FrameworkProvider } from "./index.js";
import { useMemo } from "react";
import { jsx } from "react/jsx-runtime";
import { Link, useLocation, useNavigate, useParams, useRevalidator } from "react-router";
//#region src/framework/react-router.tsx
const framework = {
	usePathname() {
		return useLocation().pathname;
	},
	useParams() {
		return useParams();
	},
	useRouter() {
		const navigate = useNavigate();
		const revalidator = useRevalidator();
		return useMemo(() => ({
			push(url) {
				navigate(url);
			},
			refresh() {
				revalidator.revalidate();
			}
		}), [navigate, revalidator]);
	},
	Link({ href, prefetch, ...props }) {
		return /* @__PURE__ */ jsx(Link, {
			to: href,
			prefetch: prefetch ? "intent" : "none",
			...props,
			children: props.children
		});
	}
};
function ReactRouterProvider({ children, Link: CustomLink, Image: CustomImage }) {
	return /* @__PURE__ */ jsx(FrameworkProvider, {
		...framework,
		Link: CustomLink ?? framework.Link,
		Image: CustomImage ?? framework.Image,
		children
	});
}
//#endregion
export { ReactRouterProvider };
