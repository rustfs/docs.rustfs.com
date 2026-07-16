"use client";
import { highlightHast } from "./index.js";
import { use, useEffect, useMemo, useRef, useState } from "react";
import * as JsxRuntime from "react/jsx-runtime";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
//#region src/highlight/shiki/react.ts
const promises = {};
/**
* get highlighted results (uncached), use `useEffect` instead of React 19 APIs.
*/
function useShikiDynamic(highlighter, code, options, deps) {
	const [node, setNode] = useState(options.defaultValue);
	const lastTask = useRef(null);
	useEffect(() => {
		async function task() {
			return toJsxRuntime(await highlightHast(typeof highlighter === "function" ? await highlighter() : highlighter, code, options), {
				...JsxRuntime,
				components: options.components
			});
		}
		const promise = task();
		lastTask.current = promise;
		promise.then((res) => {
			if (lastTask.current === promise) setNode(res);
		});
		return () => {
			lastTask.current = null;
		};
	}, deps);
	return node;
}
/**
* get highlighted results, should be used with React Suspense API.
*
* note: results are cached with (lang, code) as keys, if this is not the desired behaviour, pass a `deps` instead.
*/
function useShiki(highlighter, code, options, deps = [options.lang, code]) {
	const key = useMemo(() => JSON.stringify(deps), [deps]);
	async function run() {
		return toJsxRuntime(await highlightHast(typeof highlighter === "function" ? await highlighter() : highlighter, code, options), {
			...JsxRuntime,
			components: options.components
		});
	}
	return use(promises[key] ??= run());
}
//#endregion
export { useShiki, useShikiDynamic };
