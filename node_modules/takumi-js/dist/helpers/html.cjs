var _takumi_rs_helpers_html = require("@takumi-rs/helpers/html");
Object.keys(_takumi_rs_helpers_html).forEach(function(k) {
	if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function() {
			return _takumi_rs_helpers_html[k];
		}
	});
});
