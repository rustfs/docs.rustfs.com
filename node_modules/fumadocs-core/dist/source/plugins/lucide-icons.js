import { t as iconPlugin } from "../../icon-BILaoXeg.js";
import { createElement } from "react";
import { icons } from "lucide-react";
//#region src/source/plugins/lucide-icons.ts
/**
* Convert icon names into Lucide Icons, requires `lucide-react` to be installed.
*/
function lucideIconsPlugin(options = {}) {
	const { defaultIcon } = options;
	return iconPlugin((icon = defaultIcon) => {
		if (icon === void 0) return;
		const Icon = icons[icon];
		if (!Icon) {
			console.warn(`[lucide-icons-plugin] Unknown icon detected: ${icon}.`);
			return;
		}
		return createElement(Icon);
	});
}
//#endregion
export { lucideIconsPlugin };
