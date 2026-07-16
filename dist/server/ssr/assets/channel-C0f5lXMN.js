import { at as Color, ot as Utils } from "./chunk-WYO6CB5R-DD19QnnH.js";
//#region node_modules/khroma/dist/methods/channel.js
var channel = (color, channel) => {
	return Utils.lang.round(Color.parse(color)[channel]);
};
//#endregion
export { channel as t };
