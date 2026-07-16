import { i as __toESM } from "./rolldown-runtime-B4lejLz5.js";
import { t as require_react } from "./react-BKYDRtZ1.js";
import { t as createLucideIcon } from "./createLucideIcon-XapafaKb.js";
/**
* @license lucide-react v1.24.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ChevronRight = createLucideIcon("chevron-right", [["path", {
	d: "m9 18 6-6-6-6",
	key: "mthhwq"
}]]);
//#endregion
//#region node_modules/fumadocs-ui/dist/utils/merge-refs.js
function mergeRefs(...refs) {
	return (value) => {
		refs.forEach((ref) => {
			if (typeof ref === "function") ref(value);
			else if (ref) ref.current = value;
		});
	};
}
//#endregion
//#region node_modules/fumadocs-core/dist/is-equal-LdLqRs0o.js
function isEqualShallow(a, b) {
	if (a === b) return true;
	if (Array.isArray(a) && Array.isArray(b)) return b.length === a.length && a.every((v, i) => isEqualShallow(v, b[i]));
	return false;
}
//#endregion
//#region node_modules/fumadocs-core/dist/utils/use-on-change.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/**
* @param value - state to watch
* @param onChange - when the state changed
* @param isUpdated - a function that determines if the state is updated
*/
function useOnChange(value, onChange, isUpdated = (a, b) => !isEqualShallow(a, b)) {
	const [prev, setPrev] = (0, import_react.useState)(value);
	if (isUpdated(prev, value)) {
		onChange(value, prev);
		setPrev(value);
	}
}
//#endregion
//#region node_modules/compute-scroll-into-view/dist/index.js
var t = (t) => "object" == typeof t && null != t && 1 === t.nodeType;
var e$1 = (t, e) => (!e || "hidden" !== t) && "visible" !== t && "clip" !== t;
var n = (t, n) => {
	if (t.clientHeight < t.scrollHeight || t.clientWidth < t.scrollWidth) {
		const o = getComputedStyle(t, null);
		return e$1(o.overflowY, n) || e$1(o.overflowX, n) || ((t) => {
			const e = ((t) => {
				if (!t.ownerDocument || !t.ownerDocument.defaultView) return null;
				try {
					return t.ownerDocument.defaultView.frameElement;
				} catch (t) {
					return null;
				}
			})(t);
			return !!e && (e.clientHeight < t.scrollHeight || e.clientWidth < t.scrollWidth);
		})(t);
	}
	return !1;
};
var o$1 = (t, e, n, o, l, r, i, s) => r < t && i > e || r > t && i < e ? 0 : r <= t && s <= n || i >= e && s >= n ? r - t - o : i > e && s < n || r < t && s > n ? i - e + l : 0;
var l = (t) => {
	const e = t.parentElement;
	return null == e ? t.getRootNode().host || null : e;
};
var r = (e, r) => {
	var i, s, d, h;
	if ("undefined" == typeof document) return [];
	const { scrollMode: c, block: f, inline: u, boundary: a, skipOverflowHiddenElements: g } = r, p = "function" == typeof a ? a : (t) => t !== a;
	if (!t(e)) throw new TypeError("Invalid target");
	const m = document.scrollingElement || document.documentElement, w = [];
	let W = e;
	for (; t(W) && p(W);) {
		if (W = l(W), W === m) {
			w.push(W);
			break;
		}
		null != W && W === document.body && n(W) && !n(document.documentElement) || null != W && n(W, g) && w.push(W);
	}
	const b = null != (s = null == (i = window.visualViewport) ? void 0 : i.width) ? s : innerWidth, H = null != (h = null == (d = window.visualViewport) ? void 0 : d.height) ? h : innerHeight, { scrollX: y, scrollY: M } = window, { height: v, width: E, top: x, right: C, bottom: I, left: R } = e.getBoundingClientRect(), { top: T, right: B, bottom: F, left: V } = ((t) => {
		const e = window.getComputedStyle(t);
		return {
			top: parseFloat(e.scrollMarginTop) || 0,
			right: parseFloat(e.scrollMarginRight) || 0,
			bottom: parseFloat(e.scrollMarginBottom) || 0,
			left: parseFloat(e.scrollMarginLeft) || 0
		};
	})(e);
	let k = "start" === f || "nearest" === f ? x - T : "end" === f ? I + F : x + v / 2 - T + F, D = "center" === u ? R + E / 2 - V + B : "end" === u ? C + B : R - V;
	const L = [];
	for (let t = 0; t < w.length; t++) {
		const e = w[t], { height: l, width: r, top: i, right: s, bottom: d, left: h } = e.getBoundingClientRect();
		if ("if-needed" === c && x >= 0 && R >= 0 && I <= H && C <= b && (e === m && !n(e) || x >= i && I <= d && R >= h && C <= s)) return L;
		const a = getComputedStyle(e), g = parseInt(a.borderLeftWidth, 10), p = parseInt(a.borderTopWidth, 10), W = parseInt(a.borderRightWidth, 10), T = parseInt(a.borderBottomWidth, 10);
		let B = 0, F = 0;
		const V = "offsetWidth" in e ? e.offsetWidth - e.clientWidth - g - W : 0, S = "offsetHeight" in e ? e.offsetHeight - e.clientHeight - p - T : 0, X = "offsetWidth" in e ? 0 === e.offsetWidth ? 0 : r / e.offsetWidth : 0, Y = "offsetHeight" in e ? 0 === e.offsetHeight ? 0 : l / e.offsetHeight : 0;
		if (m === e) B = "start" === f ? k : "end" === f ? k - H : "nearest" === f ? o$1(M, M + H, H, p, T, M + k, M + k + v, v) : k - H / 2, F = "start" === u ? D : "center" === u ? D - b / 2 : "end" === u ? D - b : o$1(y, y + b, b, g, W, y + D, y + D + E, E), B = Math.max(0, B + M), F = Math.max(0, F + y);
		else {
			B = "start" === f ? k - i - p : "end" === f ? k - d + T + S : "nearest" === f ? o$1(i, d, l, p, T + S, k, k + v, v) : k - (i + l / 2) + S / 2, F = "start" === u ? D - h - g : "center" === u ? D - (h + r / 2) + V / 2 : "end" === u ? D - s + W + V : o$1(h, s, r, g, W + V, D, D + E, E);
			const { scrollLeft: t, scrollTop: n } = e;
			B = 0 === Y ? 0 : Math.max(0, Math.min(n + B / Y, e.scrollHeight - l / Y + S)), F = 0 === X ? 0 : Math.max(0, Math.min(t + F / X, e.scrollWidth - r / X + V)), k += n - B, D += t - F;
		}
		L.push({
			el: e,
			top: B,
			left: F
		});
	}
	return L;
};
//#endregion
//#region node_modules/scroll-into-view-if-needed/dist/index.js
var o = (t) => !1 === t ? {
	block: "end",
	inline: "nearest"
} : ((t) => t === Object(t) && 0 !== Object.keys(t).length)(t) ? t : {
	block: "start",
	inline: "nearest"
};
function e(e, r$1) {
	if (!e.isConnected || !((t) => {
		let o = t;
		for (; o && o.parentNode;) {
			if (o.parentNode === document) return !0;
			o = o.parentNode instanceof ShadowRoot ? o.parentNode.host : o.parentNode;
		}
		return !1;
	})(e)) return;
	const n = ((t) => {
		const o = window.getComputedStyle(t);
		return {
			top: parseFloat(o.scrollMarginTop) || 0,
			right: parseFloat(o.scrollMarginRight) || 0,
			bottom: parseFloat(o.scrollMarginBottom) || 0,
			left: parseFloat(o.scrollMarginLeft) || 0
		};
	})(e);
	if (((t) => "object" == typeof t && "function" == typeof t.behavior)(r$1)) return r$1.behavior(r(e, r$1));
	const l = "boolean" == typeof r$1 || null == r$1 ? void 0 : r$1.behavior;
	for (const { el: a, top: i, left: s } of r(e, o(r$1))) {
		const t = i - n.top + n.bottom, o = s - n.left + n.right;
		a.scroll({
			top: t,
			left: o,
			behavior: l
		});
	}
}
//#endregion
export { ChevronRight as a, mergeRefs as i, useOnChange as n, isEqualShallow as r, e as t };
