//#region node_modules/@takumi-rs/helpers/dist/fonts-B4N9qU8h.mjs
var t = /url\(\s*(['"]?)(.*?)\1\s*\)/g;
async function n(e, t = {}) {
	if (t.allowUrl && !t.allowUrl(e)) throw Error(`URL blocked by allowUrl policy: ${e}`);
	let n = t.fetch ?? globalThis.fetch, r = t.timeout ?? 5e3, i = r <= 0 ? void 0 : AbortSignal.timeout(r), a = [
		t.signal,
		t.init?.signal,
		i
	].filter((e) => e !== void 0), o = a.length ? AbortSignal.any(a) : void 0, s = await n(e, {
		...t.init,
		signal: o
	});
	if (!s.ok) throw Error(`HTTP ${s.status} ${s.statusText} fetching ${e}`);
	return s;
}
async function r(e, t) {
	let n = Number(e.headers.get(`content-length`));
	if (Number.isFinite(n) && n > t) throw Error(`Response exceeds ${t} bytes (content-length ${n})`);
	let r = e.body;
	if (!r) return e.arrayBuffer();
	let i = r.getReader(), a = [], o = 0;
	for (;;) {
		let { done: e, value: n } = await i.read();
		if (e) break;
		if (o += n.byteLength, o > t) throw await i.cancel().catch(() => {}), Error(`Response exceeds ${t} bytes`);
		a.push(n);
	}
	let s = new Uint8Array(o), c = 0;
	for (let e of a) s.set(e, c), c += e.byteLength;
	return s.buffer;
}
function i(e) {
	return e.startsWith(`https://`) || e.startsWith(`http://`);
}
function a(e, n) {
	if (typeof e == `string`) for (let r of e.matchAll(t)) {
		let e = r[2]?.trim();
		e && i(e) && n.add(e);
	}
	else if (Array.isArray(e)) for (let t of e) a(t, n);
}
function o(e) {
	let t = /* @__PURE__ */ new Set(), n = (e) => {
		let r = (e) => {
			e && (a(e.backgroundImage, t), a(e.maskImage, t));
		};
		if (r(e.style), r(e.preset), a(e.tw, t), e.type === `image`) {
			typeof e.src == `string` && i(e.src) && t.add(e.src);
			return;
		}
		if (e.type === `container`) for (let t of e.children ?? []) n(t);
	};
	return n(e), [...t];
}
function s(e, t, i) {
	let a = i?.get(e);
	if (a) return a;
	let o = n(e, t).then((e) => r(e, t.maxBytes ?? 33554432)).catch((t) => {
		throw i?.delete(e), t;
	});
	return i?.set(e, o), o;
}
async function c({ node: e, sources: t = [], fetchCache: n, fetch: r, timeout: i, signal: a, maxBytes: c, allowUrl: l, throwOnError: u = !0 }) {
	let d = Array.isArray(e) ? e : [e], f = /* @__PURE__ */ new Map();
	for (let e of t) f.set(e.src, e);
	let p = [...new Set(d.flatMap(o))].filter((e) => !f.has(e)), m = {
		fetch: r,
		timeout: i,
		signal: a,
		maxBytes: c,
		allowUrl: l
	}, h = p.map(async (e) => ({
		src: e,
		data: await s(e, m, n)
	})), g = u ? await Promise.all(h) : (await Promise.allSettled(h)).filter((e) => e.status === `fulfilled`).map((e) => e.value);
	return [...f.values(), ...g];
}
function y(e) {
	let t = /* @__PURE__ */ new Set(), n = (e) => {
		for (let n of e) t.add(n.codePointAt(0));
	}, r = (e) => {
		e.type === `text` ? n(e.text) : e.type === `container` && e.children?.forEach(r);
	};
	return typeof e == `string` ? n(e) : Array.isArray(e) ? e.forEach(r) : r(e), t;
}
function b(e, t) {
	if (e.length === 0) return !0;
	for (let n of t) for (let [t, r] of e) if (n >= t && n <= r) return !0;
	return !1;
}
function x({ fonts: e, source: t }) {
	let n = y(t);
	return e.filter((e) => b(e.ranges ?? [], n));
}
function S(e, t = {}) {
	return {
		key: e,
		data: () => n(e, t).then((e) => r(e, t.maxBytes ?? 33554432))
	};
}
//#endregion
export { c as n, x as r, S as t };
