Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require_rolldown_runtime = require("./rolldown-runtime-DakpK96I.cjs");
let _takumi_rs_wasm_auto = require("@takumi-rs/wasm/auto");
_takumi_rs_wasm_auto = require_rolldown_runtime.__toESM(_takumi_rs_wasm_auto, 1);
let _takumi_rs_wasm = require("@takumi-rs/wasm");
_takumi_rs_wasm = require_rolldown_runtime.__toESM(_takumi_rs_wasm, 1);
Object.defineProperty(exports, "default", {
	enumerable: true,
	get: function() {
		return _takumi_rs_wasm_auto.default;
	}
});
Object.defineProperty(exports, "init", {
	enumerable: true,
	get: function() {
		return _takumi_rs_wasm.default;
	}
});
Object.keys(_takumi_rs_wasm).forEach(function(k) {
	if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function() {
			return _takumi_rs_wasm[k];
		}
	});
});
