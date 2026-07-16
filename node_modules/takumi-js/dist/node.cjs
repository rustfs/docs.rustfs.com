var _takumi_rs_core = require("@takumi-rs/core");
Object.keys(_takumi_rs_core).forEach(function(k) {
	if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function() {
			return _takumi_rs_core[k];
		}
	});
});
