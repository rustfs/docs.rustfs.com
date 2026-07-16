import { t as __commonJSMin } from "./rolldown-runtime-B-1-B7_t.js";
//#region ../../node_modules/.pnpm/remove-markdown@0.6.4/node_modules/remove-markdown/index.js
var require_remove_markdown = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function(md, options) {
		options = options || {};
		options.listUnicodeChar = options.hasOwnProperty("listUnicodeChar") ? options.listUnicodeChar : false;
		options.stripListLeaders = options.hasOwnProperty("stripListLeaders") ? options.stripListLeaders : true;
		options.gfm = options.hasOwnProperty("gfm") ? options.gfm : true;
		options.useImgAltText = options.hasOwnProperty("useImgAltText") ? options.useImgAltText : true;
		options.abbr = options.hasOwnProperty("abbr") ? options.abbr : false;
		options.replaceLinksWithURL = options.hasOwnProperty("replaceLinksWithURL") ? options.replaceLinksWithURL : false;
		options.separateLinksAndTexts = options.hasOwnProperty("separateLinksAndTexts") ? options.separateLinksAndTexts : null;
		options.htmlTagsToSkip = options.hasOwnProperty("htmlTagsToSkip") ? options.htmlTagsToSkip : [];
		options.throwError = options.hasOwnProperty("throwError") ? options.throwError : false;
		var output = md || "";
		output = output.replace(/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/gm, "");
		try {
			if (options.stripListLeaders) if (options.listUnicodeChar) output = output.replace(/^([\s\t]*)([\*\-\+]|\d+\.)\s+/gm, options.listUnicodeChar + " $1");
			else output = output.replace(/^([\s\t]*)([\*\-\+]|\d+\.)\s+/gm, "$1");
			if (options.gfm) output = output.replace(/\n={2,}/g, "\n").replace(/~{3}.*\n/g, "").replace(/~~/g, "").replace(/```(?:.*)\n([\s\S]*?)```/g, (_, code) => code.trim());
			if (options.abbr) output = output.replace(/\*\[.*\]:.*\n/, "");
			let htmlReplaceRegex = /<[^>]*>/g;
			if (options.htmlTagsToSkip && options.htmlTagsToSkip.length > 0) {
				const joinedHtmlTagsToSkip = options.htmlTagsToSkip.join("|");
				htmlReplaceRegex = new RegExp(`<(?!\/?(${joinedHtmlTagsToSkip})(?=>|\s[^>]*>))[^>]*>`, "g");
			}
			if (options.separateLinksAndTexts) output = output.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1" + options.separateLinksAndTexts + "$2");
			output = output.replace(htmlReplaceRegex, "").replace(/^[=\-]{2,}\s*$/g, "").replace(/\[\^.+?\](\: .*?$)?/g, "").replace(/\s{0,2}\[.*?\]: .*?$/g, "").replace(/\!\[(.*?)\][\[\(].*?[\]\)]/g, options.useImgAltText ? "$1" : "").replace(/\[([\s\S]*?)\]\s*[\(\[](.*?)[\)\]]/g, options.replaceLinksWithURL ? "$2" : "$1").replace(/^(\n)?\s{0,3}>\s?/gm, "$1").replace(/^\s{1,2}\[(.*?)\]: (\S+)( ".*?")?\s*$/g, "").replace(/^(\n)?\s{0,}#{1,6}\s*( (.+))? +#+$|^(\n)?\s{0,}#{1,6}\s*( (.+))?$/gm, "$1$3$4$6").replace(/([\*]+)(\S)(.*?\S)??\1/g, "$2$3").replace(/(^|\W)([_]+)(\S)(.*?\S)??\2($|\W)/g, "$1$3$4$5").replace(/(`{3,})(.*?)\1/gm, "$2").replace(/`(.+?)`/g, "$1").replace(/~(.*?)~/g, "$1");
		} catch (e) {
			if (options.throwError) throw e;
			console.error("remove-markdown encountered error: %s", e);
			return md;
		}
		return output;
	};
}));
//#endregion
export { require_remove_markdown as t };
