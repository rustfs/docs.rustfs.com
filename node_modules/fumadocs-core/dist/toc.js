"use client";
import { t as isEqualShallow } from "./is-equal-LdLqRs0o.js";
import { createContext, use, useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import { jsx } from "react/jsx-runtime";
import scrollIntoView from "scroll-into-view-if-needed";
//#region src/utils/merge-refs.ts
function mergeRefs(...refs) {
	return (value) => {
		refs.forEach((ref) => {
			if (typeof ref === "function") ref(value);
			else if (ref != null) ref.current = value;
		});
	};
}
//#endregion
//#region src/toc.tsx
const ObserverContext = createContext(null);
const ScrollContext = createContext(null);
/** Optional: add auto-scroll to TOC items. */
function ScrollProvider({ containerRef, children }) {
	return /* @__PURE__ */ jsx(ScrollContext, {
		value: containerRef,
		children
	});
}
function AnchorProvider({ toc, single = false, children }) {
	const observer = useMemo(() => new Observer(), []);
	observer.single = single;
	useEffect(() => {
		observer.setItems(toc);
	}, [observer, toc]);
	useEffect(() => {
		observer.watch({ threshold: .9 });
		return () => observer.unwatch();
	}, [observer]);
	return /* @__PURE__ */ jsx(ObserverContext, {
		value: observer,
		children
	});
}
function TOCItem({ ref, onActiveChange = () => null, ...props }) {
	const id = props.href ? getItemId(props.href) : null;
	const containerRef = use(ScrollContext);
	const anchorRef = useRef(null);
	const observer = useObserver();
	const [active, setActive] = useState(() => observer.items.some((item) => item.id === id && item.active));
	function autoScroll(items, instant = false) {
		const anchor = anchorRef.current;
		const container = containerRef?.current;
		if (!id || !anchor || !container) return;
		let lastActive;
		for (const item of items) {
			if (!item.active) continue;
			if (!lastActive || lastActive.t < item.t) lastActive = item;
		}
		if (lastActive?.id === id) scrollIntoView(anchor, {
			behavior: instant ? "instant" : "smooth",
			block: "center",
			inline: "center",
			scrollMode: "always",
			boundary: container
		});
	}
	useTOCListener((items) => {
		const itemData = id ? items.find((item) => item.id === id) : null;
		if (itemData && itemData.active !== active) {
			setActive(itemData.active);
			onActiveChange(itemData.active);
			autoScroll(items);
		}
	});
	useEffect(() => {
		autoScroll(observer.items, true);
	}, [observer]);
	return /* @__PURE__ */ jsx("a", {
		ref: mergeRefs(anchorRef, ref),
		"data-active": active,
		...props
	});
}
function useObserver() {
	const observer = use(ObserverContext);
	if (!observer) throw new Error(`Component must be used under the <AnchorProvider /> component.`);
	return observer;
}
/** @returns static info object, useful for custom rendering logic */
function useTOC() {
	const observer = useObserver();
	return useMemo(() => ({
		get() {
			return observer.items;
		},
		listen: observer.listen.bind(observer),
		unlisten: observer.unlisten.bind(observer)
	}), [observer]);
}
function useTOCListener(listener) {
	const observer = useObserver();
	const callback = useEffectEvent(listener);
	useEffect(() => {
		observer.listen(callback);
		return () => observer.unlisten(callback);
	}, [observer]);
}
function useTOCSelector(select, isEqual = isEqualShallow) {
	const observer = useObserver();
	const [value, setValue] = useState(() => select(observer.items));
	useTOCListener((items) => {
		const next = select(items);
		if (!isEqual(value, next)) setValue(next);
	});
	return value;
}
/**
* The estimated active heading ID
*/
function useActiveAnchor() {
	return useTOCSelector((items) => {
		let out;
		for (const item of items) {
			if (!item.active) continue;
			if (!out || item.t > out.t) out = item;
		}
		return out?.id;
	});
}
/**
* The id of visible anchors
*/
function useActiveAnchors() {
	return useTOCSelector((items) => {
		const out = [];
		for (const item of items) if (item.active) out.push(item.id);
		return out;
	});
}
function useItems() {
	return useTOCSelector((items) => items);
}
function getItemId(url) {
	if (url.startsWith("#")) return url.slice(1);
	return null;
}
var Observer = class {
	constructor() {
		this.items = [];
		this.single = false;
		this.observer = null;
		this.listeners = /* @__PURE__ */ new Set();
	}
	listen(listener) {
		this.listeners.add(listener);
	}
	unlisten(listener) {
		this.listeners.delete(listener);
	}
	setItems(newItems) {
		const observer = this.observer;
		if (observer) for (const item of this.items) {
			const element = document.getElementById(item.id);
			if (!element) continue;
			observer.unobserve(element);
		}
		const next = [];
		for (const item of newItems) {
			const id = getItemId(item.url);
			if (!id) continue;
			next.push({
				id,
				active: false,
				fallback: false,
				t: 0,
				original: item
			});
		}
		this.update(next);
		this.observeItems();
	}
	watch(options) {
		if (this.observer) return;
		this.observer = new IntersectionObserver(this.callback.bind(this), options);
		this.observeItems();
	}
	unwatch() {
		this.observer?.disconnect();
		this.observer = null;
	}
	callback(entries) {
		if (entries.length === 0) return;
		let hasActive = false;
		const updated = this.items.map((item) => {
			const entry = entries.find((entry) => entry.target.id === item.id);
			let active = entry ? entry.isIntersecting : item.active && !item.fallback;
			if (this.single && hasActive) active = false;
			if (item.active !== active) item = {
				...item,
				t: Date.now(),
				active,
				fallback: false
			};
			if (active) hasActive = true;
			return item;
		});
		if (!hasActive && entries[0].rootBounds) {
			const viewTop = entries[0].rootBounds.top;
			let min = Number.MAX_VALUE;
			let fallbackIdx = -1;
			for (let i = 0; i < updated.length; i++) {
				const element = document.getElementById(updated[i].id);
				if (!element) continue;
				const d = Math.abs(viewTop - element.getBoundingClientRect().top);
				if (d < min) {
					fallbackIdx = i;
					min = d;
				}
			}
			if (fallbackIdx !== -1) updated[fallbackIdx] = {
				...updated[fallbackIdx],
				active: true,
				fallback: true,
				t: Date.now()
			};
		}
		this.update(updated);
	}
	observeItems() {
		if (!this.observer) return;
		for (const item of this.items) {
			const element = document.getElementById(item.id);
			if (!element) continue;
			this.observer.observe(element);
		}
	}
	update(next) {
		this.items = next;
		for (const listener of this.listeners) listener(next);
	}
};
//#endregion
export { AnchorProvider, ScrollProvider, TOCItem, useActiveAnchor, useActiveAnchors, useItems, useTOC, useTOCListener, useTOCSelector };
