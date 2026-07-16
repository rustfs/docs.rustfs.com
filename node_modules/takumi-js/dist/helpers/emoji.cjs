var _takumi_rs_helpers_emoji = require("@takumi-rs/helpers/emoji");
Object.keys(_takumi_rs_helpers_emoji).forEach(function(k) {
	if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function() {
			return _takumi_rs_helpers_emoji[k];
		}
	});
});
