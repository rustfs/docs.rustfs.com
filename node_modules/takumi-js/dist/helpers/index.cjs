var _takumi_rs_helpers = require("@takumi-rs/helpers");
Object.keys(_takumi_rs_helpers).forEach(function(k) {
	if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function() {
			return _takumi_rs_helpers[k];
		}
	});
});
