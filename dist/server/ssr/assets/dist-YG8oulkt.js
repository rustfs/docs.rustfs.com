import { i as __toESM } from "./rolldown-runtime-B4lejLz5.js";
import { n as require_jsx_runtime, t as require_react } from "./react-BKYDRtZ1.js";
import { K as createChangeEventDetails, Z as imperativeAction, r as DialogStore } from "./i18n-CTt7SIKf.js";
//#region node_modules/@base-ui/react/dialog/store/DialogHandle.mjs
/**
* A handle to control a Dialog imperatively and to associate detached triggers with it.
*/
var DialogHandle = class {
	/**
	* Internal store holding the dialog state.
	* @internal
	*/
	constructor(store) {
		this.store = store ?? new DialogStore();
	}
	/**
	* Opens the dialog and associates it with the trigger with the given id.
	* The trigger, if provided, must be a matching Trigger component with this handle passed as a prop.
	*
	* This method should only be called in an event handler or an effect (not during rendering).
	*
	* @param triggerId ID of the trigger to associate with the dialog. If null, the dialog will open without a trigger association.
	*/
	open(triggerId) {
		const triggerElement = triggerId ? this.store.context.triggerElements.getById(triggerId) : void 0;
		this.store.setOpen(true, createChangeEventDetails(imperativeAction, void 0, triggerElement));
	}
	/**
	* Opens the dialog and sets the payload.
	* Does not associate the dialog with any trigger.
	*
	* @param payload Payload to set when opening the dialog.
	*/
	openWithPayload(payload) {
		this.store.set("payload", payload);
		this.store.setOpen(true, createChangeEventDetails(imperativeAction, void 0, void 0));
	}
	/**
	* Closes the dialog.
	*/
	close() {
		this.store.setOpen(false, createChangeEventDetails(imperativeAction, void 0, void 0));
	}
	/**
	* Indicates whether the dialog is currently open.
	*/
	get isOpen() {
		return this.store.select("open");
	}
};
/**
* Creates a new handle to connect a Dialog.Root with detached Dialog.Trigger components.
*/
function createDialogHandle() {
	return new DialogHandle();
}
//#endregion
//#region node_modules/@base-ui/react/internals/direction-context/DirectionContext.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/**
* @internal
*/
var DirectionContext = /*#__PURE__*/ import_react.createContext(void 0);
function useDirection() {
	return import_react.useContext(DirectionContext)?.direction ?? "ltr";
}
//#endregion
//#region node_modules/fumadocs-ui/dist/contexts/search.js
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
/** built-in Base UI Dialog handle */
var dialogHandle = createDialogHandle();
var SearchContext = (0, import_react.createContext)({
	enabled: false,
	open: false,
	hotKey: [],
	setOpenSearch: () => void 0,
	dialogHandle
});
function useSearchContext() {
	return (0, import_react.use)(SearchContext);
}
function MetaOrControl() {
	const [key, setKey] = (0, import_react.useState)("⌘");
	(0, import_react.useEffect)(() => {
		if (/Windows|Linux/i.test(window.navigator.userAgent)) setKey("Ctrl");
	}, []);
	return key;
}
var DEFAULT_HOT_KEYS = [{
	key: (e) => e.metaKey || e.ctrlKey,
	display: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaOrControl, {})
}, {
	key: "k",
	display: "K"
}];
var DefaultSearchDialog = (0, import_react.lazy)(() => import("./search-default-C4jxuvT0.js"));
function SearchProvider({ SearchDialog = DefaultSearchDialog, children, options, hotKey = DEFAULT_HOT_KEYS, links }) {
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const onKeyDown = (0, import_react.useEffectEvent)((e) => {
		if (hotKey.every((v) => typeof v.key === "string" ? e.key === v.key : v.key(e))) {
			setIsOpen((open) => !open);
			e.preventDefault();
		}
	});
	(0, import_react.useEffect)(() => {
		window.addEventListener("keydown", onKeyDown);
		return () => {
			window.removeEventListener("keydown", onKeyDown);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SearchContext, {
		value: (0, import_react.useMemo)(() => ({
			enabled: true,
			open: isOpen,
			hotKey,
			dialogHandle,
			setOpenSearch: setIsOpen
		}), [isOpen, hotKey]),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
			fallback: null,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchDialog, {
				open: isOpen,
				onOpenChange: setIsOpen,
				links,
				dialogHandle,
				...options
			})
		}), children]
	});
}
//#endregion
//#region node_modules/next-themes/dist/index.mjs
var M = (e, i, s, u, m, a, l, h) => {
	let d = document.documentElement, w = ["light", "dark"];
	function p(n) {
		(Array.isArray(e) ? e : [e]).forEach((y) => {
			let k = y === "class", S = k && a ? m.map((f) => a[f] || f) : m;
			k ? (d.classList.remove(...S), d.classList.add(a && a[n] ? a[n] : n)) : d.setAttribute(y, n);
		}), R(n);
	}
	function R(n) {
		h && w.includes(n) && (d.style.colorScheme = n);
	}
	function c() {
		return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	}
	if (u) p(u);
	else try {
		let n = localStorage.getItem(i) || s;
		p(l && n === "system" ? c() : n);
	} catch (n) {}
};
var b = ["light", "dark"];
var I = "(prefers-color-scheme: dark)";
var O = typeof window == "undefined";
var x = import_react.createContext(void 0);
var U = {
	setTheme: (e) => {},
	themes: []
};
var z = () => {
	var e;
	return (e = import_react.useContext(x)) != null ? e : U;
};
var J = (e) => import_react.useContext(x) ? import_react.createElement(import_react.Fragment, null, e.children) : import_react.createElement(V, { ...e });
var N = ["light", "dark"];
var V = ({ forcedTheme: e, disableTransitionOnChange: i = !1, enableSystem: s = !0, enableColorScheme: u = !0, storageKey: m = "theme", themes: a = N, defaultTheme: l = s ? "system" : "light", attribute: h = "data-theme", value: d, children: w, nonce: p, scriptProps: R }) => {
	let [c, n] = import_react.useState(() => H(m, l)), [T, y] = import_react.useState(() => c === "system" ? E() : c), k = d ? Object.values(d) : a, S = import_react.useCallback((o) => {
		let r = o;
		if (!r) return;
		o === "system" && s && (r = E());
		let v = d ? d[r] : r, C = i ? W(p) : null, P = document.documentElement, L = (g) => {
			g === "class" ? (P.classList.remove(...k), v && P.classList.add(v)) : g.startsWith("data-") && (v ? P.setAttribute(g, v) : P.removeAttribute(g));
		};
		if (Array.isArray(h) ? h.forEach(L) : L(h), u) {
			let g = b.includes(l) ? l : null, D = b.includes(r) ? r : g;
			P.style.colorScheme = D;
		}
		C?.();
	}, [p]), f = import_react.useCallback((o) => {
		let r = typeof o == "function" ? o(c) : o;
		n(r);
		try {
			localStorage.setItem(m, r);
		} catch (v) {}
	}, [c]), A = import_react.useCallback((o) => {
		let r = E(o);
		y(r), c === "system" && s && !e && S("system");
	}, [c, e]);
	import_react.useEffect(() => {
		let o = window.matchMedia(I);
		return o.addListener(A), A(o), () => o.removeListener(A);
	}, [A]), import_react.useEffect(() => {
		let o = (r) => {
			r.key === m && (r.newValue ? n(r.newValue) : f(l));
		};
		return window.addEventListener("storage", o), () => window.removeEventListener("storage", o);
	}, [f]), import_react.useEffect(() => {
		S(e != null ? e : c);
	}, [e, c]);
	let Q = import_react.useMemo(() => ({
		theme: c,
		setTheme: f,
		forcedTheme: e,
		resolvedTheme: c === "system" ? T : c,
		themes: s ? [...a, "system"] : a,
		systemTheme: s ? T : void 0
	}), [
		c,
		f,
		e,
		T,
		s,
		a
	]);
	return import_react.createElement(x.Provider, { value: Q }, import_react.createElement(_, {
		forcedTheme: e,
		storageKey: m,
		attribute: h,
		enableSystem: s,
		enableColorScheme: u,
		defaultTheme: l,
		value: d,
		themes: a,
		nonce: p,
		scriptProps: R
	}), w);
};
var _ = import_react.memo(({ forcedTheme: e, storageKey: i, attribute: s, enableSystem: u, enableColorScheme: m, defaultTheme: a, value: l, themes: h, nonce: d, scriptProps: w }) => {
	let p = JSON.stringify([
		s,
		i,
		a,
		e,
		h,
		l,
		u,
		m
	]).slice(1, -1);
	return import_react.createElement("script", {
		...w,
		suppressHydrationWarning: !0,
		nonce: typeof window == "undefined" ? d : "",
		dangerouslySetInnerHTML: { __html: `(${M.toString()})(${p})` }
	});
});
var H = (e, i) => {
	if (O) return;
	let s;
	try {
		s = localStorage.getItem(e) || void 0;
	} catch (u) {}
	return s || i;
};
var W = (e) => {
	let i = document.createElement("style");
	return e && i.setAttribute("nonce", e), i.appendChild(document.createTextNode("*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}")), document.head.appendChild(i), () => {
		window.getComputedStyle(document.body), setTimeout(() => {
			document.head.removeChild(i);
		}, 1);
	};
};
var E = (e) => (e || (e = window.matchMedia(I)), e.matches ? "dark" : "light");
//#endregion
export { DirectionContext as a, useSearchContext as i, z as n, useDirection as o, SearchProvider as r, J as t };
