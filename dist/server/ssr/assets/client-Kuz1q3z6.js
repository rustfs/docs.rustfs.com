import { i as __toESM } from "./rolldown-runtime-B4lejLz5.js";
import { n as require_jsx_runtime, t as require_react } from "./react-BKYDRtZ1.js";
import { t as require_react_dom } from "./react-dom-QgUhXYPF.js";
import { r as Slot } from "./client-DtWGx4aQ.js";
//#region node_modules/waku/dist/lib/utils/path.js
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
require_react_dom();
var SLUG_PATTERN = /^(.*?)\[([^\]]+)\](.*)$/;
var parsePathWithSlug = (path) => path.split("/").filter(Boolean).map((name) => {
	const match = SLUG_PATTERN.exec(name);
	if (!match) return {
		type: "literal",
		name
	};
	const [, prefix, inner, suffix] = match;
	if (inner.startsWith("...")) return {
		type: "wildcard",
		name: inner.slice(3)
	};
	return {
		type: "group",
		name: inner,
		...prefix ? { prefix } : {},
		...suffix ? { suffix } : {}
	};
});
var matchSpecSegment = (spec, segment, mapping) => {
	if (spec.type === "literal") return spec.name === segment;
	if (segment === void 0) return false;
	const prefix = spec.prefix ?? "";
	const suffix = spec.suffix ?? "";
	if (prefix || suffix) {
		if (!segment.startsWith(prefix) || !segment.endsWith(suffix)) return false;
		const value = segment.slice(prefix.length, suffix ? -suffix.length : void 0);
		if (!value) return false;
		if (spec.name) mapping[spec.name] = value;
	} else if (spec.name) mapping[spec.name] = segment;
	return true;
};
/**
* Helper function to get the path mapping from the path spec and the pathname.
*
* @param pathSpec
* @param pathname - route as a string
* @example
* getPathMapping(
*   [
*     { type: 'literal', name: 'foo' },
*     { type: 'group', name: 'a' },
*   ],
*   '/foo/bar',
* );
* // => { a: 'bar' }
*/ var getPathMapping = (pathSpec, pathname) => {
	const actual = pathname.split("/").filter(Boolean);
	if (pathSpec.length > actual.length) {
		const wildcardIndex = pathSpec.findIndex((spec) => spec.type === "wildcard");
		if (wildcardIndex === -1) return null;
		if (wildcardIndex === pathSpec.length - 1) {
			if (actual.length > 0) return null;
		} else if (actual.length < pathSpec.length - 1) return null;
	}
	const mapping = {};
	let wildcardStartIndex = -1;
	for (let i = 0; i < pathSpec.length; i++) {
		const spec = pathSpec[i];
		if (spec.type === "wildcard") {
			wildcardStartIndex = i;
			break;
		}
		if (!matchSpecSegment(spec, actual[i], mapping)) return null;
	}
	if (wildcardStartIndex === -1) {
		if (pathSpec.length !== actual.length) return null;
		return mapping;
	}
	if (wildcardStartIndex === 0 && actual.length === 0) {
		const wildcardName = pathSpec[wildcardStartIndex].name;
		if (wildcardName) mapping[wildcardName] = [];
		return mapping;
	}
	let wildcardEndIndex = -1;
	for (let i = 0; i < pathSpec.length; i++) {
		const spec = pathSpec[pathSpec.length - i - 1];
		if (spec.type === "wildcard") {
			wildcardEndIndex = actual.length - i - 1;
			break;
		}
		if (!matchSpecSegment(spec, actual[actual.length - i - 1], mapping)) return null;
	}
	const wildcardName = pathSpec[wildcardStartIndex].name;
	if (wildcardName) mapping[wildcardName] = actual.slice(wildcardStartIndex, wildcardEndIndex + 1);
	return mapping;
};
function removeBase(url, base) {
	if (base !== "/") {
		if (!url.startsWith(base)) throw new Error("pathname must start with basePath: " + url);
		return url.slice(base.length - 1);
	}
	return url;
}
function addBase(url, base) {
	if (base !== "/" && url.startsWith("/")) return base.slice(0, -1) + url;
	return url;
}
//#endregion
//#region node_modules/waku/dist/lib/utils/create-pages.js
/** Remove (group)s from path. Like /(group)/foo => /foo */ var getGrouplessPath = (path) => {
	if (path.includes("(")) {
		const withoutGroups = path.split("/").filter((part) => !part.startsWith("("));
		path = withoutGroups.length > 1 ? withoutGroups.join("/") : "/";
	}
	return path;
};
//#endregion
//#region node_modules/waku/dist/router/isomorphic-utils/build-route-href.js
/**
* Build an href string from a route path, params, search, and hash.
*
* Route groups in the path are removed, path params are URL-encoded, and the
* result is validated against the route matcher; building a pathname that the
* path would not match (e.g. an empty array for a prefixed catch-all) throws.
*/ var buildRouteHref = (target, resolveCodec) => {
	const { to, search, hash, params } = target;
	const pathSpec = parsePathWithSlug(getGrouplessPath(to));
	const segments = [];
	for (const item of pathSpec) if (item.type === "literal") segments.push(item.name);
	else if (item.type === "wildcard") {
		const value = item.name ? params?.[item.name] : void 0;
		if (!Array.isArray(value)) throw new Error(`Missing catch-all param "${item.name}" for "${to}"`);
		for (const part of value) segments.push(encodeURIComponent(part));
	} else {
		const value = item.name ? params?.[item.name] : void 0;
		if (typeof value !== "string") throw new Error(`Missing param "${item.name}" for "${to}"`);
		const prefix = item.prefix ?? "";
		const suffix = item.suffix ?? "";
		segments.push(prefix + encodeURIComponent(value) + suffix);
	}
	const pathname = "/" + segments.join("/");
	if (!getPathMapping(pathSpec, pathname)) throw new Error(`Cannot build "${to}" with the given params`);
	let query = "";
	if (search !== void 0) {
		const codec = resolveCodec?.(to);
		if (!codec) throw new Error(`Cannot serialize "search" for "${to}": no search codec resolved. Provide it via <Unstable_SearchCodecsProvider> in a module rendered on every page (e.g. your root layout) so navigation can serialize it.`);
		query = codec.serialize(search);
	}
	return pathname + (query ? "?" + query : "") + (hash ? "#" + (hash.startsWith("#") ? hash.slice(1) : hash) : "");
};
//#endregion
//#region node_modules/waku/dist/router/isomorphic-utils/route-path.js
function pathnameToRoutePath(pathname) {
	if (!pathname.startsWith("/")) throw new Error("Pathname must start with `/`: " + pathname);
	if (pathname.length > 1 && pathname.endsWith("/")) pathname = pathname.slice(0, -1);
	if (pathname.endsWith("/index.html")) pathname = pathname.slice(0, -11) || "/";
	if (pathname.length > 1 && pathname.endsWith("/")) pathname = pathname.slice(0, -1);
	return pathname || "/";
}
//#endregion
//#region node_modules/waku/dist/router/isomorphic-utils/search-codec-registry.js
/**
* Resolve a route path to its search codec id, using the `route -> codec id`
* map that define-router ships as `globalThis.__WAKU_ROUTER_SEARCH_CODECS__`.
* Lets `push`/`Link` serialize `search` for any route, not just the current one.
*/ var getRouteSearchCodecId = (routePath) => {
	return globalThis.__WAKU_ROUTER_SEARCH_CODECS__?.[routePath];
};
//#endregion
//#region node_modules/waku/dist/router/client.js
var pathnameToCurrentRoutePath = (pathname) => pathnameToRoutePath(removeBase(pathname, "/"));
var parseRoute = (url) => {
	const { pathname, searchParams, hash } = url;
	return {
		path: pathnameToCurrentRoutePath(pathname),
		query: searchParams.toString(),
		hash
	};
};
var shouldScrollByDefault = (url) => pathnameToCurrentRoutePath(url.pathname) !== pathnameToCurrentRoutePath(window.location.pathname) || url.hash !== window.location.hash;
var isAltClick = (event) => event.button !== 0 || !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
var RouterContext = /*#__PURE__*/ (0, import_react.createContext)(null);
var SearchCodecsContext = /*#__PURE__*/ (0, import_react.createContext)(/* @__PURE__ */ new Map());
var useResolveSearchCodec = () => {
	const codecs = (0, import_react.useContext)(SearchCodecsContext);
	return (0, import_react.useCallback)((routePath) => {
		const id = getRouteSearchCodecId(routePath);
		return id !== void 0 ? codecs.get(id) : void 0;
	}, [codecs]);
};
function useRouter() {
	const router = (0, import_react.useContext)(RouterContext);
	if (!router) throw new Error("Missing Router");
	const { route, changeRoute, prefetchRoute } = router;
	const resolveCodec = useResolveSearchCodec();
	const push = (0, import_react.useCallback)(async (to, options) => {
		const href = typeof to === "string" ? to : buildRouteHref(to, resolveCodec);
		const url = new URL(addBase(href, "/"), window.location.href);
		await changeRoute(parseRoute(url), {
			shouldScroll: options?.scroll ?? shouldScrollByDefault(url),
			mode: "push",
			url,
			instant: options?.unstable_instant
		});
	}, [changeRoute, resolveCodec]);
	const replace = (0, import_react.useCallback)(async (to, options) => {
		const href = typeof to === "string" ? to : buildRouteHref(to, resolveCodec);
		const url = new URL(addBase(href, "/"), window.location.href);
		await changeRoute(parseRoute(url), {
			shouldScroll: options?.scroll ?? shouldScrollByDefault(url),
			mode: "replace",
			url,
			instant: options?.unstable_instant
		});
	}, [changeRoute, resolveCodec]);
	const reload = (0, import_react.useCallback)(async () => {
		const url = new URL(window.location.href);
		await changeRoute(parseRoute(url), {
			shouldScroll: true,
			refetch: true
		});
	}, [changeRoute]);
	const back = (0, import_react.useCallback)(() => {
		window.history.back();
	}, []);
	const forward = (0, import_react.useCallback)(() => {
		window.history.forward();
	}, []);
	const prefetch = (0, import_react.useCallback)((to) => {
		const href = typeof to === "string" ? to : buildRouteHref(to, resolveCodec);
		const url = new URL(addBase(href, "/"), window.location.href);
		prefetchRoute(parseRoute(url));
	}, [prefetchRoute, resolveCodec]);
	return {
		...route,
		push,
		replace,
		reload,
		back,
		forward,
		prefetch,
		unstable_events: router.routeChangeEvents
	};
}
function useSharedRef(ref) {
	const managedRef = (0, import_react.useRef)(null);
	return [managedRef, (0, import_react.useCallback)((node) => {
		managedRef.current = node;
		const isRefCallback = typeof ref === "function";
		let cleanup;
		if (isRefCallback) cleanup = ref(node);
		else if (ref) ref.current = node;
		return () => {
			managedRef.current = null;
			if (isRefCallback) if (cleanup) cleanup();
			else ref(null);
			else if (ref) ref.current = null;
		};
	}, [ref])];
}
var NavigationStatusContext = /*#__PURE__*/ (0, import_react.createContext)({});
function Link({ to, children, scroll, unstable_instant, unstable_prefetchOnEnter, unstable_prefetchOnView, unstable_startTransition, ref: refProp, ...props }) {
	const resolveCodec = useResolveSearchCodec();
	const resolvedTo = addBase(typeof to === "string" ? to : buildRouteHref(to, resolveCodec), "/");
	const router = (0, import_react.useContext)(RouterContext);
	const changeRoute = router ? router.changeRoute : () => {
		throw new Error("Missing Router");
	};
	const prefetchRoute = router ? router.prefetchRoute : () => {
		throw new Error("Missing Router");
	};
	const [isPending, startTransition] = (0, import_react.useTransition)();
	const startTransitionFn = unstable_startTransition || startTransition;
	const [ref, setRef] = useSharedRef(refProp);
	(0, import_react.useEffect)(() => {
		if (!unstable_prefetchOnView || !ref.current) return;
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const url = new URL(resolvedTo, window.location.href);
					if (router && url.href !== window.location.href) router.prefetchRoute(parseRoute(url));
				}
			});
		}, { threshold: .1 });
		observer.observe(ref.current);
		return () => {
			observer.disconnect();
		};
	}, [
		unstable_prefetchOnView,
		router,
		resolvedTo,
		ref
	]);
	const internalOnClick = () => {
		const url = new URL(resolvedTo, window.location.href);
		if (url.href !== window.location.href) {
			const route = parseRoute(url);
			prefetchRoute(route);
			if (unstable_instant) changeRoute(route, {
				shouldScroll: scroll ?? shouldScrollByDefault(url),
				mode: "push",
				url,
				instant: true
			}).catch(() => {});
			else startTransitionFn(async () => {
				await changeRoute(route, {
					shouldScroll: scroll ?? shouldScrollByDefault(url),
					mode: "push",
					url,
					startTransition: startTransitionFn
				});
			});
		} else if (url.hash && scroll !== false) scrollToRoute(parseRoute(url), "auto", false);
	};
	const onClick = (event) => {
		props.onClick?.(event);
		if (event.defaultPrevented || isAltClick(event)) return;
		if (props.target && props.target.toLowerCase() !== "_self") console.warn("[Link] `target` is discouraged. Use `<a>` for this case.");
		if (props.download !== void 0 && props.download !== null && props.download !== false) console.warn("[Link] `download` is discouraged. Use `<a>` for this case.");
		event.preventDefault();
		internalOnClick();
	};
	const onMouseEnter = unstable_prefetchOnEnter ? (event) => {
		const url = new URL(resolvedTo, window.location.href);
		if (url.href !== window.location.href) prefetchRoute(parseRoute(url));
		props.onMouseEnter?.(event);
	} : props.onMouseEnter;
	const navigationStatus = (0, import_react.useMemo)(() => ({ pending: isPending }), [isPending]);
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(NavigationStatusContext, {
		value: navigationStatus,
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("a", {
			...props,
			href: resolvedTo,
			onClick,
			onMouseEnter,
			ref: setRef,
			children
		})
	});
}
var notAvailableInServer = (name) => () => {
	throw new Error(`${name} is not in the server`);
};
function renderError(message) {
	return /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("html", { children: [/*#__PURE__*/ (0, import_jsx_runtime.jsx)("head", { children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("title", { children: "Unhandled Error" }) }), /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("body", {
		style: {
			height: "100vh",
			display: "flex",
			flexDirection: "column",
			placeContent: "center",
			placeItems: "center",
			fontSize: "16px",
			margin: 0
		},
		children: [/*#__PURE__*/ (0, import_jsx_runtime.jsx)("h1", { children: "Caught an unexpected error" }), /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("p", { children: ["Error: ", message] })]
	})] });
}
var ErrorBoundary = class extends import_react.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	static getDerivedStateFromError(error) {
		return { error };
	}
	render() {
		if ("error" in this.state) {
			if (this.state.error instanceof Error) return renderError(this.state.error.message);
			return renderError(String(this.state.error));
		}
		return this.props.children;
	}
};
var getRouteSlotId = (path) => "route:" + path;
var getHashElement = (hash) => {
	const raw = hash.slice(1);
	const rawElement = document.getElementById(raw);
	if (rawElement) return rawElement;
	try {
		return document.getElementById(decodeURIComponent(raw));
	} catch {
		return null;
	}
};
var scrollToRoute = (route, behavior, scrollTopForMissingHash) => {
	if (route.hash) {
		const element = getHashElement(route.hash);
		if (!element) {
			if (!scrollTopForMissingHash) return;
			window.scrollTo({
				left: 0,
				top: 0,
				behavior
			});
			return;
		}
		const scrollMarginTop = Number.parseFloat(window.getComputedStyle(element).scrollMarginTop) || 0;
		window.scrollTo({
			left: 0,
			top: element.getBoundingClientRect().top + window.scrollY - scrollMarginTop,
			behavior
		});
		return;
	}
	window.scrollTo({
		left: 0,
		top: 0,
		behavior
	});
};
var MOCK_ROUTE_CHANGE_LISTENER = {
	on: () => notAvailableInServer("routeChange:on"),
	off: () => notAvailableInServer("routeChange:off")
};
/**
* ServerRouter for SSR
* This is not a public API.
*/ function INTERNAL_ServerRouter({ route }) {
	const rootElement = /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Slot, {
		id: "root",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slot, { id: getRouteSlotId(route.path) })
	});
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(RouterContext, {
		value: {
			route,
			changeRoute: notAvailableInServer("changeRoute"),
			prefetchRoute: notAvailableInServer("prefetchRoute"),
			routeChangeEvents: MOCK_ROUTE_CHANGE_LISTENER,
			fetchingSlices: /* @__PURE__ */ new Set()
		},
		children: rootElement
	}) });
}
//#endregion
export { useRouter as i, INTERNAL_ServerRouter as n, Link as r, ErrorBoundary as t };
