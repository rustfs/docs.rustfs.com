import { t as isEqualShallow } from "../is-equal-LdLqRs0o.js";
import { useEffect, useMemo, useRef, useState } from "react";
//#region src/utils/use-debounce.ts
function useDebounce(value, delayMs = 1e3) {
	const [debouncedValue, setDebouncedValue] = useState(value);
	useEffect(() => {
		if (delayMs === 0) return;
		const handler = window.setTimeout(() => {
			setDebouncedValue(value);
		}, delayMs);
		return () => clearTimeout(handler);
	}, [delayMs, value]);
	if (delayMs === 0) return value;
	return debouncedValue;
}
//#endregion
//#region src/search/client.ts
/**
* Provide a hook to query different official search clients.
*
* Note: it will re-query when its parameters changed, make sure to define `deps` array if you encounter rendering issues.
*/
function useDocsSearch(clientOptions, customDeps) {
	const { delayMs = 100, allowEmpty = false, ...clientRest } = clientOptions;
	const [search, setSearch] = useState("");
	const [results, setResults] = useState("empty");
	const [error, setError] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const debouncedValue = useDebounce(search, delayMs);
	let client;
	if ("type" in clientRest) switch (clientRest.type) {
		case "fetch":
			client = import("./client/fetch.js").then((mod) => mod.fetchClient(clientRest));
			break;
		case "algolia":
			client = import("./client/algolia.js").then((mod) => mod.algoliaClient(clientRest));
			break;
		case "orama-cloud":
			client = import("./client/orama-cloud.js").then((mod) => mod.oramaCloudClient(clientRest));
			break;
		case "orama-cloud-legacy":
			client = import("./client/orama-cloud-legacy.js").then((mod) => mod.oramaCloudLegacyClient(clientRest));
			break;
		case "mixedbread":
			client = import("./client/mixedbread.js").then((mod) => mod.mixedbreadClient(clientRest));
			break;
		case "static":
			client = import("./client/orama-static.js").then((mod) => mod.oramaStaticClient(clientRest));
			break;
		default: throw new Error("unknown search client");
	}
	else client = clientRest.client;
	const deps = [customDeps ?? (client instanceof Promise ? JSON.stringify(clientRest) : client.deps), debouncedValue];
	const [activeDeps, setActiveDeps] = useState(null);
	const activeTaskRef = useRef(null);
	if (!isEqualShallow(activeDeps, deps) && (!activeTaskRef.current || !isEqualShallow(activeTaskRef.current.deps, deps))) {
		if (activeTaskRef.current) activeTaskRef.current.interrupt = true;
		activeTaskRef.current = {
			deps,
			interrupt: false,
			async start() {
				try {
					setIsLoading(true);
					let res;
					if (debouncedValue.length === 0 && !allowEmpty) res = "empty";
					else res = await (await client).search(debouncedValue);
					if (!this.interrupt) {
						setActiveDeps(deps);
						setError(void 0);
						setResults(res);
					}
				} catch (err) {
					if (!this.interrupt) setError(err);
				} finally {
					if (!this.interrupt) setIsLoading(false);
				}
			}
		};
		activeTaskRef.current.start();
	}
	return useMemo(() => ({
		search,
		setSearch,
		query: {
			isLoading,
			data: results,
			error
		}
	}), [
		search,
		isLoading,
		results,
		error
	]);
}
//#endregion
export { useDocsSearch };
