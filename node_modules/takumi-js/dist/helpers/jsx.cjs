var _takumi_rs_helpers_jsx = require("@takumi-rs/helpers/jsx");
Object.keys(_takumi_rs_helpers_jsx).forEach(function(k) {
	if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function() {
			return _takumi_rs_helpers_jsx[k];
		}
	});
});
