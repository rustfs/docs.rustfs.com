import { load } from "js-yaml";
//#region src/content/md/frontmatter.ts
/**
* Inspired by https://github.com/jonschlinkert/gray-matter
*/
const regex = /^---\r?\n(.+?)\r?\n---\r?\n?/s;
/**
* parse frontmatter, it supports only yaml format
*/
function frontmatter(input) {
	const output = {
		matter: "",
		data: {},
		content: input
	};
	const match = regex.exec(input);
	if (!match) return output;
	output.matter = match[0];
	output.content = input.slice(match[0].length);
	output.data = load(match[1]) ?? {};
	return output;
}
//#endregion
export { frontmatter };
