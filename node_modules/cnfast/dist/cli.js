import { createRequire } from "node:module";
import { relative, resolve } from "node:path";
import { readFileSync, writeFileSync } from "node:fs";
import process$1 from "node:process";
import * as nativeFs from "fs";
import { readdir, readdirSync, realpath, realpathSync, stat, statSync } from "fs";
import { basename, dirname, isAbsolute, normalize, posix, relative as relative$1, resolve as resolve$1, sep } from "path";
import { fileURLToPath } from "url";
import { createRequire as createRequire$1 } from "module";
import { stripVTControlCharacters } from "node:util";
import os from "node:os";
import tty from "node:tty";

//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") {
		for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
			key = keys[i];
			if (!__hasOwnProp.call(to, key) && key !== except) {
				__defProp(to, key, {
					get: ((k) => from[k]).bind(null, key),
					enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
				});
			}
		}
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
var __require$1 = /* @__PURE__ */ createRequire(import.meta.url);

//#endregion
//#region ../../node_modules/.pnpm/commander@14.0.3/node_modules/commander/lib/error.js
var require_error = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* CommanderError class
	*/
	var CommanderError = class extends Error {
		/**
		* Constructs the CommanderError class
		* @param {number} exitCode suggested exit code which could be used with process.exit
		* @param {string} code an id string representing the error
		* @param {string} message human-readable description of the error
		*/
		constructor(exitCode, code, message) {
			super(message);
			Error.captureStackTrace(this, this.constructor);
			this.name = this.constructor.name;
			this.code = code;
			this.exitCode = exitCode;
			this.nestedError = void 0;
		}
	};
	/**
	* InvalidArgumentError class
	*/
	var InvalidArgumentError = class extends CommanderError {
		/**
		* Constructs the InvalidArgumentError class
		* @param {string} [message] explanation of why argument is invalid
		*/
		constructor(message) {
			super(1, "commander.invalidArgument", message);
			Error.captureStackTrace(this, this.constructor);
			this.name = this.constructor.name;
		}
	};
	exports.CommanderError = CommanderError;
	exports.InvalidArgumentError = InvalidArgumentError;
}));

//#endregion
//#region ../../node_modules/.pnpm/commander@14.0.3/node_modules/commander/lib/argument.js
var require_argument = /* @__PURE__ */ __commonJSMin(((exports) => {
	const { InvalidArgumentError } = require_error();
	var Argument = class {
		/**
		* Initialize a new command argument with the given name and description.
		* The default is that the argument is required, and you can explicitly
		* indicate this with <> around the name. Put [] around the name for an optional argument.
		*
		* @param {string} name
		* @param {string} [description]
		*/
		constructor(name, description) {
			this.description = description || "";
			this.variadic = false;
			this.parseArg = void 0;
			this.defaultValue = void 0;
			this.defaultValueDescription = void 0;
			this.argChoices = void 0;
			switch (name[0]) {
				case "<":
					this.required = true;
					this._name = name.slice(1, -1);
					break;
				case "[":
					this.required = false;
					this._name = name.slice(1, -1);
					break;
				default:
					this.required = true;
					this._name = name;
					break;
			}
			if (this._name.endsWith("...")) {
				this.variadic = true;
				this._name = this._name.slice(0, -3);
			}
		}
		/**
		* Return argument name.
		*
		* @return {string}
		*/
		name() {
			return this._name;
		}
		/**
		* @package
		*/
		_collectValue(value, previous) {
			if (previous === this.defaultValue || !Array.isArray(previous)) return [value];
			previous.push(value);
			return previous;
		}
		/**
		* Set the default value, and optionally supply the description to be displayed in the help.
		*
		* @param {*} value
		* @param {string} [description]
		* @return {Argument}
		*/
		default(value, description) {
			this.defaultValue = value;
			this.defaultValueDescription = description;
			return this;
		}
		/**
		* Set the custom handler for processing CLI command arguments into argument values.
		*
		* @param {Function} [fn]
		* @return {Argument}
		*/
		argParser(fn) {
			this.parseArg = fn;
			return this;
		}
		/**
		* Only allow argument value to be one of choices.
		*
		* @param {string[]} values
		* @return {Argument}
		*/
		choices(values) {
			this.argChoices = values.slice();
			this.parseArg = (arg, previous) => {
				if (!this.argChoices.includes(arg)) throw new InvalidArgumentError(`Allowed choices are ${this.argChoices.join(", ")}.`);
				if (this.variadic) return this._collectValue(arg, previous);
				return arg;
			};
			return this;
		}
		/**
		* Make argument required.
		*
		* @returns {Argument}
		*/
		argRequired() {
			this.required = true;
			return this;
		}
		/**
		* Make argument optional.
		*
		* @returns {Argument}
		*/
		argOptional() {
			this.required = false;
			return this;
		}
	};
	/**
	* Takes an argument and returns its human readable equivalent for help usage.
	*
	* @param {Argument} arg
	* @return {string}
	* @private
	*/
	function humanReadableArgName(arg) {
		const nameOutput = arg.name() + (arg.variadic === true ? "..." : "");
		return arg.required ? "<" + nameOutput + ">" : "[" + nameOutput + "]";
	}
	exports.Argument = Argument;
	exports.humanReadableArgName = humanReadableArgName;
}));

//#endregion
//#region ../../node_modules/.pnpm/commander@14.0.3/node_modules/commander/lib/help.js
var require_help = /* @__PURE__ */ __commonJSMin(((exports) => {
	const { humanReadableArgName } = require_argument();
	/**
	* TypeScript import types for JSDoc, used by Visual Studio Code IntelliSense and `npm run typescript-checkJS`
	* https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#import-types
	* @typedef { import("./argument.js").Argument } Argument
	* @typedef { import("./command.js").Command } Command
	* @typedef { import("./option.js").Option } Option
	*/
	var Help = class {
		constructor() {
			this.helpWidth = void 0;
			this.minWidthToWrap = 40;
			this.sortSubcommands = false;
			this.sortOptions = false;
			this.showGlobalOptions = false;
		}
		/**
		* prepareContext is called by Commander after applying overrides from `Command.configureHelp()`
		* and just before calling `formatHelp()`.
		*
		* Commander just uses the helpWidth and the rest is provided for optional use by more complex subclasses.
		*
		* @param {{ error?: boolean, helpWidth?: number, outputHasColors?: boolean }} contextOptions
		*/
		prepareContext(contextOptions) {
			this.helpWidth = this.helpWidth ?? contextOptions.helpWidth ?? 80;
		}
		/**
		* Get an array of the visible subcommands. Includes a placeholder for the implicit help command, if there is one.
		*
		* @param {Command} cmd
		* @returns {Command[]}
		*/
		visibleCommands(cmd) {
			const visibleCommands = cmd.commands.filter((cmd) => !cmd._hidden);
			const helpCommand = cmd._getHelpCommand();
			if (helpCommand && !helpCommand._hidden) visibleCommands.push(helpCommand);
			if (this.sortSubcommands) visibleCommands.sort((a, b) => {
				return a.name().localeCompare(b.name());
			});
			return visibleCommands;
		}
		/**
		* Compare options for sort.
		*
		* @param {Option} a
		* @param {Option} b
		* @returns {number}
		*/
		compareOptions(a, b) {
			const getSortKey = (option) => {
				return option.short ? option.short.replace(/^-/, "") : option.long.replace(/^--/, "");
			};
			return getSortKey(a).localeCompare(getSortKey(b));
		}
		/**
		* Get an array of the visible options. Includes a placeholder for the implicit help option, if there is one.
		*
		* @param {Command} cmd
		* @returns {Option[]}
		*/
		visibleOptions(cmd) {
			const visibleOptions = cmd.options.filter((option) => !option.hidden);
			const helpOption = cmd._getHelpOption();
			if (helpOption && !helpOption.hidden) {
				const removeShort = helpOption.short && cmd._findOption(helpOption.short);
				const removeLong = helpOption.long && cmd._findOption(helpOption.long);
				if (!removeShort && !removeLong) visibleOptions.push(helpOption);
				else if (helpOption.long && !removeLong) visibleOptions.push(cmd.createOption(helpOption.long, helpOption.description));
				else if (helpOption.short && !removeShort) visibleOptions.push(cmd.createOption(helpOption.short, helpOption.description));
			}
			if (this.sortOptions) visibleOptions.sort(this.compareOptions);
			return visibleOptions;
		}
		/**
		* Get an array of the visible global options. (Not including help.)
		*
		* @param {Command} cmd
		* @returns {Option[]}
		*/
		visibleGlobalOptions(cmd) {
			if (!this.showGlobalOptions) return [];
			const globalOptions = [];
			for (let ancestorCmd = cmd.parent; ancestorCmd; ancestorCmd = ancestorCmd.parent) {
				const visibleOptions = ancestorCmd.options.filter((option) => !option.hidden);
				globalOptions.push(...visibleOptions);
			}
			if (this.sortOptions) globalOptions.sort(this.compareOptions);
			return globalOptions;
		}
		/**
		* Get an array of the arguments if any have a description.
		*
		* @param {Command} cmd
		* @returns {Argument[]}
		*/
		visibleArguments(cmd) {
			if (cmd._argsDescription) cmd.registeredArguments.forEach((argument) => {
				argument.description = argument.description || cmd._argsDescription[argument.name()] || "";
			});
			if (cmd.registeredArguments.find((argument) => argument.description)) return cmd.registeredArguments;
			return [];
		}
		/**
		* Get the command term to show in the list of subcommands.
		*
		* @param {Command} cmd
		* @returns {string}
		*/
		subcommandTerm(cmd) {
			const args = cmd.registeredArguments.map((arg) => humanReadableArgName(arg)).join(" ");
			return cmd._name + (cmd._aliases[0] ? "|" + cmd._aliases[0] : "") + (cmd.options.length ? " [options]" : "") + (args ? " " + args : "");
		}
		/**
		* Get the option term to show in the list of options.
		*
		* @param {Option} option
		* @returns {string}
		*/
		optionTerm(option) {
			return option.flags;
		}
		/**
		* Get the argument term to show in the list of arguments.
		*
		* @param {Argument} argument
		* @returns {string}
		*/
		argumentTerm(argument) {
			return argument.name();
		}
		/**
		* Get the longest command term length.
		*
		* @param {Command} cmd
		* @param {Help} helper
		* @returns {number}
		*/
		longestSubcommandTermLength(cmd, helper) {
			return helper.visibleCommands(cmd).reduce((max, command) => {
				return Math.max(max, this.displayWidth(helper.styleSubcommandTerm(helper.subcommandTerm(command))));
			}, 0);
		}
		/**
		* Get the longest option term length.
		*
		* @param {Command} cmd
		* @param {Help} helper
		* @returns {number}
		*/
		longestOptionTermLength(cmd, helper) {
			return helper.visibleOptions(cmd).reduce((max, option) => {
				return Math.max(max, this.displayWidth(helper.styleOptionTerm(helper.optionTerm(option))));
			}, 0);
		}
		/**
		* Get the longest global option term length.
		*
		* @param {Command} cmd
		* @param {Help} helper
		* @returns {number}
		*/
		longestGlobalOptionTermLength(cmd, helper) {
			return helper.visibleGlobalOptions(cmd).reduce((max, option) => {
				return Math.max(max, this.displayWidth(helper.styleOptionTerm(helper.optionTerm(option))));
			}, 0);
		}
		/**
		* Get the longest argument term length.
		*
		* @param {Command} cmd
		* @param {Help} helper
		* @returns {number}
		*/
		longestArgumentTermLength(cmd, helper) {
			return helper.visibleArguments(cmd).reduce((max, argument) => {
				return Math.max(max, this.displayWidth(helper.styleArgumentTerm(helper.argumentTerm(argument))));
			}, 0);
		}
		/**
		* Get the command usage to be displayed at the top of the built-in help.
		*
		* @param {Command} cmd
		* @returns {string}
		*/
		commandUsage(cmd) {
			let cmdName = cmd._name;
			if (cmd._aliases[0]) cmdName = cmdName + "|" + cmd._aliases[0];
			let ancestorCmdNames = "";
			for (let ancestorCmd = cmd.parent; ancestorCmd; ancestorCmd = ancestorCmd.parent) ancestorCmdNames = ancestorCmd.name() + " " + ancestorCmdNames;
			return ancestorCmdNames + cmdName + " " + cmd.usage();
		}
		/**
		* Get the description for the command.
		*
		* @param {Command} cmd
		* @returns {string}
		*/
		commandDescription(cmd) {
			return cmd.description();
		}
		/**
		* Get the subcommand summary to show in the list of subcommands.
		* (Fallback to description for backwards compatibility.)
		*
		* @param {Command} cmd
		* @returns {string}
		*/
		subcommandDescription(cmd) {
			return cmd.summary() || cmd.description();
		}
		/**
		* Get the option description to show in the list of options.
		*
		* @param {Option} option
		* @return {string}
		*/
		optionDescription(option) {
			const extraInfo = [];
			if (option.argChoices) extraInfo.push(`choices: ${option.argChoices.map((choice) => JSON.stringify(choice)).join(", ")}`);
			if (option.defaultValue !== void 0) {
				if (option.required || option.optional || option.isBoolean() && typeof option.defaultValue === "boolean") extraInfo.push(`default: ${option.defaultValueDescription || JSON.stringify(option.defaultValue)}`);
			}
			if (option.presetArg !== void 0 && option.optional) extraInfo.push(`preset: ${JSON.stringify(option.presetArg)}`);
			if (option.envVar !== void 0) extraInfo.push(`env: ${option.envVar}`);
			if (extraInfo.length > 0) {
				const extraDescription = `(${extraInfo.join(", ")})`;
				if (option.description) return `${option.description} ${extraDescription}`;
				return extraDescription;
			}
			return option.description;
		}
		/**
		* Get the argument description to show in the list of arguments.
		*
		* @param {Argument} argument
		* @return {string}
		*/
		argumentDescription(argument) {
			const extraInfo = [];
			if (argument.argChoices) extraInfo.push(`choices: ${argument.argChoices.map((choice) => JSON.stringify(choice)).join(", ")}`);
			if (argument.defaultValue !== void 0) extraInfo.push(`default: ${argument.defaultValueDescription || JSON.stringify(argument.defaultValue)}`);
			if (extraInfo.length > 0) {
				const extraDescription = `(${extraInfo.join(", ")})`;
				if (argument.description) return `${argument.description} ${extraDescription}`;
				return extraDescription;
			}
			return argument.description;
		}
		/**
		* Format a list of items, given a heading and an array of formatted items.
		*
		* @param {string} heading
		* @param {string[]} items
		* @param {Help} helper
		* @returns string[]
		*/
		formatItemList(heading, items, helper) {
			if (items.length === 0) return [];
			return [
				helper.styleTitle(heading),
				...items,
				""
			];
		}
		/**
		* Group items by their help group heading.
		*
		* @param {Command[] | Option[]} unsortedItems
		* @param {Command[] | Option[]} visibleItems
		* @param {Function} getGroup
		* @returns {Map<string, Command[] | Option[]>}
		*/
		groupItems(unsortedItems, visibleItems, getGroup) {
			const result = /* @__PURE__ */ new Map();
			unsortedItems.forEach((item) => {
				const group = getGroup(item);
				if (!result.has(group)) result.set(group, []);
			});
			visibleItems.forEach((item) => {
				const group = getGroup(item);
				if (!result.has(group)) result.set(group, []);
				result.get(group).push(item);
			});
			return result;
		}
		/**
		* Generate the built-in help text.
		*
		* @param {Command} cmd
		* @param {Help} helper
		* @returns {string}
		*/
		formatHelp(cmd, helper) {
			const termWidth = helper.padWidth(cmd, helper);
			const helpWidth = helper.helpWidth ?? 80;
			function callFormatItem(term, description) {
				return helper.formatItem(term, termWidth, description, helper);
			}
			let output = [`${helper.styleTitle("Usage:")} ${helper.styleUsage(helper.commandUsage(cmd))}`, ""];
			const commandDescription = helper.commandDescription(cmd);
			if (commandDescription.length > 0) output = output.concat([helper.boxWrap(helper.styleCommandDescription(commandDescription), helpWidth), ""]);
			const argumentList = helper.visibleArguments(cmd).map((argument) => {
				return callFormatItem(helper.styleArgumentTerm(helper.argumentTerm(argument)), helper.styleArgumentDescription(helper.argumentDescription(argument)));
			});
			output = output.concat(this.formatItemList("Arguments:", argumentList, helper));
			this.groupItems(cmd.options, helper.visibleOptions(cmd), (option) => option.helpGroupHeading ?? "Options:").forEach((options, group) => {
				const optionList = options.map((option) => {
					return callFormatItem(helper.styleOptionTerm(helper.optionTerm(option)), helper.styleOptionDescription(helper.optionDescription(option)));
				});
				output = output.concat(this.formatItemList(group, optionList, helper));
			});
			if (helper.showGlobalOptions) {
				const globalOptionList = helper.visibleGlobalOptions(cmd).map((option) => {
					return callFormatItem(helper.styleOptionTerm(helper.optionTerm(option)), helper.styleOptionDescription(helper.optionDescription(option)));
				});
				output = output.concat(this.formatItemList("Global Options:", globalOptionList, helper));
			}
			this.groupItems(cmd.commands, helper.visibleCommands(cmd), (sub) => sub.helpGroup() || "Commands:").forEach((commands, group) => {
				const commandList = commands.map((sub) => {
					return callFormatItem(helper.styleSubcommandTerm(helper.subcommandTerm(sub)), helper.styleSubcommandDescription(helper.subcommandDescription(sub)));
				});
				output = output.concat(this.formatItemList(group, commandList, helper));
			});
			return output.join("\n");
		}
		/**
		* Return display width of string, ignoring ANSI escape sequences. Used in padding and wrapping calculations.
		*
		* @param {string} str
		* @returns {number}
		*/
		displayWidth(str) {
			return stripColor(str).length;
		}
		/**
		* Style the title for displaying in the help. Called with 'Usage:', 'Options:', etc.
		*
		* @param {string} str
		* @returns {string}
		*/
		styleTitle(str) {
			return str;
		}
		styleUsage(str) {
			return str.split(" ").map((word) => {
				if (word === "[options]") return this.styleOptionText(word);
				if (word === "[command]") return this.styleSubcommandText(word);
				if (word[0] === "[" || word[0] === "<") return this.styleArgumentText(word);
				return this.styleCommandText(word);
			}).join(" ");
		}
		styleCommandDescription(str) {
			return this.styleDescriptionText(str);
		}
		styleOptionDescription(str) {
			return this.styleDescriptionText(str);
		}
		styleSubcommandDescription(str) {
			return this.styleDescriptionText(str);
		}
		styleArgumentDescription(str) {
			return this.styleDescriptionText(str);
		}
		styleDescriptionText(str) {
			return str;
		}
		styleOptionTerm(str) {
			return this.styleOptionText(str);
		}
		styleSubcommandTerm(str) {
			return str.split(" ").map((word) => {
				if (word === "[options]") return this.styleOptionText(word);
				if (word[0] === "[" || word[0] === "<") return this.styleArgumentText(word);
				return this.styleSubcommandText(word);
			}).join(" ");
		}
		styleArgumentTerm(str) {
			return this.styleArgumentText(str);
		}
		styleOptionText(str) {
			return str;
		}
		styleArgumentText(str) {
			return str;
		}
		styleSubcommandText(str) {
			return str;
		}
		styleCommandText(str) {
			return str;
		}
		/**
		* Calculate the pad width from the maximum term length.
		*
		* @param {Command} cmd
		* @param {Help} helper
		* @returns {number}
		*/
		padWidth(cmd, helper) {
			return Math.max(helper.longestOptionTermLength(cmd, helper), helper.longestGlobalOptionTermLength(cmd, helper), helper.longestSubcommandTermLength(cmd, helper), helper.longestArgumentTermLength(cmd, helper));
		}
		/**
		* Detect manually wrapped and indented strings by checking for line break followed by whitespace.
		*
		* @param {string} str
		* @returns {boolean}
		*/
		preformatted(str) {
			return /\n[^\S\r\n]/.test(str);
		}
		/**
		* Format the "item", which consists of a term and description. Pad the term and wrap the description, indenting the following lines.
		*
		* So "TTT", 5, "DDD DDDD DD DDD" might be formatted for this.helpWidth=17 like so:
		*   TTT  DDD DDDD
		*        DD DDD
		*
		* @param {string} term
		* @param {number} termWidth
		* @param {string} description
		* @param {Help} helper
		* @returns {string}
		*/
		formatItem(term, termWidth, description, helper) {
			const itemIndent = 2;
			const itemIndentStr = " ".repeat(itemIndent);
			if (!description) return itemIndentStr + term;
			const paddedTerm = term.padEnd(termWidth + term.length - helper.displayWidth(term));
			const spacerWidth = 2;
			const remainingWidth = (this.helpWidth ?? 80) - termWidth - spacerWidth - itemIndent;
			let formattedDescription;
			if (remainingWidth < this.minWidthToWrap || helper.preformatted(description)) formattedDescription = description;
			else formattedDescription = helper.boxWrap(description, remainingWidth).replace(/\n/g, "\n" + " ".repeat(termWidth + spacerWidth));
			return itemIndentStr + paddedTerm + " ".repeat(spacerWidth) + formattedDescription.replace(/\n/g, `\n${itemIndentStr}`);
		}
		/**
		* Wrap a string at whitespace, preserving existing line breaks.
		* Wrapping is skipped if the width is less than `minWidthToWrap`.
		*
		* @param {string} str
		* @param {number} width
		* @returns {string}
		*/
		boxWrap(str, width) {
			if (width < this.minWidthToWrap) return str;
			const rawLines = str.split(/\r\n|\n/);
			const chunkPattern = /[\s]*[^\s]+/g;
			const wrappedLines = [];
			rawLines.forEach((line) => {
				const chunks = line.match(chunkPattern);
				if (chunks === null) {
					wrappedLines.push("");
					return;
				}
				let sumChunks = [chunks.shift()];
				let sumWidth = this.displayWidth(sumChunks[0]);
				chunks.forEach((chunk) => {
					const visibleWidth = this.displayWidth(chunk);
					if (sumWidth + visibleWidth <= width) {
						sumChunks.push(chunk);
						sumWidth += visibleWidth;
						return;
					}
					wrappedLines.push(sumChunks.join(""));
					const nextChunk = chunk.trimStart();
					sumChunks = [nextChunk];
					sumWidth = this.displayWidth(nextChunk);
				});
				wrappedLines.push(sumChunks.join(""));
			});
			return wrappedLines.join("\n");
		}
	};
	/**
	* Strip style ANSI escape sequences from the string. In particular, SGR (Select Graphic Rendition) codes.
	*
	* @param {string} str
	* @returns {string}
	* @package
	*/
	function stripColor(str) {
		return str.replace(/\x1b\[\d*(;\d*)*m/g, "");
	}
	exports.Help = Help;
	exports.stripColor = stripColor;
}));

//#endregion
//#region ../../node_modules/.pnpm/commander@14.0.3/node_modules/commander/lib/option.js
var require_option = /* @__PURE__ */ __commonJSMin(((exports) => {
	const { InvalidArgumentError } = require_error();
	var Option = class {
		/**
		* Initialize a new `Option` with the given `flags` and `description`.
		*
		* @param {string} flags
		* @param {string} [description]
		*/
		constructor(flags, description) {
			this.flags = flags;
			this.description = description || "";
			this.required = flags.includes("<");
			this.optional = flags.includes("[");
			this.variadic = /\w\.\.\.[>\]]$/.test(flags);
			this.mandatory = false;
			const optionFlags = splitOptionFlags(flags);
			this.short = optionFlags.shortFlag;
			this.long = optionFlags.longFlag;
			this.negate = false;
			if (this.long) this.negate = this.long.startsWith("--no-");
			this.defaultValue = void 0;
			this.defaultValueDescription = void 0;
			this.presetArg = void 0;
			this.envVar = void 0;
			this.parseArg = void 0;
			this.hidden = false;
			this.argChoices = void 0;
			this.conflictsWith = [];
			this.implied = void 0;
			this.helpGroupHeading = void 0;
		}
		/**
		* Set the default value, and optionally supply the description to be displayed in the help.
		*
		* @param {*} value
		* @param {string} [description]
		* @return {Option}
		*/
		default(value, description) {
			this.defaultValue = value;
			this.defaultValueDescription = description;
			return this;
		}
		/**
		* Preset to use when option used without option-argument, especially optional but also boolean and negated.
		* The custom processing (parseArg) is called.
		*
		* @example
		* new Option('--color').default('GREYSCALE').preset('RGB');
		* new Option('--donate [amount]').preset('20').argParser(parseFloat);
		*
		* @param {*} arg
		* @return {Option}
		*/
		preset(arg) {
			this.presetArg = arg;
			return this;
		}
		/**
		* Add option name(s) that conflict with this option.
		* An error will be displayed if conflicting options are found during parsing.
		*
		* @example
		* new Option('--rgb').conflicts('cmyk');
		* new Option('--js').conflicts(['ts', 'jsx']);
		*
		* @param {(string | string[])} names
		* @return {Option}
		*/
		conflicts(names) {
			this.conflictsWith = this.conflictsWith.concat(names);
			return this;
		}
		/**
		* Specify implied option values for when this option is set and the implied options are not.
		*
		* The custom processing (parseArg) is not called on the implied values.
		*
		* @example
		* program
		*   .addOption(new Option('--log', 'write logging information to file'))
		*   .addOption(new Option('--trace', 'log extra details').implies({ log: 'trace.txt' }));
		*
		* @param {object} impliedOptionValues
		* @return {Option}
		*/
		implies(impliedOptionValues) {
			let newImplied = impliedOptionValues;
			if (typeof impliedOptionValues === "string") newImplied = { [impliedOptionValues]: true };
			this.implied = Object.assign(this.implied || {}, newImplied);
			return this;
		}
		/**
		* Set environment variable to check for option value.
		*
		* An environment variable is only used if when processed the current option value is
		* undefined, or the source of the current value is 'default' or 'config' or 'env'.
		*
		* @param {string} name
		* @return {Option}
		*/
		env(name) {
			this.envVar = name;
			return this;
		}
		/**
		* Set the custom handler for processing CLI option arguments into option values.
		*
		* @param {Function} [fn]
		* @return {Option}
		*/
		argParser(fn) {
			this.parseArg = fn;
			return this;
		}
		/**
		* Whether the option is mandatory and must have a value after parsing.
		*
		* @param {boolean} [mandatory=true]
		* @return {Option}
		*/
		makeOptionMandatory(mandatory = true) {
			this.mandatory = !!mandatory;
			return this;
		}
		/**
		* Hide option in help.
		*
		* @param {boolean} [hide=true]
		* @return {Option}
		*/
		hideHelp(hide = true) {
			this.hidden = !!hide;
			return this;
		}
		/**
		* @package
		*/
		_collectValue(value, previous) {
			if (previous === this.defaultValue || !Array.isArray(previous)) return [value];
			previous.push(value);
			return previous;
		}
		/**
		* Only allow option value to be one of choices.
		*
		* @param {string[]} values
		* @return {Option}
		*/
		choices(values) {
			this.argChoices = values.slice();
			this.parseArg = (arg, previous) => {
				if (!this.argChoices.includes(arg)) throw new InvalidArgumentError(`Allowed choices are ${this.argChoices.join(", ")}.`);
				if (this.variadic) return this._collectValue(arg, previous);
				return arg;
			};
			return this;
		}
		/**
		* Return option name.
		*
		* @return {string}
		*/
		name() {
			if (this.long) return this.long.replace(/^--/, "");
			return this.short.replace(/^-/, "");
		}
		/**
		* Return option name, in a camelcase format that can be used
		* as an object attribute key.
		*
		* @return {string}
		*/
		attributeName() {
			if (this.negate) return camelcase(this.name().replace(/^no-/, ""));
			return camelcase(this.name());
		}
		/**
		* Set the help group heading.
		*
		* @param {string} heading
		* @return {Option}
		*/
		helpGroup(heading) {
			this.helpGroupHeading = heading;
			return this;
		}
		/**
		* Check if `arg` matches the short or long flag.
		*
		* @param {string} arg
		* @return {boolean}
		* @package
		*/
		is(arg) {
			return this.short === arg || this.long === arg;
		}
		/**
		* Return whether a boolean option.
		*
		* Options are one of boolean, negated, required argument, or optional argument.
		*
		* @return {boolean}
		* @package
		*/
		isBoolean() {
			return !this.required && !this.optional && !this.negate;
		}
	};
	/**
	* This class is to make it easier to work with dual options, without changing the existing
	* implementation. We support separate dual options for separate positive and negative options,
	* like `--build` and `--no-build`, which share a single option value. This works nicely for some
	* use cases, but is tricky for others where we want separate behaviours despite
	* the single shared option value.
	*/
	var DualOptions = class {
		/**
		* @param {Option[]} options
		*/
		constructor(options) {
			this.positiveOptions = /* @__PURE__ */ new Map();
			this.negativeOptions = /* @__PURE__ */ new Map();
			this.dualOptions = /* @__PURE__ */ new Set();
			options.forEach((option) => {
				if (option.negate) this.negativeOptions.set(option.attributeName(), option);
				else this.positiveOptions.set(option.attributeName(), option);
			});
			this.negativeOptions.forEach((value, key) => {
				if (this.positiveOptions.has(key)) this.dualOptions.add(key);
			});
		}
		/**
		* Did the value come from the option, and not from possible matching dual option?
		*
		* @param {*} value
		* @param {Option} option
		* @returns {boolean}
		*/
		valueFromOption(value, option) {
			const optionKey = option.attributeName();
			if (!this.dualOptions.has(optionKey)) return true;
			const preset = this.negativeOptions.get(optionKey).presetArg;
			const negativeValue = preset !== void 0 ? preset : false;
			return option.negate === (negativeValue === value);
		}
	};
	/**
	* Convert string from kebab-case to camelCase.
	*
	* @param {string} str
	* @return {string}
	* @private
	*/
	function camelcase(str) {
		return str.split("-").reduce((str, word) => {
			return str + word[0].toUpperCase() + word.slice(1);
		});
	}
	/**
	* Split the short and long flag out of something like '-m,--mixed <value>'
	*
	* @private
	*/
	function splitOptionFlags(flags) {
		let shortFlag;
		let longFlag;
		const shortFlagExp = /^-[^-]$/;
		const longFlagExp = /^--[^-]/;
		const flagParts = flags.split(/[ |,]+/).concat("guard");
		if (shortFlagExp.test(flagParts[0])) shortFlag = flagParts.shift();
		if (longFlagExp.test(flagParts[0])) longFlag = flagParts.shift();
		if (!shortFlag && shortFlagExp.test(flagParts[0])) shortFlag = flagParts.shift();
		if (!shortFlag && longFlagExp.test(flagParts[0])) {
			shortFlag = longFlag;
			longFlag = flagParts.shift();
		}
		if (flagParts[0].startsWith("-")) {
			const unsupportedFlag = flagParts[0];
			const baseError = `option creation failed due to '${unsupportedFlag}' in option flags '${flags}'`;
			if (/^-[^-][^-]/.test(unsupportedFlag)) throw new Error(`${baseError}
- a short flag is a single dash and a single character
  - either use a single dash and a single character (for a short flag)
  - or use a double dash for a long option (and can have two, like '--ws, --workspace')`);
			if (shortFlagExp.test(unsupportedFlag)) throw new Error(`${baseError}
- too many short flags`);
			if (longFlagExp.test(unsupportedFlag)) throw new Error(`${baseError}
- too many long flags`);
			throw new Error(`${baseError}
- unrecognised flag format`);
		}
		if (shortFlag === void 0 && longFlag === void 0) throw new Error(`option creation failed due to no flags found in '${flags}'.`);
		return {
			shortFlag,
			longFlag
		};
	}
	exports.Option = Option;
	exports.DualOptions = DualOptions;
}));

//#endregion
//#region ../../node_modules/.pnpm/commander@14.0.3/node_modules/commander/lib/suggestSimilar.js
var require_suggestSimilar = /* @__PURE__ */ __commonJSMin(((exports) => {
	const maxDistance = 3;
	function editDistance(a, b) {
		if (Math.abs(a.length - b.length) > maxDistance) return Math.max(a.length, b.length);
		const d = [];
		for (let i = 0; i <= a.length; i++) d[i] = [i];
		for (let j = 0; j <= b.length; j++) d[0][j] = j;
		for (let j = 1; j <= b.length; j++) for (let i = 1; i <= a.length; i++) {
			let cost = 1;
			if (a[i - 1] === b[j - 1]) cost = 0;
			else cost = 1;
			d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
			if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
		}
		return d[a.length][b.length];
	}
	/**
	* Find close matches, restricted to same number of edits.
	*
	* @param {string} word
	* @param {string[]} candidates
	* @returns {string}
	*/
	function suggestSimilar(word, candidates) {
		if (!candidates || candidates.length === 0) return "";
		candidates = Array.from(new Set(candidates));
		const searchingOptions = word.startsWith("--");
		if (searchingOptions) {
			word = word.slice(2);
			candidates = candidates.map((candidate) => candidate.slice(2));
		}
		let similar = [];
		let bestDistance = maxDistance;
		const minSimilarity = .4;
		candidates.forEach((candidate) => {
			if (candidate.length <= 1) return;
			const distance = editDistance(word, candidate);
			const length = Math.max(word.length, candidate.length);
			if ((length - distance) / length > minSimilarity) {
				if (distance < bestDistance) {
					bestDistance = distance;
					similar = [candidate];
				} else if (distance === bestDistance) similar.push(candidate);
			}
		});
		similar.sort((a, b) => a.localeCompare(b));
		if (searchingOptions) similar = similar.map((candidate) => `--${candidate}`);
		if (similar.length > 1) return `\n(Did you mean one of ${similar.join(", ")}?)`;
		if (similar.length === 1) return `\n(Did you mean ${similar[0]}?)`;
		return "";
	}
	exports.suggestSimilar = suggestSimilar;
}));

//#endregion
//#region ../../node_modules/.pnpm/commander@14.0.3/node_modules/commander/lib/command.js
var require_command = /* @__PURE__ */ __commonJSMin(((exports) => {
	const EventEmitter$2 = __require$1("node:events").EventEmitter;
	const childProcess = __require$1("node:child_process");
	const path = __require$1("node:path");
	const fs = __require$1("node:fs");
	const process$3 = __require$1("node:process");
	const { Argument, humanReadableArgName } = require_argument();
	const { CommanderError } = require_error();
	const { Help, stripColor } = require_help();
	const { Option, DualOptions } = require_option();
	const { suggestSimilar } = require_suggestSimilar();
	var Command = class Command extends EventEmitter$2 {
		/**
		* Initialize a new `Command`.
		*
		* @param {string} [name]
		*/
		constructor(name) {
			super();
			/** @type {Command[]} */
			this.commands = [];
			/** @type {Option[]} */
			this.options = [];
			this.parent = null;
			this._allowUnknownOption = false;
			this._allowExcessArguments = false;
			/** @type {Argument[]} */
			this.registeredArguments = [];
			this._args = this.registeredArguments;
			/** @type {string[]} */
			this.args = [];
			this.rawArgs = [];
			this.processedArgs = [];
			this._scriptPath = null;
			this._name = name || "";
			this._optionValues = {};
			this._optionValueSources = {};
			this._storeOptionsAsProperties = false;
			this._actionHandler = null;
			this._executableHandler = false;
			this._executableFile = null;
			this._executableDir = null;
			this._defaultCommandName = null;
			this._exitCallback = null;
			this._aliases = [];
			this._combineFlagAndOptionalValue = true;
			this._description = "";
			this._summary = "";
			this._argsDescription = void 0;
			this._enablePositionalOptions = false;
			this._passThroughOptions = false;
			this._lifeCycleHooks = {};
			/** @type {(boolean | string)} */
			this._showHelpAfterError = false;
			this._showSuggestionAfterError = true;
			this._savedState = null;
			this._outputConfiguration = {
				writeOut: (str) => process$3.stdout.write(str),
				writeErr: (str) => process$3.stderr.write(str),
				outputError: (str, write) => write(str),
				getOutHelpWidth: () => process$3.stdout.isTTY ? process$3.stdout.columns : void 0,
				getErrHelpWidth: () => process$3.stderr.isTTY ? process$3.stderr.columns : void 0,
				getOutHasColors: () => useColor() ?? (process$3.stdout.isTTY && process$3.stdout.hasColors?.()),
				getErrHasColors: () => useColor() ?? (process$3.stderr.isTTY && process$3.stderr.hasColors?.()),
				stripColor: (str) => stripColor(str)
			};
			this._hidden = false;
			/** @type {(Option | null | undefined)} */
			this._helpOption = void 0;
			this._addImplicitHelpCommand = void 0;
			/** @type {Command} */
			this._helpCommand = void 0;
			this._helpConfiguration = {};
			/** @type {string | undefined} */
			this._helpGroupHeading = void 0;
			/** @type {string | undefined} */
			this._defaultCommandGroup = void 0;
			/** @type {string | undefined} */
			this._defaultOptionGroup = void 0;
		}
		/**
		* Copy settings that are useful to have in common across root command and subcommands.
		*
		* (Used internally when adding a command using `.command()` so subcommands inherit parent settings.)
		*
		* @param {Command} sourceCommand
		* @return {Command} `this` command for chaining
		*/
		copyInheritedSettings(sourceCommand) {
			this._outputConfiguration = sourceCommand._outputConfiguration;
			this._helpOption = sourceCommand._helpOption;
			this._helpCommand = sourceCommand._helpCommand;
			this._helpConfiguration = sourceCommand._helpConfiguration;
			this._exitCallback = sourceCommand._exitCallback;
			this._storeOptionsAsProperties = sourceCommand._storeOptionsAsProperties;
			this._combineFlagAndOptionalValue = sourceCommand._combineFlagAndOptionalValue;
			this._allowExcessArguments = sourceCommand._allowExcessArguments;
			this._enablePositionalOptions = sourceCommand._enablePositionalOptions;
			this._showHelpAfterError = sourceCommand._showHelpAfterError;
			this._showSuggestionAfterError = sourceCommand._showSuggestionAfterError;
			return this;
		}
		/**
		* @returns {Command[]}
		* @private
		*/
		_getCommandAndAncestors() {
			const result = [];
			for (let command = this; command; command = command.parent) result.push(command);
			return result;
		}
		/**
		* Define a command.
		*
		* There are two styles of command: pay attention to where to put the description.
		*
		* @example
		* // Command implemented using action handler (description is supplied separately to `.command`)
		* program
		*   .command('clone <source> [destination]')
		*   .description('clone a repository into a newly created directory')
		*   .action((source, destination) => {
		*     console.log('clone command called');
		*   });
		*
		* // Command implemented using separate executable file (description is second parameter to `.command`)
		* program
		*   .command('start <service>', 'start named service')
		*   .command('stop [service]', 'stop named service, or all if no name supplied');
		*
		* @param {string} nameAndArgs - command name and arguments, args are `<required>` or `[optional]` and last may also be `variadic...`
		* @param {(object | string)} [actionOptsOrExecDesc] - configuration options (for action), or description (for executable)
		* @param {object} [execOpts] - configuration options (for executable)
		* @return {Command} returns new command for action handler, or `this` for executable command
		*/
		command(nameAndArgs, actionOptsOrExecDesc, execOpts) {
			let desc = actionOptsOrExecDesc;
			let opts = execOpts;
			if (typeof desc === "object" && desc !== null) {
				opts = desc;
				desc = null;
			}
			opts = opts || {};
			const [, name, args] = nameAndArgs.match(/([^ ]+) *(.*)/);
			const cmd = this.createCommand(name);
			if (desc) {
				cmd.description(desc);
				cmd._executableHandler = true;
			}
			if (opts.isDefault) this._defaultCommandName = cmd._name;
			cmd._hidden = !!(opts.noHelp || opts.hidden);
			cmd._executableFile = opts.executableFile || null;
			if (args) cmd.arguments(args);
			this._registerCommand(cmd);
			cmd.parent = this;
			cmd.copyInheritedSettings(this);
			if (desc) return this;
			return cmd;
		}
		/**
		* Factory routine to create a new unattached command.
		*
		* See .command() for creating an attached subcommand, which uses this routine to
		* create the command. You can override createCommand to customise subcommands.
		*
		* @param {string} [name]
		* @return {Command} new command
		*/
		createCommand(name) {
			return new Command(name);
		}
		/**
		* You can customise the help with a subclass of Help by overriding createHelp,
		* or by overriding Help properties using configureHelp().
		*
		* @return {Help}
		*/
		createHelp() {
			return Object.assign(new Help(), this.configureHelp());
		}
		/**
		* You can customise the help by overriding Help properties using configureHelp(),
		* or with a subclass of Help by overriding createHelp().
		*
		* @param {object} [configuration] - configuration options
		* @return {(Command | object)} `this` command for chaining, or stored configuration
		*/
		configureHelp(configuration) {
			if (configuration === void 0) return this._helpConfiguration;
			this._helpConfiguration = configuration;
			return this;
		}
		/**
		* The default output goes to stdout and stderr. You can customise this for special
		* applications. You can also customise the display of errors by overriding outputError.
		*
		* The configuration properties are all functions:
		*
		*     // change how output being written, defaults to stdout and stderr
		*     writeOut(str)
		*     writeErr(str)
		*     // change how output being written for errors, defaults to writeErr
		*     outputError(str, write) // used for displaying errors and not used for displaying help
		*     // specify width for wrapping help
		*     getOutHelpWidth()
		*     getErrHelpWidth()
		*     // color support, currently only used with Help
		*     getOutHasColors()
		*     getErrHasColors()
		*     stripColor() // used to remove ANSI escape codes if output does not have colors
		*
		* @param {object} [configuration] - configuration options
		* @return {(Command | object)} `this` command for chaining, or stored configuration
		*/
		configureOutput(configuration) {
			if (configuration === void 0) return this._outputConfiguration;
			this._outputConfiguration = {
				...this._outputConfiguration,
				...configuration
			};
			return this;
		}
		/**
		* Display the help or a custom message after an error occurs.
		*
		* @param {(boolean|string)} [displayHelp]
		* @return {Command} `this` command for chaining
		*/
		showHelpAfterError(displayHelp = true) {
			if (typeof displayHelp !== "string") displayHelp = !!displayHelp;
			this._showHelpAfterError = displayHelp;
			return this;
		}
		/**
		* Display suggestion of similar commands for unknown commands, or options for unknown options.
		*
		* @param {boolean} [displaySuggestion]
		* @return {Command} `this` command for chaining
		*/
		showSuggestionAfterError(displaySuggestion = true) {
			this._showSuggestionAfterError = !!displaySuggestion;
			return this;
		}
		/**
		* Add a prepared subcommand.
		*
		* See .command() for creating an attached subcommand which inherits settings from its parent.
		*
		* @param {Command} cmd - new subcommand
		* @param {object} [opts] - configuration options
		* @return {Command} `this` command for chaining
		*/
		addCommand(cmd, opts) {
			if (!cmd._name) throw new Error(`Command passed to .addCommand() must have a name
- specify the name in Command constructor or using .name()`);
			opts = opts || {};
			if (opts.isDefault) this._defaultCommandName = cmd._name;
			if (opts.noHelp || opts.hidden) cmd._hidden = true;
			this._registerCommand(cmd);
			cmd.parent = this;
			cmd._checkForBrokenPassThrough();
			return this;
		}
		/**
		* Factory routine to create a new unattached argument.
		*
		* See .argument() for creating an attached argument, which uses this routine to
		* create the argument. You can override createArgument to return a custom argument.
		*
		* @param {string} name
		* @param {string} [description]
		* @return {Argument} new argument
		*/
		createArgument(name, description) {
			return new Argument(name, description);
		}
		/**
		* Define argument syntax for command.
		*
		* The default is that the argument is required, and you can explicitly
		* indicate this with <> around the name. Put [] around the name for an optional argument.
		*
		* @example
		* program.argument('<input-file>');
		* program.argument('[output-file]');
		*
		* @param {string} name
		* @param {string} [description]
		* @param {(Function|*)} [parseArg] - custom argument processing function or default value
		* @param {*} [defaultValue]
		* @return {Command} `this` command for chaining
		*/
		argument(name, description, parseArg, defaultValue) {
			const argument = this.createArgument(name, description);
			if (typeof parseArg === "function") argument.default(defaultValue).argParser(parseArg);
			else argument.default(parseArg);
			this.addArgument(argument);
			return this;
		}
		/**
		* Define argument syntax for command, adding multiple at once (without descriptions).
		*
		* See also .argument().
		*
		* @example
		* program.arguments('<cmd> [env]');
		*
		* @param {string} names
		* @return {Command} `this` command for chaining
		*/
		arguments(names) {
			names.trim().split(/ +/).forEach((detail) => {
				this.argument(detail);
			});
			return this;
		}
		/**
		* Define argument syntax for command, adding a prepared argument.
		*
		* @param {Argument} argument
		* @return {Command} `this` command for chaining
		*/
		addArgument(argument) {
			const previousArgument = this.registeredArguments.slice(-1)[0];
			if (previousArgument?.variadic) throw new Error(`only the last argument can be variadic '${previousArgument.name()}'`);
			if (argument.required && argument.defaultValue !== void 0 && argument.parseArg === void 0) throw new Error(`a default value for a required argument is never used: '${argument.name()}'`);
			this.registeredArguments.push(argument);
			return this;
		}
		/**
		* Customise or override default help command. By default a help command is automatically added if your command has subcommands.
		*
		* @example
		*    program.helpCommand('help [cmd]');
		*    program.helpCommand('help [cmd]', 'show help');
		*    program.helpCommand(false); // suppress default help command
		*    program.helpCommand(true); // add help command even if no subcommands
		*
		* @param {string|boolean} enableOrNameAndArgs - enable with custom name and/or arguments, or boolean to override whether added
		* @param {string} [description] - custom description
		* @return {Command} `this` command for chaining
		*/
		helpCommand(enableOrNameAndArgs, description) {
			if (typeof enableOrNameAndArgs === "boolean") {
				this._addImplicitHelpCommand = enableOrNameAndArgs;
				if (enableOrNameAndArgs && this._defaultCommandGroup) this._initCommandGroup(this._getHelpCommand());
				return this;
			}
			const [, helpName, helpArgs] = (enableOrNameAndArgs ?? "help [command]").match(/([^ ]+) *(.*)/);
			const helpDescription = description ?? "display help for command";
			const helpCommand = this.createCommand(helpName);
			helpCommand.helpOption(false);
			if (helpArgs) helpCommand.arguments(helpArgs);
			if (helpDescription) helpCommand.description(helpDescription);
			this._addImplicitHelpCommand = true;
			this._helpCommand = helpCommand;
			if (enableOrNameAndArgs || description) this._initCommandGroup(helpCommand);
			return this;
		}
		/**
		* Add prepared custom help command.
		*
		* @param {(Command|string|boolean)} helpCommand - custom help command, or deprecated enableOrNameAndArgs as for `.helpCommand()`
		* @param {string} [deprecatedDescription] - deprecated custom description used with custom name only
		* @return {Command} `this` command for chaining
		*/
		addHelpCommand(helpCommand, deprecatedDescription) {
			if (typeof helpCommand !== "object") {
				this.helpCommand(helpCommand, deprecatedDescription);
				return this;
			}
			this._addImplicitHelpCommand = true;
			this._helpCommand = helpCommand;
			this._initCommandGroup(helpCommand);
			return this;
		}
		/**
		* Lazy create help command.
		*
		* @return {(Command|null)}
		* @package
		*/
		_getHelpCommand() {
			if (this._addImplicitHelpCommand ?? (this.commands.length && !this._actionHandler && !this._findCommand("help"))) {
				if (this._helpCommand === void 0) this.helpCommand(void 0, void 0);
				return this._helpCommand;
			}
			return null;
		}
		/**
		* Add hook for life cycle event.
		*
		* @param {string} event
		* @param {Function} listener
		* @return {Command} `this` command for chaining
		*/
		hook(event, listener) {
			const allowedValues = [
				"preSubcommand",
				"preAction",
				"postAction"
			];
			if (!allowedValues.includes(event)) throw new Error(`Unexpected value for event passed to hook : '${event}'.
Expecting one of '${allowedValues.join("', '")}'`);
			if (this._lifeCycleHooks[event]) this._lifeCycleHooks[event].push(listener);
			else this._lifeCycleHooks[event] = [listener];
			return this;
		}
		/**
		* Register callback to use as replacement for calling process.exit.
		*
		* @param {Function} [fn] optional callback which will be passed a CommanderError, defaults to throwing
		* @return {Command} `this` command for chaining
		*/
		exitOverride(fn) {
			if (fn) this._exitCallback = fn;
			else this._exitCallback = (err) => {
				if (err.code !== "commander.executeSubCommandAsync") throw err;
			};
			return this;
		}
		/**
		* Call process.exit, and _exitCallback if defined.
		*
		* @param {number} exitCode exit code for using with process.exit
		* @param {string} code an id string representing the error
		* @param {string} message human-readable description of the error
		* @return never
		* @private
		*/
		_exit(exitCode, code, message) {
			if (this._exitCallback) this._exitCallback(new CommanderError(exitCode, code, message));
			process$3.exit(exitCode);
		}
		/**
		* Register callback `fn` for the command.
		*
		* @example
		* program
		*   .command('serve')
		*   .description('start service')
		*   .action(function() {
		*      // do work here
		*   });
		*
		* @param {Function} fn
		* @return {Command} `this` command for chaining
		*/
		action(fn) {
			const listener = (args) => {
				const expectedArgsCount = this.registeredArguments.length;
				const actionArgs = args.slice(0, expectedArgsCount);
				if (this._storeOptionsAsProperties) actionArgs[expectedArgsCount] = this;
				else actionArgs[expectedArgsCount] = this.opts();
				actionArgs.push(this);
				return fn.apply(this, actionArgs);
			};
			this._actionHandler = listener;
			return this;
		}
		/**
		* Factory routine to create a new unattached option.
		*
		* See .option() for creating an attached option, which uses this routine to
		* create the option. You can override createOption to return a custom option.
		*
		* @param {string} flags
		* @param {string} [description]
		* @return {Option} new option
		*/
		createOption(flags, description) {
			return new Option(flags, description);
		}
		/**
		* Wrap parseArgs to catch 'commander.invalidArgument'.
		*
		* @param {(Option | Argument)} target
		* @param {string} value
		* @param {*} previous
		* @param {string} invalidArgumentMessage
		* @private
		*/
		_callParseArg(target, value, previous, invalidArgumentMessage) {
			try {
				return target.parseArg(value, previous);
			} catch (err) {
				if (err.code === "commander.invalidArgument") {
					const message = `${invalidArgumentMessage} ${err.message}`;
					this.error(message, {
						exitCode: err.exitCode,
						code: err.code
					});
				}
				throw err;
			}
		}
		/**
		* Check for option flag conflicts.
		* Register option if no conflicts found, or throw on conflict.
		*
		* @param {Option} option
		* @private
		*/
		_registerOption(option) {
			const matchingOption = option.short && this._findOption(option.short) || option.long && this._findOption(option.long);
			if (matchingOption) {
				const matchingFlag = option.long && this._findOption(option.long) ? option.long : option.short;
				throw new Error(`Cannot add option '${option.flags}'${this._name && ` to command '${this._name}'`} due to conflicting flag '${matchingFlag}'
-  already used by option '${matchingOption.flags}'`);
			}
			this._initOptionGroup(option);
			this.options.push(option);
		}
		/**
		* Check for command name and alias conflicts with existing commands.
		* Register command if no conflicts found, or throw on conflict.
		*
		* @param {Command} command
		* @private
		*/
		_registerCommand(command) {
			const knownBy = (cmd) => {
				return [cmd.name()].concat(cmd.aliases());
			};
			const alreadyUsed = knownBy(command).find((name) => this._findCommand(name));
			if (alreadyUsed) {
				const existingCmd = knownBy(this._findCommand(alreadyUsed)).join("|");
				const newCmd = knownBy(command).join("|");
				throw new Error(`cannot add command '${newCmd}' as already have command '${existingCmd}'`);
			}
			this._initCommandGroup(command);
			this.commands.push(command);
		}
		/**
		* Add an option.
		*
		* @param {Option} option
		* @return {Command} `this` command for chaining
		*/
		addOption(option) {
			this._registerOption(option);
			const oname = option.name();
			const name = option.attributeName();
			if (option.negate) {
				const positiveLongFlag = option.long.replace(/^--no-/, "--");
				if (!this._findOption(positiveLongFlag)) this.setOptionValueWithSource(name, option.defaultValue === void 0 ? true : option.defaultValue, "default");
			} else if (option.defaultValue !== void 0) this.setOptionValueWithSource(name, option.defaultValue, "default");
			const handleOptionValue = (val, invalidValueMessage, valueSource) => {
				if (val == null && option.presetArg !== void 0) val = option.presetArg;
				const oldValue = this.getOptionValue(name);
				if (val !== null && option.parseArg) val = this._callParseArg(option, val, oldValue, invalidValueMessage);
				else if (val !== null && option.variadic) val = option._collectValue(val, oldValue);
				if (val == null) if (option.negate) val = false;
				else if (option.isBoolean() || option.optional) val = true;
				else val = "";
				this.setOptionValueWithSource(name, val, valueSource);
			};
			this.on("option:" + oname, (val) => {
				handleOptionValue(val, `error: option '${option.flags}' argument '${val}' is invalid.`, "cli");
			});
			if (option.envVar) this.on("optionEnv:" + oname, (val) => {
				handleOptionValue(val, `error: option '${option.flags}' value '${val}' from env '${option.envVar}' is invalid.`, "env");
			});
			return this;
		}
		/**
		* Internal implementation shared by .option() and .requiredOption()
		*
		* @return {Command} `this` command for chaining
		* @private
		*/
		_optionEx(config, flags, description, fn, defaultValue) {
			if (typeof flags === "object" && flags instanceof Option) throw new Error("To add an Option object use addOption() instead of option() or requiredOption()");
			const option = this.createOption(flags, description);
			option.makeOptionMandatory(!!config.mandatory);
			if (typeof fn === "function") option.default(defaultValue).argParser(fn);
			else if (fn instanceof RegExp) {
				const regex = fn;
				fn = (val, def) => {
					const m = regex.exec(val);
					return m ? m[0] : def;
				};
				option.default(defaultValue).argParser(fn);
			} else option.default(fn);
			return this.addOption(option);
		}
		/**
		* Define option with `flags`, `description`, and optional argument parsing function or `defaultValue` or both.
		*
		* The `flags` string contains the short and/or long flags, separated by comma, a pipe or space. A required
		* option-argument is indicated by `<>` and an optional option-argument by `[]`.
		*
		* See the README for more details, and see also addOption() and requiredOption().
		*
		* @example
		* program
		*     .option('-p, --pepper', 'add pepper')
		*     .option('--pt, --pizza-type <TYPE>', 'type of pizza') // required option-argument
		*     .option('-c, --cheese [CHEESE]', 'add extra cheese', 'mozzarella') // optional option-argument with default
		*     .option('-t, --tip <VALUE>', 'add tip to purchase cost', parseFloat) // custom parse function
		*
		* @param {string} flags
		* @param {string} [description]
		* @param {(Function|*)} [parseArg] - custom option processing function or default value
		* @param {*} [defaultValue]
		* @return {Command} `this` command for chaining
		*/
		option(flags, description, parseArg, defaultValue) {
			return this._optionEx({}, flags, description, parseArg, defaultValue);
		}
		/**
		* Add a required option which must have a value after parsing. This usually means
		* the option must be specified on the command line. (Otherwise the same as .option().)
		*
		* The `flags` string contains the short and/or long flags, separated by comma, a pipe or space.
		*
		* @param {string} flags
		* @param {string} [description]
		* @param {(Function|*)} [parseArg] - custom option processing function or default value
		* @param {*} [defaultValue]
		* @return {Command} `this` command for chaining
		*/
		requiredOption(flags, description, parseArg, defaultValue) {
			return this._optionEx({ mandatory: true }, flags, description, parseArg, defaultValue);
		}
		/**
		* Alter parsing of short flags with optional values.
		*
		* @example
		* // for `.option('-f,--flag [value]'):
		* program.combineFlagAndOptionalValue(true);  // `-f80` is treated like `--flag=80`, this is the default behaviour
		* program.combineFlagAndOptionalValue(false) // `-fb` is treated like `-f -b`
		*
		* @param {boolean} [combine] - if `true` or omitted, an optional value can be specified directly after the flag.
		* @return {Command} `this` command for chaining
		*/
		combineFlagAndOptionalValue(combine = true) {
			this._combineFlagAndOptionalValue = !!combine;
			return this;
		}
		/**
		* Allow unknown options on the command line.
		*
		* @param {boolean} [allowUnknown] - if `true` or omitted, no error will be thrown for unknown options.
		* @return {Command} `this` command for chaining
		*/
		allowUnknownOption(allowUnknown = true) {
			this._allowUnknownOption = !!allowUnknown;
			return this;
		}
		/**
		* Allow excess command-arguments on the command line. Pass false to make excess arguments an error.
		*
		* @param {boolean} [allowExcess] - if `true` or omitted, no error will be thrown for excess arguments.
		* @return {Command} `this` command for chaining
		*/
		allowExcessArguments(allowExcess = true) {
			this._allowExcessArguments = !!allowExcess;
			return this;
		}
		/**
		* Enable positional options. Positional means global options are specified before subcommands which lets
		* subcommands reuse the same option names, and also enables subcommands to turn on passThroughOptions.
		* The default behaviour is non-positional and global options may appear anywhere on the command line.
		*
		* @param {boolean} [positional]
		* @return {Command} `this` command for chaining
		*/
		enablePositionalOptions(positional = true) {
			this._enablePositionalOptions = !!positional;
			return this;
		}
		/**
		* Pass through options that come after command-arguments rather than treat them as command-options,
		* so actual command-options come before command-arguments. Turning this on for a subcommand requires
		* positional options to have been enabled on the program (parent commands).
		* The default behaviour is non-positional and options may appear before or after command-arguments.
		*
		* @param {boolean} [passThrough] for unknown options.
		* @return {Command} `this` command for chaining
		*/
		passThroughOptions(passThrough = true) {
			this._passThroughOptions = !!passThrough;
			this._checkForBrokenPassThrough();
			return this;
		}
		/**
		* @private
		*/
		_checkForBrokenPassThrough() {
			if (this.parent && this._passThroughOptions && !this.parent._enablePositionalOptions) throw new Error(`passThroughOptions cannot be used for '${this._name}' without turning on enablePositionalOptions for parent command(s)`);
		}
		/**
		* Whether to store option values as properties on command object,
		* or store separately (specify false). In both cases the option values can be accessed using .opts().
		*
		* @param {boolean} [storeAsProperties=true]
		* @return {Command} `this` command for chaining
		*/
		storeOptionsAsProperties(storeAsProperties = true) {
			if (this.options.length) throw new Error("call .storeOptionsAsProperties() before adding options");
			if (Object.keys(this._optionValues).length) throw new Error("call .storeOptionsAsProperties() before setting option values");
			this._storeOptionsAsProperties = !!storeAsProperties;
			return this;
		}
		/**
		* Retrieve option value.
		*
		* @param {string} key
		* @return {object} value
		*/
		getOptionValue(key) {
			if (this._storeOptionsAsProperties) return this[key];
			return this._optionValues[key];
		}
		/**
		* Store option value.
		*
		* @param {string} key
		* @param {object} value
		* @return {Command} `this` command for chaining
		*/
		setOptionValue(key, value) {
			return this.setOptionValueWithSource(key, value, void 0);
		}
		/**
		* Store option value and where the value came from.
		*
		* @param {string} key
		* @param {object} value
		* @param {string} source - expected values are default/config/env/cli/implied
		* @return {Command} `this` command for chaining
		*/
		setOptionValueWithSource(key, value, source) {
			if (this._storeOptionsAsProperties) this[key] = value;
			else this._optionValues[key] = value;
			this._optionValueSources[key] = source;
			return this;
		}
		/**
		* Get source of option value.
		* Expected values are default | config | env | cli | implied
		*
		* @param {string} key
		* @return {string}
		*/
		getOptionValueSource(key) {
			return this._optionValueSources[key];
		}
		/**
		* Get source of option value. See also .optsWithGlobals().
		* Expected values are default | config | env | cli | implied
		*
		* @param {string} key
		* @return {string}
		*/
		getOptionValueSourceWithGlobals(key) {
			let source;
			this._getCommandAndAncestors().forEach((cmd) => {
				if (cmd.getOptionValueSource(key) !== void 0) source = cmd.getOptionValueSource(key);
			});
			return source;
		}
		/**
		* Get user arguments from implied or explicit arguments.
		* Side-effects: set _scriptPath if args included script. Used for default program name, and subcommand searches.
		*
		* @private
		*/
		_prepareUserArgs(argv, parseOptions) {
			if (argv !== void 0 && !Array.isArray(argv)) throw new Error("first parameter to parse must be array or undefined");
			parseOptions = parseOptions || {};
			if (argv === void 0 && parseOptions.from === void 0) {
				if (process$3.versions?.electron) parseOptions.from = "electron";
				const execArgv = process$3.execArgv ?? [];
				if (execArgv.includes("-e") || execArgv.includes("--eval") || execArgv.includes("-p") || execArgv.includes("--print")) parseOptions.from = "eval";
			}
			if (argv === void 0) argv = process$3.argv;
			this.rawArgs = argv.slice();
			let userArgs;
			switch (parseOptions.from) {
				case void 0:
				case "node":
					this._scriptPath = argv[1];
					userArgs = argv.slice(2);
					break;
				case "electron":
					if (process$3.defaultApp) {
						this._scriptPath = argv[1];
						userArgs = argv.slice(2);
					} else userArgs = argv.slice(1);
					break;
				case "user":
					userArgs = argv.slice(0);
					break;
				case "eval":
					userArgs = argv.slice(1);
					break;
				default: throw new Error(`unexpected parse option { from: '${parseOptions.from}' }`);
			}
			if (!this._name && this._scriptPath) this.nameFromFilename(this._scriptPath);
			this._name = this._name || "program";
			return userArgs;
		}
		/**
		* Parse `argv`, setting options and invoking commands when defined.
		*
		* Use parseAsync instead of parse if any of your action handlers are async.
		*
		* Call with no parameters to parse `process.argv`. Detects Electron and special node options like `node --eval`. Easy mode!
		*
		* Or call with an array of strings to parse, and optionally where the user arguments start by specifying where the arguments are `from`:
		* - `'node'`: default, `argv[0]` is the application and `argv[1]` is the script being run, with user arguments after that
		* - `'electron'`: `argv[0]` is the application and `argv[1]` varies depending on whether the electron application is packaged
		* - `'user'`: just user arguments
		*
		* @example
		* program.parse(); // parse process.argv and auto-detect electron and special node flags
		* program.parse(process.argv); // assume argv[0] is app and argv[1] is script
		* program.parse(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
		*
		* @param {string[]} [argv] - optional, defaults to process.argv
		* @param {object} [parseOptions] - optionally specify style of options with from: node/user/electron
		* @param {string} [parseOptions.from] - where the args are from: 'node', 'user', 'electron'
		* @return {Command} `this` command for chaining
		*/
		parse(argv, parseOptions) {
			this._prepareForParse();
			const userArgs = this._prepareUserArgs(argv, parseOptions);
			this._parseCommand([], userArgs);
			return this;
		}
		/**
		* Parse `argv`, setting options and invoking commands when defined.
		*
		* Call with no parameters to parse `process.argv`. Detects Electron and special node options like `node --eval`. Easy mode!
		*
		* Or call with an array of strings to parse, and optionally where the user arguments start by specifying where the arguments are `from`:
		* - `'node'`: default, `argv[0]` is the application and `argv[1]` is the script being run, with user arguments after that
		* - `'electron'`: `argv[0]` is the application and `argv[1]` varies depending on whether the electron application is packaged
		* - `'user'`: just user arguments
		*
		* @example
		* await program.parseAsync(); // parse process.argv and auto-detect electron and special node flags
		* await program.parseAsync(process.argv); // assume argv[0] is app and argv[1] is script
		* await program.parseAsync(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
		*
		* @param {string[]} [argv]
		* @param {object} [parseOptions]
		* @param {string} parseOptions.from - where the args are from: 'node', 'user', 'electron'
		* @return {Promise}
		*/
		async parseAsync(argv, parseOptions) {
			this._prepareForParse();
			const userArgs = this._prepareUserArgs(argv, parseOptions);
			await this._parseCommand([], userArgs);
			return this;
		}
		_prepareForParse() {
			if (this._savedState === null) this.saveStateBeforeParse();
			else this.restoreStateBeforeParse();
		}
		/**
		* Called the first time parse is called to save state and allow a restore before subsequent calls to parse.
		* Not usually called directly, but available for subclasses to save their custom state.
		*
		* This is called in a lazy way. Only commands used in parsing chain will have state saved.
		*/
		saveStateBeforeParse() {
			this._savedState = {
				_name: this._name,
				_optionValues: { ...this._optionValues },
				_optionValueSources: { ...this._optionValueSources }
			};
		}
		/**
		* Restore state before parse for calls after the first.
		* Not usually called directly, but available for subclasses to save their custom state.
		*
		* This is called in a lazy way. Only commands used in parsing chain will have state restored.
		*/
		restoreStateBeforeParse() {
			if (this._storeOptionsAsProperties) throw new Error(`Can not call parse again when storeOptionsAsProperties is true.
- either make a new Command for each call to parse, or stop storing options as properties`);
			this._name = this._savedState._name;
			this._scriptPath = null;
			this.rawArgs = [];
			this._optionValues = { ...this._savedState._optionValues };
			this._optionValueSources = { ...this._savedState._optionValueSources };
			this.args = [];
			this.processedArgs = [];
		}
		/**
		* Throw if expected executable is missing. Add lots of help for author.
		*
		* @param {string} executableFile
		* @param {string} executableDir
		* @param {string} subcommandName
		*/
		_checkForMissingExecutable(executableFile, executableDir, subcommandName) {
			if (fs.existsSync(executableFile)) return;
			const executableMissing = `'${executableFile}' does not exist
 - if '${subcommandName}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name or path
 - ${executableDir ? `searched for local subcommand relative to directory '${executableDir}'` : "no directory for search for local subcommand, use .executableDir() to supply a custom directory"}`;
			throw new Error(executableMissing);
		}
		/**
		* Execute a sub-command executable.
		*
		* @private
		*/
		_executeSubCommand(subcommand, args) {
			args = args.slice();
			let launchWithNode = false;
			const sourceExt = [
				".js",
				".ts",
				".tsx",
				".mjs",
				".cjs"
			];
			function findFile(baseDir, baseName) {
				const localBin = path.resolve(baseDir, baseName);
				if (fs.existsSync(localBin)) return localBin;
				if (sourceExt.includes(path.extname(baseName))) return void 0;
				const foundExt = sourceExt.find((ext) => fs.existsSync(`${localBin}${ext}`));
				if (foundExt) return `${localBin}${foundExt}`;
			}
			this._checkForMissingMandatoryOptions();
			this._checkForConflictingOptions();
			let executableFile = subcommand._executableFile || `${this._name}-${subcommand._name}`;
			let executableDir = this._executableDir || "";
			if (this._scriptPath) {
				let resolvedScriptPath;
				try {
					resolvedScriptPath = fs.realpathSync(this._scriptPath);
				} catch {
					resolvedScriptPath = this._scriptPath;
				}
				executableDir = path.resolve(path.dirname(resolvedScriptPath), executableDir);
			}
			if (executableDir) {
				let localFile = findFile(executableDir, executableFile);
				if (!localFile && !subcommand._executableFile && this._scriptPath) {
					const legacyName = path.basename(this._scriptPath, path.extname(this._scriptPath));
					if (legacyName !== this._name) localFile = findFile(executableDir, `${legacyName}-${subcommand._name}`);
				}
				executableFile = localFile || executableFile;
			}
			launchWithNode = sourceExt.includes(path.extname(executableFile));
			let proc;
			if (process$3.platform !== "win32") if (launchWithNode) {
				args.unshift(executableFile);
				args = incrementNodeInspectorPort(process$3.execArgv).concat(args);
				proc = childProcess.spawn(process$3.argv[0], args, { stdio: "inherit" });
			} else proc = childProcess.spawn(executableFile, args, { stdio: "inherit" });
			else {
				this._checkForMissingExecutable(executableFile, executableDir, subcommand._name);
				args.unshift(executableFile);
				args = incrementNodeInspectorPort(process$3.execArgv).concat(args);
				proc = childProcess.spawn(process$3.execPath, args, { stdio: "inherit" });
			}
			if (!proc.killed) [
				"SIGUSR1",
				"SIGUSR2",
				"SIGTERM",
				"SIGINT",
				"SIGHUP"
			].forEach((signal) => {
				process$3.on(signal, () => {
					if (proc.killed === false && proc.exitCode === null) proc.kill(signal);
				});
			});
			const exitCallback = this._exitCallback;
			proc.on("close", (code) => {
				code = code ?? 1;
				if (!exitCallback) process$3.exit(code);
				else exitCallback(new CommanderError(code, "commander.executeSubCommandAsync", "(close)"));
			});
			proc.on("error", (err) => {
				if (err.code === "ENOENT") this._checkForMissingExecutable(executableFile, executableDir, subcommand._name);
				else if (err.code === "EACCES") throw new Error(`'${executableFile}' not executable`);
				if (!exitCallback) process$3.exit(1);
				else {
					const wrappedError = new CommanderError(1, "commander.executeSubCommandAsync", "(error)");
					wrappedError.nestedError = err;
					exitCallback(wrappedError);
				}
			});
			this.runningCommand = proc;
		}
		/**
		* @private
		*/
		_dispatchSubcommand(commandName, operands, unknown) {
			const subCommand = this._findCommand(commandName);
			if (!subCommand) this.help({ error: true });
			subCommand._prepareForParse();
			let promiseChain;
			promiseChain = this._chainOrCallSubCommandHook(promiseChain, subCommand, "preSubcommand");
			promiseChain = this._chainOrCall(promiseChain, () => {
				if (subCommand._executableHandler) this._executeSubCommand(subCommand, operands.concat(unknown));
				else return subCommand._parseCommand(operands, unknown);
			});
			return promiseChain;
		}
		/**
		* Invoke help directly if possible, or dispatch if necessary.
		* e.g. help foo
		*
		* @private
		*/
		_dispatchHelpCommand(subcommandName) {
			if (!subcommandName) this.help();
			const subCommand = this._findCommand(subcommandName);
			if (subCommand && !subCommand._executableHandler) subCommand.help();
			return this._dispatchSubcommand(subcommandName, [], [this._getHelpOption()?.long ?? this._getHelpOption()?.short ?? "--help"]);
		}
		/**
		* Check this.args against expected this.registeredArguments.
		*
		* @private
		*/
		_checkNumberOfArguments() {
			this.registeredArguments.forEach((arg, i) => {
				if (arg.required && this.args[i] == null) this.missingArgument(arg.name());
			});
			if (this.registeredArguments.length > 0 && this.registeredArguments[this.registeredArguments.length - 1].variadic) return;
			if (this.args.length > this.registeredArguments.length) this._excessArguments(this.args);
		}
		/**
		* Process this.args using this.registeredArguments and save as this.processedArgs!
		*
		* @private
		*/
		_processArguments() {
			const myParseArg = (argument, value, previous) => {
				let parsedValue = value;
				if (value !== null && argument.parseArg) {
					const invalidValueMessage = `error: command-argument value '${value}' is invalid for argument '${argument.name()}'.`;
					parsedValue = this._callParseArg(argument, value, previous, invalidValueMessage);
				}
				return parsedValue;
			};
			this._checkNumberOfArguments();
			const processedArgs = [];
			this.registeredArguments.forEach((declaredArg, index) => {
				let value = declaredArg.defaultValue;
				if (declaredArg.variadic) {
					if (index < this.args.length) {
						value = this.args.slice(index);
						if (declaredArg.parseArg) value = value.reduce((processed, v) => {
							return myParseArg(declaredArg, v, processed);
						}, declaredArg.defaultValue);
					} else if (value === void 0) value = [];
				} else if (index < this.args.length) {
					value = this.args[index];
					if (declaredArg.parseArg) value = myParseArg(declaredArg, value, declaredArg.defaultValue);
				}
				processedArgs[index] = value;
			});
			this.processedArgs = processedArgs;
		}
		/**
		* Once we have a promise we chain, but call synchronously until then.
		*
		* @param {(Promise|undefined)} promise
		* @param {Function} fn
		* @return {(Promise|undefined)}
		* @private
		*/
		_chainOrCall(promise, fn) {
			if (promise?.then && typeof promise.then === "function") return promise.then(() => fn());
			return fn();
		}
		/**
		*
		* @param {(Promise|undefined)} promise
		* @param {string} event
		* @return {(Promise|undefined)}
		* @private
		*/
		_chainOrCallHooks(promise, event) {
			let result = promise;
			const hooks = [];
			this._getCommandAndAncestors().reverse().filter((cmd) => cmd._lifeCycleHooks[event] !== void 0).forEach((hookedCommand) => {
				hookedCommand._lifeCycleHooks[event].forEach((callback) => {
					hooks.push({
						hookedCommand,
						callback
					});
				});
			});
			if (event === "postAction") hooks.reverse();
			hooks.forEach((hookDetail) => {
				result = this._chainOrCall(result, () => {
					return hookDetail.callback(hookDetail.hookedCommand, this);
				});
			});
			return result;
		}
		/**
		*
		* @param {(Promise|undefined)} promise
		* @param {Command} subCommand
		* @param {string} event
		* @return {(Promise|undefined)}
		* @private
		*/
		_chainOrCallSubCommandHook(promise, subCommand, event) {
			let result = promise;
			if (this._lifeCycleHooks[event] !== void 0) this._lifeCycleHooks[event].forEach((hook) => {
				result = this._chainOrCall(result, () => {
					return hook(this, subCommand);
				});
			});
			return result;
		}
		/**
		* Process arguments in context of this command.
		* Returns action result, in case it is a promise.
		*
		* @private
		*/
		_parseCommand(operands, unknown) {
			const parsed = this.parseOptions(unknown);
			this._parseOptionsEnv();
			this._parseOptionsImplied();
			operands = operands.concat(parsed.operands);
			unknown = parsed.unknown;
			this.args = operands.concat(unknown);
			if (operands && this._findCommand(operands[0])) return this._dispatchSubcommand(operands[0], operands.slice(1), unknown);
			if (this._getHelpCommand() && operands[0] === this._getHelpCommand().name()) return this._dispatchHelpCommand(operands[1]);
			if (this._defaultCommandName) {
				this._outputHelpIfRequested(unknown);
				return this._dispatchSubcommand(this._defaultCommandName, operands, unknown);
			}
			if (this.commands.length && this.args.length === 0 && !this._actionHandler && !this._defaultCommandName) this.help({ error: true });
			this._outputHelpIfRequested(parsed.unknown);
			this._checkForMissingMandatoryOptions();
			this._checkForConflictingOptions();
			const checkForUnknownOptions = () => {
				if (parsed.unknown.length > 0) this.unknownOption(parsed.unknown[0]);
			};
			const commandEvent = `command:${this.name()}`;
			if (this._actionHandler) {
				checkForUnknownOptions();
				this._processArguments();
				let promiseChain;
				promiseChain = this._chainOrCallHooks(promiseChain, "preAction");
				promiseChain = this._chainOrCall(promiseChain, () => this._actionHandler(this.processedArgs));
				if (this.parent) promiseChain = this._chainOrCall(promiseChain, () => {
					this.parent.emit(commandEvent, operands, unknown);
				});
				promiseChain = this._chainOrCallHooks(promiseChain, "postAction");
				return promiseChain;
			}
			if (this.parent?.listenerCount(commandEvent)) {
				checkForUnknownOptions();
				this._processArguments();
				this.parent.emit(commandEvent, operands, unknown);
			} else if (operands.length) {
				if (this._findCommand("*")) return this._dispatchSubcommand("*", operands, unknown);
				if (this.listenerCount("command:*")) this.emit("command:*", operands, unknown);
				else if (this.commands.length) this.unknownCommand();
				else {
					checkForUnknownOptions();
					this._processArguments();
				}
			} else if (this.commands.length) {
				checkForUnknownOptions();
				this.help({ error: true });
			} else {
				checkForUnknownOptions();
				this._processArguments();
			}
		}
		/**
		* Find matching command.
		*
		* @private
		* @return {Command | undefined}
		*/
		_findCommand(name) {
			if (!name) return void 0;
			return this.commands.find((cmd) => cmd._name === name || cmd._aliases.includes(name));
		}
		/**
		* Return an option matching `arg` if any.
		*
		* @param {string} arg
		* @return {Option}
		* @package
		*/
		_findOption(arg) {
			return this.options.find((option) => option.is(arg));
		}
		/**
		* Display an error message if a mandatory option does not have a value.
		* Called after checking for help flags in leaf subcommand.
		*
		* @private
		*/
		_checkForMissingMandatoryOptions() {
			this._getCommandAndAncestors().forEach((cmd) => {
				cmd.options.forEach((anOption) => {
					if (anOption.mandatory && cmd.getOptionValue(anOption.attributeName()) === void 0) cmd.missingMandatoryOptionValue(anOption);
				});
			});
		}
		/**
		* Display an error message if conflicting options are used together in this.
		*
		* @private
		*/
		_checkForConflictingLocalOptions() {
			const definedNonDefaultOptions = this.options.filter((option) => {
				const optionKey = option.attributeName();
				if (this.getOptionValue(optionKey) === void 0) return false;
				return this.getOptionValueSource(optionKey) !== "default";
			});
			definedNonDefaultOptions.filter((option) => option.conflictsWith.length > 0).forEach((option) => {
				const conflictingAndDefined = definedNonDefaultOptions.find((defined) => option.conflictsWith.includes(defined.attributeName()));
				if (conflictingAndDefined) this._conflictingOption(option, conflictingAndDefined);
			});
		}
		/**
		* Display an error message if conflicting options are used together.
		* Called after checking for help flags in leaf subcommand.
		*
		* @private
		*/
		_checkForConflictingOptions() {
			this._getCommandAndAncestors().forEach((cmd) => {
				cmd._checkForConflictingLocalOptions();
			});
		}
		/**
		* Parse options from `argv` removing known options,
		* and return argv split into operands and unknown arguments.
		*
		* Side effects: modifies command by storing options. Does not reset state if called again.
		*
		* Examples:
		*
		*     argv => operands, unknown
		*     --known kkk op => [op], []
		*     op --known kkk => [op], []
		*     sub --unknown uuu op => [sub], [--unknown uuu op]
		*     sub -- --unknown uuu op => [sub --unknown uuu op], []
		*
		* @param {string[]} args
		* @return {{operands: string[], unknown: string[]}}
		*/
		parseOptions(args) {
			const operands = [];
			const unknown = [];
			let dest = operands;
			function maybeOption(arg) {
				return arg.length > 1 && arg[0] === "-";
			}
			const negativeNumberArg = (arg) => {
				if (!/^-(\d+|\d*\.\d+)(e[+-]?\d+)?$/.test(arg)) return false;
				return !this._getCommandAndAncestors().some((cmd) => cmd.options.map((opt) => opt.short).some((short) => /^-\d$/.test(short)));
			};
			let activeVariadicOption = null;
			let activeGroup = null;
			let i = 0;
			while (i < args.length || activeGroup) {
				const arg = activeGroup ?? args[i++];
				activeGroup = null;
				if (arg === "--") {
					if (dest === unknown) dest.push(arg);
					dest.push(...args.slice(i));
					break;
				}
				if (activeVariadicOption && (!maybeOption(arg) || negativeNumberArg(arg))) {
					this.emit(`option:${activeVariadicOption.name()}`, arg);
					continue;
				}
				activeVariadicOption = null;
				if (maybeOption(arg)) {
					const option = this._findOption(arg);
					if (option) {
						if (option.required) {
							const value = args[i++];
							if (value === void 0) this.optionMissingArgument(option);
							this.emit(`option:${option.name()}`, value);
						} else if (option.optional) {
							let value = null;
							if (i < args.length && (!maybeOption(args[i]) || negativeNumberArg(args[i]))) value = args[i++];
							this.emit(`option:${option.name()}`, value);
						} else this.emit(`option:${option.name()}`);
						activeVariadicOption = option.variadic ? option : null;
						continue;
					}
				}
				if (arg.length > 2 && arg[0] === "-" && arg[1] !== "-") {
					const option = this._findOption(`-${arg[1]}`);
					if (option) {
						if (option.required || option.optional && this._combineFlagAndOptionalValue) this.emit(`option:${option.name()}`, arg.slice(2));
						else {
							this.emit(`option:${option.name()}`);
							activeGroup = `-${arg.slice(2)}`;
						}
						continue;
					}
				}
				if (/^--[^=]+=/.test(arg)) {
					const index = arg.indexOf("=");
					const option = this._findOption(arg.slice(0, index));
					if (option && (option.required || option.optional)) {
						this.emit(`option:${option.name()}`, arg.slice(index + 1));
						continue;
					}
				}
				if (dest === operands && maybeOption(arg) && !(this.commands.length === 0 && negativeNumberArg(arg))) dest = unknown;
				if ((this._enablePositionalOptions || this._passThroughOptions) && operands.length === 0 && unknown.length === 0) {
					if (this._findCommand(arg)) {
						operands.push(arg);
						unknown.push(...args.slice(i));
						break;
					} else if (this._getHelpCommand() && arg === this._getHelpCommand().name()) {
						operands.push(arg, ...args.slice(i));
						break;
					} else if (this._defaultCommandName) {
						unknown.push(arg, ...args.slice(i));
						break;
					}
				}
				if (this._passThroughOptions) {
					dest.push(arg, ...args.slice(i));
					break;
				}
				dest.push(arg);
			}
			return {
				operands,
				unknown
			};
		}
		/**
		* Return an object containing local option values as key-value pairs.
		*
		* @return {object}
		*/
		opts() {
			if (this._storeOptionsAsProperties) {
				const result = {};
				const len = this.options.length;
				for (let i = 0; i < len; i++) {
					const key = this.options[i].attributeName();
					result[key] = key === this._versionOptionName ? this._version : this[key];
				}
				return result;
			}
			return this._optionValues;
		}
		/**
		* Return an object containing merged local and global option values as key-value pairs.
		*
		* @return {object}
		*/
		optsWithGlobals() {
			return this._getCommandAndAncestors().reduce((combinedOptions, cmd) => Object.assign(combinedOptions, cmd.opts()), {});
		}
		/**
		* Display error message and exit (or call exitOverride).
		*
		* @param {string} message
		* @param {object} [errorOptions]
		* @param {string} [errorOptions.code] - an id string representing the error
		* @param {number} [errorOptions.exitCode] - used with process.exit
		*/
		error(message, errorOptions) {
			this._outputConfiguration.outputError(`${message}\n`, this._outputConfiguration.writeErr);
			if (typeof this._showHelpAfterError === "string") this._outputConfiguration.writeErr(`${this._showHelpAfterError}\n`);
			else if (this._showHelpAfterError) {
				this._outputConfiguration.writeErr("\n");
				this.outputHelp({ error: true });
			}
			const config = errorOptions || {};
			const exitCode = config.exitCode || 1;
			const code = config.code || "commander.error";
			this._exit(exitCode, code, message);
		}
		/**
		* Apply any option related environment variables, if option does
		* not have a value from cli or client code.
		*
		* @private
		*/
		_parseOptionsEnv() {
			this.options.forEach((option) => {
				if (option.envVar && option.envVar in process$3.env) {
					const optionKey = option.attributeName();
					if (this.getOptionValue(optionKey) === void 0 || [
						"default",
						"config",
						"env"
					].includes(this.getOptionValueSource(optionKey))) if (option.required || option.optional) this.emit(`optionEnv:${option.name()}`, process$3.env[option.envVar]);
					else this.emit(`optionEnv:${option.name()}`);
				}
			});
		}
		/**
		* Apply any implied option values, if option is undefined or default value.
		*
		* @private
		*/
		_parseOptionsImplied() {
			const dualHelper = new DualOptions(this.options);
			const hasCustomOptionValue = (optionKey) => {
				return this.getOptionValue(optionKey) !== void 0 && !["default", "implied"].includes(this.getOptionValueSource(optionKey));
			};
			this.options.filter((option) => option.implied !== void 0 && hasCustomOptionValue(option.attributeName()) && dualHelper.valueFromOption(this.getOptionValue(option.attributeName()), option)).forEach((option) => {
				Object.keys(option.implied).filter((impliedKey) => !hasCustomOptionValue(impliedKey)).forEach((impliedKey) => {
					this.setOptionValueWithSource(impliedKey, option.implied[impliedKey], "implied");
				});
			});
		}
		/**
		* Argument `name` is missing.
		*
		* @param {string} name
		* @private
		*/
		missingArgument(name) {
			const message = `error: missing required argument '${name}'`;
			this.error(message, { code: "commander.missingArgument" });
		}
		/**
		* `Option` is missing an argument.
		*
		* @param {Option} option
		* @private
		*/
		optionMissingArgument(option) {
			const message = `error: option '${option.flags}' argument missing`;
			this.error(message, { code: "commander.optionMissingArgument" });
		}
		/**
		* `Option` does not have a value, and is a mandatory option.
		*
		* @param {Option} option
		* @private
		*/
		missingMandatoryOptionValue(option) {
			const message = `error: required option '${option.flags}' not specified`;
			this.error(message, { code: "commander.missingMandatoryOptionValue" });
		}
		/**
		* `Option` conflicts with another option.
		*
		* @param {Option} option
		* @param {Option} conflictingOption
		* @private
		*/
		_conflictingOption(option, conflictingOption) {
			const findBestOptionFromValue = (option) => {
				const optionKey = option.attributeName();
				const optionValue = this.getOptionValue(optionKey);
				const negativeOption = this.options.find((target) => target.negate && optionKey === target.attributeName());
				const positiveOption = this.options.find((target) => !target.negate && optionKey === target.attributeName());
				if (negativeOption && (negativeOption.presetArg === void 0 && optionValue === false || negativeOption.presetArg !== void 0 && optionValue === negativeOption.presetArg)) return negativeOption;
				return positiveOption || option;
			};
			const getErrorMessage = (option) => {
				const bestOption = findBestOptionFromValue(option);
				const optionKey = bestOption.attributeName();
				if (this.getOptionValueSource(optionKey) === "env") return `environment variable '${bestOption.envVar}'`;
				return `option '${bestOption.flags}'`;
			};
			const message = `error: ${getErrorMessage(option)} cannot be used with ${getErrorMessage(conflictingOption)}`;
			this.error(message, { code: "commander.conflictingOption" });
		}
		/**
		* Unknown option `flag`.
		*
		* @param {string} flag
		* @private
		*/
		unknownOption(flag) {
			if (this._allowUnknownOption) return;
			let suggestion = "";
			if (flag.startsWith("--") && this._showSuggestionAfterError) {
				let candidateFlags = [];
				let command = this;
				do {
					const moreFlags = command.createHelp().visibleOptions(command).filter((option) => option.long).map((option) => option.long);
					candidateFlags = candidateFlags.concat(moreFlags);
					command = command.parent;
				} while (command && !command._enablePositionalOptions);
				suggestion = suggestSimilar(flag, candidateFlags);
			}
			const message = `error: unknown option '${flag}'${suggestion}`;
			this.error(message, { code: "commander.unknownOption" });
		}
		/**
		* Excess arguments, more than expected.
		*
		* @param {string[]} receivedArgs
		* @private
		*/
		_excessArguments(receivedArgs) {
			if (this._allowExcessArguments) return;
			const expected = this.registeredArguments.length;
			const s = expected === 1 ? "" : "s";
			const message = `error: too many arguments${this.parent ? ` for '${this.name()}'` : ""}. Expected ${expected} argument${s} but got ${receivedArgs.length}.`;
			this.error(message, { code: "commander.excessArguments" });
		}
		/**
		* Unknown command.
		*
		* @private
		*/
		unknownCommand() {
			const unknownName = this.args[0];
			let suggestion = "";
			if (this._showSuggestionAfterError) {
				const candidateNames = [];
				this.createHelp().visibleCommands(this).forEach((command) => {
					candidateNames.push(command.name());
					if (command.alias()) candidateNames.push(command.alias());
				});
				suggestion = suggestSimilar(unknownName, candidateNames);
			}
			const message = `error: unknown command '${unknownName}'${suggestion}`;
			this.error(message, { code: "commander.unknownCommand" });
		}
		/**
		* Get or set the program version.
		*
		* This method auto-registers the "-V, --version" option which will print the version number.
		*
		* You can optionally supply the flags and description to override the defaults.
		*
		* @param {string} [str]
		* @param {string} [flags]
		* @param {string} [description]
		* @return {(this | string | undefined)} `this` command for chaining, or version string if no arguments
		*/
		version(str, flags, description) {
			if (str === void 0) return this._version;
			this._version = str;
			flags = flags || "-V, --version";
			description = description || "output the version number";
			const versionOption = this.createOption(flags, description);
			this._versionOptionName = versionOption.attributeName();
			this._registerOption(versionOption);
			this.on("option:" + versionOption.name(), () => {
				this._outputConfiguration.writeOut(`${str}\n`);
				this._exit(0, "commander.version", str);
			});
			return this;
		}
		/**
		* Set the description.
		*
		* @param {string} [str]
		* @param {object} [argsDescription]
		* @return {(string|Command)}
		*/
		description(str, argsDescription) {
			if (str === void 0 && argsDescription === void 0) return this._description;
			this._description = str;
			if (argsDescription) this._argsDescription = argsDescription;
			return this;
		}
		/**
		* Set the summary. Used when listed as subcommand of parent.
		*
		* @param {string} [str]
		* @return {(string|Command)}
		*/
		summary(str) {
			if (str === void 0) return this._summary;
			this._summary = str;
			return this;
		}
		/**
		* Set an alias for the command.
		*
		* You may call more than once to add multiple aliases. Only the first alias is shown in the auto-generated help.
		*
		* @param {string} [alias]
		* @return {(string|Command)}
		*/
		alias(alias) {
			if (alias === void 0) return this._aliases[0];
			/** @type {Command} */
			let command = this;
			if (this.commands.length !== 0 && this.commands[this.commands.length - 1]._executableHandler) command = this.commands[this.commands.length - 1];
			if (alias === command._name) throw new Error("Command alias can't be the same as its name");
			const matchingCommand = this.parent?._findCommand(alias);
			if (matchingCommand) {
				const existingCmd = [matchingCommand.name()].concat(matchingCommand.aliases()).join("|");
				throw new Error(`cannot add alias '${alias}' to command '${this.name()}' as already have command '${existingCmd}'`);
			}
			command._aliases.push(alias);
			return this;
		}
		/**
		* Set aliases for the command.
		*
		* Only the first alias is shown in the auto-generated help.
		*
		* @param {string[]} [aliases]
		* @return {(string[]|Command)}
		*/
		aliases(aliases) {
			if (aliases === void 0) return this._aliases;
			aliases.forEach((alias) => this.alias(alias));
			return this;
		}
		/**
		* Set / get the command usage `str`.
		*
		* @param {string} [str]
		* @return {(string|Command)}
		*/
		usage(str) {
			if (str === void 0) {
				if (this._usage) return this._usage;
				const args = this.registeredArguments.map((arg) => {
					return humanReadableArgName(arg);
				});
				return [].concat(this.options.length || this._helpOption !== null ? "[options]" : [], this.commands.length ? "[command]" : [], this.registeredArguments.length ? args : []).join(" ");
			}
			this._usage = str;
			return this;
		}
		/**
		* Get or set the name of the command.
		*
		* @param {string} [str]
		* @return {(string|Command)}
		*/
		name(str) {
			if (str === void 0) return this._name;
			this._name = str;
			return this;
		}
		/**
		* Set/get the help group heading for this subcommand in parent command's help.
		*
		* @param {string} [heading]
		* @return {Command | string}
		*/
		helpGroup(heading) {
			if (heading === void 0) return this._helpGroupHeading ?? "";
			this._helpGroupHeading = heading;
			return this;
		}
		/**
		* Set/get the default help group heading for subcommands added to this command.
		* (This does not override a group set directly on the subcommand using .helpGroup().)
		*
		* @example
		* program.commandsGroup('Development Commands:);
		* program.command('watch')...
		* program.command('lint')...
		* ...
		*
		* @param {string} [heading]
		* @returns {Command | string}
		*/
		commandsGroup(heading) {
			if (heading === void 0) return this._defaultCommandGroup ?? "";
			this._defaultCommandGroup = heading;
			return this;
		}
		/**
		* Set/get the default help group heading for options added to this command.
		* (This does not override a group set directly on the option using .helpGroup().)
		*
		* @example
		* program
		*   .optionsGroup('Development Options:')
		*   .option('-d, --debug', 'output extra debugging')
		*   .option('-p, --profile', 'output profiling information')
		*
		* @param {string} [heading]
		* @returns {Command | string}
		*/
		optionsGroup(heading) {
			if (heading === void 0) return this._defaultOptionGroup ?? "";
			this._defaultOptionGroup = heading;
			return this;
		}
		/**
		* @param {Option} option
		* @private
		*/
		_initOptionGroup(option) {
			if (this._defaultOptionGroup && !option.helpGroupHeading) option.helpGroup(this._defaultOptionGroup);
		}
		/**
		* @param {Command} cmd
		* @private
		*/
		_initCommandGroup(cmd) {
			if (this._defaultCommandGroup && !cmd.helpGroup()) cmd.helpGroup(this._defaultCommandGroup);
		}
		/**
		* Set the name of the command from script filename, such as process.argv[1],
		* or require.main.filename, or __filename.
		*
		* (Used internally and public although not documented in README.)
		*
		* @example
		* program.nameFromFilename(require.main.filename);
		*
		* @param {string} filename
		* @return {Command}
		*/
		nameFromFilename(filename) {
			this._name = path.basename(filename, path.extname(filename));
			return this;
		}
		/**
		* Get or set the directory for searching for executable subcommands of this command.
		*
		* @example
		* program.executableDir(__dirname);
		* // or
		* program.executableDir('subcommands');
		*
		* @param {string} [path]
		* @return {(string|null|Command)}
		*/
		executableDir(path) {
			if (path === void 0) return this._executableDir;
			this._executableDir = path;
			return this;
		}
		/**
		* Return program help documentation.
		*
		* @param {{ error: boolean }} [contextOptions] - pass {error:true} to wrap for stderr instead of stdout
		* @return {string}
		*/
		helpInformation(contextOptions) {
			const helper = this.createHelp();
			const context = this._getOutputContext(contextOptions);
			helper.prepareContext({
				error: context.error,
				helpWidth: context.helpWidth,
				outputHasColors: context.hasColors
			});
			const text = helper.formatHelp(this, helper);
			if (context.hasColors) return text;
			return this._outputConfiguration.stripColor(text);
		}
		/**
		* @typedef HelpContext
		* @type {object}
		* @property {boolean} error
		* @property {number} helpWidth
		* @property {boolean} hasColors
		* @property {function} write - includes stripColor if needed
		*
		* @returns {HelpContext}
		* @private
		*/
		_getOutputContext(contextOptions) {
			contextOptions = contextOptions || {};
			const error = !!contextOptions.error;
			let baseWrite;
			let hasColors;
			let helpWidth;
			if (error) {
				baseWrite = (str) => this._outputConfiguration.writeErr(str);
				hasColors = this._outputConfiguration.getErrHasColors();
				helpWidth = this._outputConfiguration.getErrHelpWidth();
			} else {
				baseWrite = (str) => this._outputConfiguration.writeOut(str);
				hasColors = this._outputConfiguration.getOutHasColors();
				helpWidth = this._outputConfiguration.getOutHelpWidth();
			}
			const write = (str) => {
				if (!hasColors) str = this._outputConfiguration.stripColor(str);
				return baseWrite(str);
			};
			return {
				error,
				write,
				hasColors,
				helpWidth
			};
		}
		/**
		* Output help information for this command.
		*
		* Outputs built-in help, and custom text added using `.addHelpText()`.
		*
		* @param {{ error: boolean } | Function} [contextOptions] - pass {error:true} to write to stderr instead of stdout
		*/
		outputHelp(contextOptions) {
			let deprecatedCallback;
			if (typeof contextOptions === "function") {
				deprecatedCallback = contextOptions;
				contextOptions = void 0;
			}
			const outputContext = this._getOutputContext(contextOptions);
			/** @type {HelpTextEventContext} */
			const eventContext = {
				error: outputContext.error,
				write: outputContext.write,
				command: this
			};
			this._getCommandAndAncestors().reverse().forEach((command) => command.emit("beforeAllHelp", eventContext));
			this.emit("beforeHelp", eventContext);
			let helpInformation = this.helpInformation({ error: outputContext.error });
			if (deprecatedCallback) {
				helpInformation = deprecatedCallback(helpInformation);
				if (typeof helpInformation !== "string" && !Buffer.isBuffer(helpInformation)) throw new Error("outputHelp callback must return a string or a Buffer");
			}
			outputContext.write(helpInformation);
			if (this._getHelpOption()?.long) this.emit(this._getHelpOption().long);
			this.emit("afterHelp", eventContext);
			this._getCommandAndAncestors().forEach((command) => command.emit("afterAllHelp", eventContext));
		}
		/**
		* You can pass in flags and a description to customise the built-in help option.
		* Pass in false to disable the built-in help option.
		*
		* @example
		* program.helpOption('-?, --help' 'show help'); // customise
		* program.helpOption(false); // disable
		*
		* @param {(string | boolean)} flags
		* @param {string} [description]
		* @return {Command} `this` command for chaining
		*/
		helpOption(flags, description) {
			if (typeof flags === "boolean") {
				if (flags) {
					if (this._helpOption === null) this._helpOption = void 0;
					if (this._defaultOptionGroup) this._initOptionGroup(this._getHelpOption());
				} else this._helpOption = null;
				return this;
			}
			this._helpOption = this.createOption(flags ?? "-h, --help", description ?? "display help for command");
			if (flags || description) this._initOptionGroup(this._helpOption);
			return this;
		}
		/**
		* Lazy create help option.
		* Returns null if has been disabled with .helpOption(false).
		*
		* @returns {(Option | null)} the help option
		* @package
		*/
		_getHelpOption() {
			if (this._helpOption === void 0) this.helpOption(void 0, void 0);
			return this._helpOption;
		}
		/**
		* Supply your own option to use for the built-in help option.
		* This is an alternative to using helpOption() to customise the flags and description etc.
		*
		* @param {Option} option
		* @return {Command} `this` command for chaining
		*/
		addHelpOption(option) {
			this._helpOption = option;
			this._initOptionGroup(option);
			return this;
		}
		/**
		* Output help information and exit.
		*
		* Outputs built-in help, and custom text added using `.addHelpText()`.
		*
		* @param {{ error: boolean }} [contextOptions] - pass {error:true} to write to stderr instead of stdout
		*/
		help(contextOptions) {
			this.outputHelp(contextOptions);
			let exitCode = Number(process$3.exitCode ?? 0);
			if (exitCode === 0 && contextOptions && typeof contextOptions !== "function" && contextOptions.error) exitCode = 1;
			this._exit(exitCode, "commander.help", "(outputHelp)");
		}
		/**
		* // Do a little typing to coordinate emit and listener for the help text events.
		* @typedef HelpTextEventContext
		* @type {object}
		* @property {boolean} error
		* @property {Command} command
		* @property {function} write
		*/
		/**
		* Add additional text to be displayed with the built-in help.
		*
		* Position is 'before' or 'after' to affect just this command,
		* and 'beforeAll' or 'afterAll' to affect this command and all its subcommands.
		*
		* @param {string} position - before or after built-in help
		* @param {(string | Function)} text - string to add, or a function returning a string
		* @return {Command} `this` command for chaining
		*/
		addHelpText(position, text) {
			const allowedValues = [
				"beforeAll",
				"before",
				"after",
				"afterAll"
			];
			if (!allowedValues.includes(position)) throw new Error(`Unexpected value for position to addHelpText.
Expecting one of '${allowedValues.join("', '")}'`);
			const helpEvent = `${position}Help`;
			this.on(helpEvent, (context) => {
				let helpStr;
				if (typeof text === "function") helpStr = text({
					error: context.error,
					command: context.command
				});
				else helpStr = text;
				if (helpStr) context.write(`${helpStr}\n`);
			});
			return this;
		}
		/**
		* Output help information if help flags specified
		*
		* @param {Array} args - array of options to search for help flags
		* @private
		*/
		_outputHelpIfRequested(args) {
			const helpOption = this._getHelpOption();
			if (helpOption && args.find((arg) => helpOption.is(arg))) {
				this.outputHelp();
				this._exit(0, "commander.helpDisplayed", "(outputHelp)");
			}
		}
	};
	/**
	* Scan arguments and increment port number for inspect calls (to avoid conflicts when spawning new command).
	*
	* @param {string[]} args - array of arguments from node.execArgv
	* @returns {string[]}
	* @private
	*/
	function incrementNodeInspectorPort(args) {
		return args.map((arg) => {
			if (!arg.startsWith("--inspect")) return arg;
			let debugOption;
			let debugHost = "127.0.0.1";
			let debugPort = "9229";
			let match;
			if ((match = arg.match(/^(--inspect(-brk)?)$/)) !== null) debugOption = match[1];
			else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+)$/)) !== null) {
				debugOption = match[1];
				if (/^\d+$/.test(match[3])) debugPort = match[3];
				else debugHost = match[3];
			} else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) !== null) {
				debugOption = match[1];
				debugHost = match[3];
				debugPort = match[4];
			}
			if (debugOption && debugPort !== "0") return `${debugOption}=${debugHost}:${parseInt(debugPort) + 1}`;
			return arg;
		});
	}
	/**
	* @returns {boolean | undefined}
	* @package
	*/
	function useColor() {
		if (process$3.env.NO_COLOR || process$3.env.FORCE_COLOR === "0" || process$3.env.FORCE_COLOR === "false") return false;
		if (process$3.env.FORCE_COLOR || process$3.env.CLICOLOR_FORCE !== void 0) return true;
	}
	exports.Command = Command;
	exports.useColor = useColor;
}));

//#endregion
//#region ../../node_modules/.pnpm/commander@14.0.3/node_modules/commander/index.js
var require_commander = /* @__PURE__ */ __commonJSMin(((exports) => {
	const { Argument } = require_argument();
	const { Command } = require_command();
	const { CommanderError, InvalidArgumentError } = require_error();
	const { Help } = require_help();
	const { Option } = require_option();
	exports.program = new Command();
	exports.createCommand = (name) => new Command(name);
	exports.createOption = (flags, description) => new Option(flags, description);
	exports.createArgument = (name, description) => new Argument(name, description);
	/**
	* Expose classes
	*/
	exports.Command = Command;
	exports.Option = Option;
	exports.Argument = Argument;
	exports.Help = Help;
	exports.CommanderError = CommanderError;
	exports.InvalidArgumentError = InvalidArgumentError;
	exports.InvalidOptionArgumentError = InvalidArgumentError;
}));

//#endregion
//#region ../../node_modules/.pnpm/commander@14.0.3/node_modules/commander/esm.mjs
var import_commander = /* @__PURE__ */ __toESM(require_commander(), 1);
const { program: program$1, createCommand, createArgument, createOption, CommanderError, InvalidArgumentError, InvalidOptionArgumentError, Command, Argument, Option, Help } = import_commander.default;

//#endregion
//#region ../../node_modules/.pnpm/picocolors@1.1.1/node_modules/picocolors/picocolors.js
var require_picocolors = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let p = process || {}, argv = p.argv || [], env = p.env || {};
	let isColorSupported = !(!!env.NO_COLOR || argv.includes("--no-color")) && (!!env.FORCE_COLOR || argv.includes("--color") || p.platform === "win32" || (p.stdout || {}).isTTY && env.TERM !== "dumb" || !!env.CI);
	let formatter = (open, close, replace = open) => (input) => {
		let string = "" + input, index = string.indexOf(close, open.length);
		return ~index ? open + replaceClose(string, close, replace, index) + close : open + string + close;
	};
	let replaceClose = (string, close, replace, index) => {
		let result = "", cursor = 0;
		do {
			result += string.substring(cursor, index) + replace;
			cursor = index + close.length;
			index = string.indexOf(close, cursor);
		} while (~index);
		return result + string.substring(cursor);
	};
	let createColors = (enabled = isColorSupported) => {
		let f = enabled ? formatter : () => String;
		return {
			isColorSupported: enabled,
			reset: f("\x1B[0m", "\x1B[0m"),
			bold: f("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m"),
			dim: f("\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m"),
			italic: f("\x1B[3m", "\x1B[23m"),
			underline: f("\x1B[4m", "\x1B[24m"),
			inverse: f("\x1B[7m", "\x1B[27m"),
			hidden: f("\x1B[8m", "\x1B[28m"),
			strikethrough: f("\x1B[9m", "\x1B[29m"),
			black: f("\x1B[30m", "\x1B[39m"),
			red: f("\x1B[31m", "\x1B[39m"),
			green: f("\x1B[32m", "\x1B[39m"),
			yellow: f("\x1B[33m", "\x1B[39m"),
			blue: f("\x1B[34m", "\x1B[39m"),
			magenta: f("\x1B[35m", "\x1B[39m"),
			cyan: f("\x1B[36m", "\x1B[39m"),
			white: f("\x1B[37m", "\x1B[39m"),
			gray: f("\x1B[90m", "\x1B[39m"),
			bgBlack: f("\x1B[40m", "\x1B[49m"),
			bgRed: f("\x1B[41m", "\x1B[49m"),
			bgGreen: f("\x1B[42m", "\x1B[49m"),
			bgYellow: f("\x1B[43m", "\x1B[49m"),
			bgBlue: f("\x1B[44m", "\x1B[49m"),
			bgMagenta: f("\x1B[45m", "\x1B[49m"),
			bgCyan: f("\x1B[46m", "\x1B[49m"),
			bgWhite: f("\x1B[47m", "\x1B[49m"),
			blackBright: f("\x1B[90m", "\x1B[39m"),
			redBright: f("\x1B[91m", "\x1B[39m"),
			greenBright: f("\x1B[92m", "\x1B[39m"),
			yellowBright: f("\x1B[93m", "\x1B[39m"),
			blueBright: f("\x1B[94m", "\x1B[39m"),
			magentaBright: f("\x1B[95m", "\x1B[39m"),
			cyanBright: f("\x1B[96m", "\x1B[39m"),
			whiteBright: f("\x1B[97m", "\x1B[39m"),
			bgBlackBright: f("\x1B[100m", "\x1B[49m"),
			bgRedBright: f("\x1B[101m", "\x1B[49m"),
			bgGreenBright: f("\x1B[102m", "\x1B[49m"),
			bgYellowBright: f("\x1B[103m", "\x1B[49m"),
			bgBlueBright: f("\x1B[104m", "\x1B[49m"),
			bgMagentaBright: f("\x1B[105m", "\x1B[49m"),
			bgCyanBright: f("\x1B[106m", "\x1B[49m"),
			bgWhiteBright: f("\x1B[107m", "\x1B[49m")
		};
	};
	module.exports = createColors();
	module.exports.createColors = createColors;
}));

//#endregion
//#region ../../node_modules/.pnpm/kleur@3.0.3/node_modules/kleur/index.js
var require_kleur = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { FORCE_COLOR, NODE_DISABLE_COLORS, TERM } = process.env;
	const $ = {
		enabled: !NODE_DISABLE_COLORS && TERM !== "dumb" && FORCE_COLOR !== "0",
		reset: init(0, 0),
		bold: init(1, 22),
		dim: init(2, 22),
		italic: init(3, 23),
		underline: init(4, 24),
		inverse: init(7, 27),
		hidden: init(8, 28),
		strikethrough: init(9, 29),
		black: init(30, 39),
		red: init(31, 39),
		green: init(32, 39),
		yellow: init(33, 39),
		blue: init(34, 39),
		magenta: init(35, 39),
		cyan: init(36, 39),
		white: init(37, 39),
		gray: init(90, 39),
		grey: init(90, 39),
		bgBlack: init(40, 49),
		bgRed: init(41, 49),
		bgGreen: init(42, 49),
		bgYellow: init(43, 49),
		bgBlue: init(44, 49),
		bgMagenta: init(45, 49),
		bgCyan: init(46, 49),
		bgWhite: init(47, 49)
	};
	function run(arr, str) {
		let i = 0, tmp, beg = "", end = "";
		for (; i < arr.length; i++) {
			tmp = arr[i];
			beg += tmp.open;
			end += tmp.close;
			if (str.includes(tmp.close)) str = str.replace(tmp.rgx, tmp.close + tmp.open);
		}
		return beg + str + end;
	}
	function chain(has, keys) {
		let ctx = {
			has,
			keys
		};
		ctx.reset = $.reset.bind(ctx);
		ctx.bold = $.bold.bind(ctx);
		ctx.dim = $.dim.bind(ctx);
		ctx.italic = $.italic.bind(ctx);
		ctx.underline = $.underline.bind(ctx);
		ctx.inverse = $.inverse.bind(ctx);
		ctx.hidden = $.hidden.bind(ctx);
		ctx.strikethrough = $.strikethrough.bind(ctx);
		ctx.black = $.black.bind(ctx);
		ctx.red = $.red.bind(ctx);
		ctx.green = $.green.bind(ctx);
		ctx.yellow = $.yellow.bind(ctx);
		ctx.blue = $.blue.bind(ctx);
		ctx.magenta = $.magenta.bind(ctx);
		ctx.cyan = $.cyan.bind(ctx);
		ctx.white = $.white.bind(ctx);
		ctx.gray = $.gray.bind(ctx);
		ctx.grey = $.grey.bind(ctx);
		ctx.bgBlack = $.bgBlack.bind(ctx);
		ctx.bgRed = $.bgRed.bind(ctx);
		ctx.bgGreen = $.bgGreen.bind(ctx);
		ctx.bgYellow = $.bgYellow.bind(ctx);
		ctx.bgBlue = $.bgBlue.bind(ctx);
		ctx.bgMagenta = $.bgMagenta.bind(ctx);
		ctx.bgCyan = $.bgCyan.bind(ctx);
		ctx.bgWhite = $.bgWhite.bind(ctx);
		return ctx;
	}
	function init(open, close) {
		let blk = {
			open: `\x1b[${open}m`,
			close: `\x1b[${close}m`,
			rgx: new RegExp(`\\x1b\\[${close}m`, "g")
		};
		return function(txt) {
			if (this !== void 0 && this.has !== void 0) {
				this.has.includes(open) || (this.has.push(open), this.keys.push(blk));
				return txt === void 0 ? this : $.enabled ? run(this.keys, txt + "") : txt + "";
			}
			return txt === void 0 ? chain([open], [blk]) : $.enabled ? run([blk], txt + "") : txt + "";
		};
	}
	module.exports = $;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/action.js
var require_action$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = (key, isSelect) => {
		if (key.meta && key.name !== "escape") return;
		if (key.ctrl) {
			if (key.name === "a") return "first";
			if (key.name === "c") return "abort";
			if (key.name === "d") return "abort";
			if (key.name === "e") return "last";
			if (key.name === "g") return "reset";
		}
		if (isSelect) {
			if (key.name === "j") return "down";
			if (key.name === "k") return "up";
		}
		if (key.name === "return") return "submit";
		if (key.name === "enter") return "submit";
		if (key.name === "backspace") return "delete";
		if (key.name === "delete") return "deleteForward";
		if (key.name === "abort") return "abort";
		if (key.name === "escape") return "exit";
		if (key.name === "tab") return "next";
		if (key.name === "pagedown") return "nextPage";
		if (key.name === "pageup") return "prevPage";
		if (key.name === "home") return "home";
		if (key.name === "end") return "end";
		if (key.name === "up") return "up";
		if (key.name === "down") return "down";
		if (key.name === "right") return "right";
		if (key.name === "left") return "left";
		return false;
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/strip.js
var require_strip$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = (str) => {
		const pattern = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))"].join("|");
		const RGX = new RegExp(pattern, "g");
		return typeof str === "string" ? str.replace(RGX, "") : str;
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/sisteransi@1.0.5/node_modules/sisteransi/src/index.js
var require_src = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const ESC = "\x1B";
	const CSI = `${ESC}[`;
	const beep = "\x07";
	const cursor = {
		to(x, y) {
			if (!y) return `${CSI}${x + 1}G`;
			return `${CSI}${y + 1};${x + 1}H`;
		},
		move(x, y) {
			let ret = "";
			if (x < 0) ret += `${CSI}${-x}D`;
			else if (x > 0) ret += `${CSI}${x}C`;
			if (y < 0) ret += `${CSI}${-y}A`;
			else if (y > 0) ret += `${CSI}${y}B`;
			return ret;
		},
		up: (count = 1) => `${CSI}${count}A`,
		down: (count = 1) => `${CSI}${count}B`,
		forward: (count = 1) => `${CSI}${count}C`,
		backward: (count = 1) => `${CSI}${count}D`,
		nextLine: (count = 1) => `${CSI}E`.repeat(count),
		prevLine: (count = 1) => `${CSI}F`.repeat(count),
		left: `${CSI}G`,
		hide: `${CSI}?25l`,
		show: `${CSI}?25h`,
		save: `${ESC}7`,
		restore: `${ESC}8`
	};
	const scroll = {
		up: (count = 1) => `${CSI}S`.repeat(count),
		down: (count = 1) => `${CSI}T`.repeat(count)
	};
	const erase = {
		screen: `${CSI}2J`,
		up: (count = 1) => `${CSI}1J`.repeat(count),
		down: (count = 1) => `${CSI}J`.repeat(count),
		line: `${CSI}2K`,
		lineEnd: `${CSI}K`,
		lineStart: `${CSI}1K`,
		lines(count) {
			let clear = "";
			for (let i = 0; i < count; i++) clear += this.line + (i < count - 1 ? cursor.up() : "");
			if (count) clear += cursor.left;
			return clear;
		}
	};
	module.exports = {
		cursor,
		scroll,
		erase,
		beep
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/clear.js
var require_clear$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function _createForOfIteratorHelper(o, allowArrayLike) {
		var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
		if (!it) {
			if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
				if (it) o = it;
				var i = 0;
				var F = function F() {};
				return {
					s: F,
					n: function n() {
						if (i >= o.length) return { done: true };
						return {
							done: false,
							value: o[i++]
						};
					},
					e: function e(_e) {
						throw _e;
					},
					f: F
				};
			}
			throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
		}
		var normalCompletion = true, didErr = false, err;
		return {
			s: function s() {
				it = it.call(o);
			},
			n: function n() {
				var step = it.next();
				normalCompletion = step.done;
				return step;
			},
			e: function e(_e2) {
				didErr = true;
				err = _e2;
			},
			f: function f() {
				try {
					if (!normalCompletion && it.return != null) it.return();
				} finally {
					if (didErr) throw err;
				}
			}
		};
	}
	function _unsupportedIterableToArray(o, minLen) {
		if (!o) return;
		if (typeof o === "string") return _arrayLikeToArray(o, minLen);
		var n = Object.prototype.toString.call(o).slice(8, -1);
		if (n === "Object" && o.constructor) n = o.constructor.name;
		if (n === "Map" || n === "Set") return Array.from(o);
		if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
	}
	function _arrayLikeToArray(arr, len) {
		if (len == null || len > arr.length) len = arr.length;
		for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
		return arr2;
	}
	const strip = require_strip$1();
	const _require = require_src(), erase = _require.erase, cursor = _require.cursor;
	const width = (str) => [...strip(str)].length;
	/**
	* @param {string} prompt
	* @param {number} perLine
	*/
	module.exports = function(prompt, perLine) {
		if (!perLine) return erase.line + cursor.to(0);
		let rows = 0;
		var _iterator = _createForOfIteratorHelper(prompt.split(/\r?\n/)), _step;
		try {
			for (_iterator.s(); !(_step = _iterator.n()).done;) {
				let line = _step.value;
				rows += 1 + Math.floor(Math.max(width(line) - 1, 0) / perLine);
			}
		} catch (err) {
			_iterator.e(err);
		} finally {
			_iterator.f();
		}
		return erase.lines(rows);
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/figures.js
var require_figures$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const main = {
		arrowUp: "↑",
		arrowDown: "↓",
		arrowLeft: "←",
		arrowRight: "→",
		radioOn: "◉",
		radioOff: "◯",
		tick: "✔",
		cross: "✖",
		ellipsis: "…",
		pointerSmall: "›",
		line: "─",
		pointer: "❯"
	};
	const win = {
		arrowUp: main.arrowUp,
		arrowDown: main.arrowDown,
		arrowLeft: main.arrowLeft,
		arrowRight: main.arrowRight,
		radioOn: "(*)",
		radioOff: "( )",
		tick: "√",
		cross: "×",
		ellipsis: "...",
		pointerSmall: "»",
		line: "─",
		pointer: ">"
	};
	const figures = process.platform === "win32" ? win : main;
	module.exports = figures;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/style.js
var require_style$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const c = require_kleur();
	const figures = require_figures$1();
	const styles = Object.freeze({
		password: {
			scale: 1,
			render: (input) => "*".repeat(input.length)
		},
		emoji: {
			scale: 2,
			render: (input) => "😃".repeat(input.length)
		},
		invisible: {
			scale: 0,
			render: (input) => ""
		},
		default: {
			scale: 1,
			render: (input) => `${input}`
		}
	});
	const render = (type) => styles[type] || styles.default;
	const symbols = Object.freeze({
		aborted: c.red(figures.cross),
		done: c.green(figures.tick),
		exited: c.yellow(figures.cross),
		default: c.cyan("?")
	});
	const symbol = (done, aborted, exited) => aborted ? symbols.aborted : exited ? symbols.exited : done ? symbols.done : symbols.default;
	const delimiter = (completing) => c.gray(completing ? figures.ellipsis : figures.pointerSmall);
	const item = (expandable, expanded) => c.gray(expandable ? expanded ? figures.pointerSmall : "+" : figures.line);
	module.exports = {
		styles,
		render,
		symbols,
		symbol,
		delimiter,
		item
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/lines.js
var require_lines$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const strip = require_strip$1();
	/**
	* @param {string} msg
	* @param {number} perLine
	*/
	module.exports = function(msg, perLine) {
		let lines = String(strip(msg) || "").split(/\r?\n/);
		if (!perLine) return lines.length;
		return lines.map((l) => Math.ceil(l.length / perLine)).reduce((a, b) => a + b);
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/wrap.js
var require_wrap$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* @param {string} msg The message to wrap
	* @param {object} opts
	* @param {number|string} [opts.margin] Left margin
	* @param {number} opts.width Maximum characters per line including the margin
	*/
	module.exports = (msg, opts = {}) => {
		const tab = Number.isSafeInteger(parseInt(opts.margin)) ? new Array(parseInt(opts.margin)).fill(" ").join("") : opts.margin || "";
		const width = opts.width;
		return (msg || "").split(/\r?\n/g).map((line) => line.split(/\s+/g).reduce((arr, w) => {
			if (w.length + tab.length >= width || arr[arr.length - 1].length + w.length + 1 < width) arr[arr.length - 1] += ` ${w}`;
			else arr.push(`${tab}${w}`);
			return arr;
		}, [tab]).join("\n")).join("\n");
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/entriesToDisplay.js
var require_entriesToDisplay$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Determine what entries should be displayed on the screen, based on the
	* currently selected index and the maximum visible. Used in list-based
	* prompts like `select` and `multiselect`.
	*
	* @param {number} cursor the currently selected entry
	* @param {number} total the total entries available to display
	* @param {number} [maxVisible] the number of entries that can be displayed
	*/
	module.exports = (cursor, total, maxVisible) => {
		maxVisible = maxVisible || total;
		let startIndex = Math.min(total - maxVisible, cursor - Math.floor(maxVisible / 2));
		if (startIndex < 0) startIndex = 0;
		let endIndex = Math.min(startIndex + maxVisible, total);
		return {
			startIndex,
			endIndex
		};
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/index.js
var require_util$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		action: require_action$1(),
		clear: require_clear$1(),
		style: require_style$1(),
		strip: require_strip$1(),
		figures: require_figures$1(),
		lines: require_lines$1(),
		wrap: require_wrap$1(),
		entriesToDisplay: require_entriesToDisplay$1()
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/prompt.js
var require_prompt$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const readline$1 = __require$1("readline");
	const action = require_util$1().action;
	const EventEmitter$1 = __require$1("events");
	const _require2 = require_src(), beep = _require2.beep, cursor = _require2.cursor;
	const color = require_kleur();
	/**
	* Base prompt skeleton
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var Prompt = class extends EventEmitter$1 {
		constructor(opts = {}) {
			super();
			this.firstRender = true;
			this.in = opts.stdin || process.stdin;
			this.out = opts.stdout || process.stdout;
			this.onRender = (opts.onRender || (() => void 0)).bind(this);
			const rl = readline$1.createInterface({
				input: this.in,
				escapeCodeTimeout: 50
			});
			readline$1.emitKeypressEvents(this.in, rl);
			if (this.in.isTTY) this.in.setRawMode(true);
			const isSelect = ["SelectPrompt", "MultiselectPrompt"].indexOf(this.constructor.name) > -1;
			const keypress = (str, key) => {
				let a = action(key, isSelect);
				if (a === false) this._ && this._(str, key);
				else if (typeof this[a] === "function") this[a](key);
				else this.bell();
			};
			this.close = () => {
				this.out.write(cursor.show);
				this.in.removeListener("keypress", keypress);
				if (this.in.isTTY) this.in.setRawMode(false);
				rl.close();
				this.emit(this.aborted ? "abort" : this.exited ? "exit" : "submit", this.value);
				this.closed = true;
			};
			this.in.on("keypress", keypress);
		}
		fire() {
			this.emit("state", {
				value: this.value,
				aborted: !!this.aborted,
				exited: !!this.exited
			});
		}
		bell() {
			this.out.write(beep);
		}
		render() {
			this.onRender(color);
			if (this.firstRender) this.firstRender = false;
		}
	};
	module.exports = Prompt;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/text.js
var require_text$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
		try {
			var info = gen[key](arg);
			var value = info.value;
		} catch (error) {
			reject(error);
			return;
		}
		if (info.done) resolve(value);
		else Promise.resolve(value).then(_next, _throw);
	}
	function _asyncToGenerator(fn) {
		return function() {
			var self = this, args = arguments;
			return new Promise(function(resolve, reject) {
				var gen = fn.apply(self, args);
				function _next(value) {
					asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
				}
				function _throw(err) {
					asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
				}
				_next(void 0);
			});
		};
	}
	const color = require_kleur();
	const Prompt = require_prompt$1();
	const _require = require_src(), erase = _require.erase, cursor = _require.cursor;
	const _require2 = require_util$1(), style = _require2.style, clear = _require2.clear, lines = _require2.lines, figures = _require2.figures;
	/**
	* TextPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {String} [opts.style='default'] Render style
	* @param {String} [opts.initial] Default value
	* @param {Function} [opts.validate] Validate function
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {String} [opts.error] The invalid error label
	*/
	var TextPrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.transform = style.render(opts.style);
			this.scale = this.transform.scale;
			this.msg = opts.message;
			this.initial = opts.initial || ``;
			this.validator = opts.validate || (() => true);
			this.value = ``;
			this.errorMsg = opts.error || `Please Enter A Valid Value`;
			this.cursor = Number(!!this.initial);
			this.cursorOffset = 0;
			this.clear = clear(``, this.out.columns);
			this.render();
		}
		set value(v) {
			if (!v && this.initial) {
				this.placeholder = true;
				this.rendered = color.gray(this.transform.render(this.initial));
			} else {
				this.placeholder = false;
				this.rendered = this.transform.render(v);
			}
			this._value = v;
			this.fire();
		}
		get value() {
			return this._value;
		}
		reset() {
			this.value = ``;
			this.cursor = Number(!!this.initial);
			this.cursorOffset = 0;
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.value = this.value || this.initial;
			this.done = this.aborted = true;
			this.error = false;
			this.red = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		validate() {
			var _this = this;
			return _asyncToGenerator(function* () {
				let valid = yield _this.validator(_this.value);
				if (typeof valid === `string`) {
					_this.errorMsg = valid;
					valid = false;
				}
				_this.error = !valid;
			})();
		}
		submit() {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				_this2.value = _this2.value || _this2.initial;
				_this2.cursorOffset = 0;
				_this2.cursor = _this2.rendered.length;
				yield _this2.validate();
				if (_this2.error) {
					_this2.red = true;
					_this2.fire();
					_this2.render();
					return;
				}
				_this2.done = true;
				_this2.aborted = false;
				_this2.fire();
				_this2.render();
				_this2.out.write("\n");
				_this2.close();
			})();
		}
		next() {
			if (!this.placeholder) return this.bell();
			this.value = this.initial;
			this.cursor = this.rendered.length;
			this.fire();
			this.render();
		}
		moveCursor(n) {
			if (this.placeholder) return;
			this.cursor = this.cursor + n;
			this.cursorOffset += n;
		}
		_(c, key) {
			let s1 = this.value.slice(0, this.cursor);
			let s2 = this.value.slice(this.cursor);
			this.value = `${s1}${c}${s2}`;
			this.red = false;
			this.cursor = this.placeholder ? 0 : s1.length + 1;
			this.render();
		}
		delete() {
			if (this.isCursorAtStart()) return this.bell();
			let s1 = this.value.slice(0, this.cursor - 1);
			let s2 = this.value.slice(this.cursor);
			this.value = `${s1}${s2}`;
			this.red = false;
			if (this.isCursorAtStart()) this.cursorOffset = 0;
			else {
				this.cursorOffset++;
				this.moveCursor(-1);
			}
			this.render();
		}
		deleteForward() {
			if (this.cursor * this.scale >= this.rendered.length || this.placeholder) return this.bell();
			let s1 = this.value.slice(0, this.cursor);
			let s2 = this.value.slice(this.cursor + 1);
			this.value = `${s1}${s2}`;
			this.red = false;
			if (this.isCursorAtEnd()) this.cursorOffset = 0;
			else this.cursorOffset++;
			this.render();
		}
		first() {
			this.cursor = 0;
			this.render();
		}
		last() {
			this.cursor = this.value.length;
			this.render();
		}
		left() {
			if (this.cursor <= 0 || this.placeholder) return this.bell();
			this.moveCursor(-1);
			this.render();
		}
		right() {
			if (this.cursor * this.scale >= this.rendered.length || this.placeholder) return this.bell();
			this.moveCursor(1);
			this.render();
		}
		isCursorAtStart() {
			return this.cursor === 0 || this.placeholder && this.cursor === 1;
		}
		isCursorAtEnd() {
			return this.cursor === this.rendered.length || this.placeholder && this.cursor === this.rendered.length + 1;
		}
		render() {
			if (this.closed) return;
			if (!this.firstRender) {
				if (this.outputError) this.out.write(cursor.down(lines(this.outputError, this.out.columns) - 1) + clear(this.outputError, this.out.columns));
				this.out.write(clear(this.outputText, this.out.columns));
			}
			super.render();
			this.outputError = "";
			this.outputText = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(this.done),
				this.red ? color.red(this.rendered) : this.rendered
			].join(` `);
			if (this.error) this.outputError += this.errorMsg.split(`\n`).reduce((a, l, i) => a + `\n${i ? " " : figures.pointerSmall} ${color.red().italic(l)}`, ``);
			this.out.write(erase.line + cursor.to(0) + this.outputText + cursor.save + this.outputError + cursor.restore + cursor.move(this.cursorOffset, 0));
		}
	};
	module.exports = TextPrompt;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/select.js
var require_select$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const color = require_kleur();
	const Prompt = require_prompt$1();
	const _require = require_util$1(), style = _require.style, clear = _require.clear, figures = _require.figures, wrap = _require.wrap, entriesToDisplay = _require.entriesToDisplay;
	const cursor = require_src().cursor;
	/**
	* SelectPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Array} opts.choices Array of choice objects
	* @param {String} [opts.hint] Hint to display
	* @param {Number} [opts.initial] Index of default value
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {Number} [opts.optionsPerPage=10] Max options to display at once
	*/
	var SelectPrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.hint = opts.hint || "- Use arrow-keys. Return to submit.";
			this.warn = opts.warn || "- This option is disabled";
			this.cursor = opts.initial || 0;
			this.choices = opts.choices.map((ch, idx) => {
				if (typeof ch === "string") ch = {
					title: ch,
					value: idx
				};
				return {
					title: ch && (ch.title || ch.value || ch),
					value: ch && (ch.value === void 0 ? idx : ch.value),
					description: ch && ch.description,
					selected: ch && ch.selected,
					disabled: ch && ch.disabled
				};
			});
			this.optionsPerPage = opts.optionsPerPage || 10;
			this.value = (this.choices[this.cursor] || {}).value;
			this.clear = clear("", this.out.columns);
			this.render();
		}
		moveCursor(n) {
			this.cursor = n;
			this.value = this.choices[n].value;
			this.fire();
		}
		reset() {
			this.moveCursor(0);
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			if (!this.selection.disabled) {
				this.done = true;
				this.aborted = false;
				this.fire();
				this.render();
				this.out.write("\n");
				this.close();
			} else this.bell();
		}
		first() {
			this.moveCursor(0);
			this.render();
		}
		last() {
			this.moveCursor(this.choices.length - 1);
			this.render();
		}
		up() {
			if (this.cursor === 0) this.moveCursor(this.choices.length - 1);
			else this.moveCursor(this.cursor - 1);
			this.render();
		}
		down() {
			if (this.cursor === this.choices.length - 1) this.moveCursor(0);
			else this.moveCursor(this.cursor + 1);
			this.render();
		}
		next() {
			this.moveCursor((this.cursor + 1) % this.choices.length);
			this.render();
		}
		_(c, key) {
			if (c === " ") return this.submit();
		}
		get selection() {
			return this.choices[this.cursor];
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			else this.out.write(clear(this.outputText, this.out.columns));
			super.render();
			let _entriesToDisplay = entriesToDisplay(this.cursor, this.choices.length, this.optionsPerPage), startIndex = _entriesToDisplay.startIndex, endIndex = _entriesToDisplay.endIndex;
			this.outputText = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(false),
				this.done ? this.selection.title : this.selection.disabled ? color.yellow(this.warn) : color.gray(this.hint)
			].join(" ");
			if (!this.done) {
				this.outputText += "\n";
				for (let i = startIndex; i < endIndex; i++) {
					let title, prefix, desc = "", v = this.choices[i];
					if (i === startIndex && startIndex > 0) prefix = figures.arrowUp;
					else if (i === endIndex - 1 && endIndex < this.choices.length) prefix = figures.arrowDown;
					else prefix = " ";
					if (v.disabled) {
						title = this.cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
						prefix = (this.cursor === i ? color.bold().gray(figures.pointer) + " " : "  ") + prefix;
					} else {
						title = this.cursor === i ? color.cyan().underline(v.title) : v.title;
						prefix = (this.cursor === i ? color.cyan(figures.pointer) + " " : "  ") + prefix;
						if (v.description && this.cursor === i) {
							desc = ` - ${v.description}`;
							if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) desc = "\n" + wrap(v.description, {
								margin: 3,
								width: this.out.columns
							});
						}
					}
					this.outputText += `${prefix} ${title}${color.gray(desc)}\n`;
				}
			}
			this.out.write(this.outputText);
		}
	};
	module.exports = SelectPrompt;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/toggle.js
var require_toggle$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const color = require_kleur();
	const Prompt = require_prompt$1();
	const _require = require_util$1(), style = _require.style, clear = _require.clear;
	const _require2 = require_src(), cursor = _require2.cursor, erase = _require2.erase;
	/**
	* TogglePrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Boolean} [opts.initial=false] Default value
	* @param {String} [opts.active='no'] Active label
	* @param {String} [opts.inactive='off'] Inactive label
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var TogglePrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.value = !!opts.initial;
			this.active = opts.active || "on";
			this.inactive = opts.inactive || "off";
			this.initialValue = this.value;
			this.render();
		}
		reset() {
			this.value = this.initialValue;
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			this.done = true;
			this.aborted = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		deactivate() {
			if (this.value === false) return this.bell();
			this.value = false;
			this.render();
		}
		activate() {
			if (this.value === true) return this.bell();
			this.value = true;
			this.render();
		}
		delete() {
			this.deactivate();
		}
		left() {
			this.deactivate();
		}
		right() {
			this.activate();
		}
		down() {
			this.deactivate();
		}
		up() {
			this.activate();
		}
		next() {
			this.value = !this.value;
			this.fire();
			this.render();
		}
		_(c, key) {
			if (c === " ") this.value = !this.value;
			else if (c === "1") this.value = true;
			else if (c === "0") this.value = false;
			else return this.bell();
			this.render();
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			else this.out.write(clear(this.outputText, this.out.columns));
			super.render();
			this.outputText = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(this.done),
				this.value ? this.inactive : color.cyan().underline(this.inactive),
				color.gray("/"),
				this.value ? color.cyan().underline(this.active) : this.active
			].join(" ");
			this.out.write(erase.line + cursor.to(0) + this.outputText);
		}
	};
	module.exports = TogglePrompt;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/datepart.js
var require_datepart$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var DatePart = class DatePart {
		constructor({ token, date, parts, locales }) {
			this.token = token;
			this.date = date || /* @__PURE__ */ new Date();
			this.parts = parts || [this];
			this.locales = locales || {};
		}
		up() {}
		down() {}
		next() {
			const currentIdx = this.parts.indexOf(this);
			return this.parts.find((part, idx) => idx > currentIdx && part instanceof DatePart);
		}
		setTo(val) {}
		prev() {
			let parts = [].concat(this.parts).reverse();
			const currentIdx = parts.indexOf(this);
			return parts.find((part, idx) => idx > currentIdx && part instanceof DatePart);
		}
		toString() {
			return String(this.date);
		}
	};
	module.exports = DatePart;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/meridiem.js
var require_meridiem$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const DatePart = require_datepart$1();
	var Meridiem = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setHours((this.date.getHours() + 12) % 24);
		}
		down() {
			this.up();
		}
		toString() {
			let meridiem = this.date.getHours() > 12 ? "pm" : "am";
			return /\A/.test(this.token) ? meridiem.toUpperCase() : meridiem;
		}
	};
	module.exports = Meridiem;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/day.js
var require_day$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const DatePart = require_datepart$1();
	const pos = (n) => {
		n = n % 10;
		return n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th";
	};
	var Day = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setDate(this.date.getDate() + 1);
		}
		down() {
			this.date.setDate(this.date.getDate() - 1);
		}
		setTo(val) {
			this.date.setDate(parseInt(val.substr(-2)));
		}
		toString() {
			let date = this.date.getDate();
			let day = this.date.getDay();
			return this.token === "DD" ? String(date).padStart(2, "0") : this.token === "Do" ? date + pos(date) : this.token === "d" ? day + 1 : this.token === "ddd" ? this.locales.weekdaysShort[day] : this.token === "dddd" ? this.locales.weekdays[day] : date;
		}
	};
	module.exports = Day;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/hours.js
var require_hours$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const DatePart = require_datepart$1();
	var Hours = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setHours(this.date.getHours() + 1);
		}
		down() {
			this.date.setHours(this.date.getHours() - 1);
		}
		setTo(val) {
			this.date.setHours(parseInt(val.substr(-2)));
		}
		toString() {
			let hours = this.date.getHours();
			if (/h/.test(this.token)) hours = hours % 12 || 12;
			return this.token.length > 1 ? String(hours).padStart(2, "0") : hours;
		}
	};
	module.exports = Hours;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/milliseconds.js
var require_milliseconds$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const DatePart = require_datepart$1();
	var Milliseconds = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setMilliseconds(this.date.getMilliseconds() + 1);
		}
		down() {
			this.date.setMilliseconds(this.date.getMilliseconds() - 1);
		}
		setTo(val) {
			this.date.setMilliseconds(parseInt(val.substr(-this.token.length)));
		}
		toString() {
			return String(this.date.getMilliseconds()).padStart(4, "0").substr(0, this.token.length);
		}
	};
	module.exports = Milliseconds;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/minutes.js
var require_minutes$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const DatePart = require_datepart$1();
	var Minutes = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setMinutes(this.date.getMinutes() + 1);
		}
		down() {
			this.date.setMinutes(this.date.getMinutes() - 1);
		}
		setTo(val) {
			this.date.setMinutes(parseInt(val.substr(-2)));
		}
		toString() {
			let m = this.date.getMinutes();
			return this.token.length > 1 ? String(m).padStart(2, "0") : m;
		}
	};
	module.exports = Minutes;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/month.js
var require_month$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const DatePart = require_datepart$1();
	var Month = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setMonth(this.date.getMonth() + 1);
		}
		down() {
			this.date.setMonth(this.date.getMonth() - 1);
		}
		setTo(val) {
			val = parseInt(val.substr(-2)) - 1;
			this.date.setMonth(val < 0 ? 0 : val);
		}
		toString() {
			let month = this.date.getMonth();
			let tl = this.token.length;
			return tl === 2 ? String(month + 1).padStart(2, "0") : tl === 3 ? this.locales.monthsShort[month] : tl === 4 ? this.locales.months[month] : String(month + 1);
		}
	};
	module.exports = Month;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/seconds.js
var require_seconds$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const DatePart = require_datepart$1();
	var Seconds = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setSeconds(this.date.getSeconds() + 1);
		}
		down() {
			this.date.setSeconds(this.date.getSeconds() - 1);
		}
		setTo(val) {
			this.date.setSeconds(parseInt(val.substr(-2)));
		}
		toString() {
			let s = this.date.getSeconds();
			return this.token.length > 1 ? String(s).padStart(2, "0") : s;
		}
	};
	module.exports = Seconds;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/year.js
var require_year$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const DatePart = require_datepart$1();
	var Year = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setFullYear(this.date.getFullYear() + 1);
		}
		down() {
			this.date.setFullYear(this.date.getFullYear() - 1);
		}
		setTo(val) {
			this.date.setFullYear(val.substr(-4));
		}
		toString() {
			let year = String(this.date.getFullYear()).padStart(4, "0");
			return this.token.length === 2 ? year.substr(-2) : year;
		}
	};
	module.exports = Year;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/index.js
var require_dateparts$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		DatePart: require_datepart$1(),
		Meridiem: require_meridiem$1(),
		Day: require_day$1(),
		Hours: require_hours$1(),
		Milliseconds: require_milliseconds$1(),
		Minutes: require_minutes$1(),
		Month: require_month$1(),
		Seconds: require_seconds$1(),
		Year: require_year$1()
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/date.js
var require_date$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
		try {
			var info = gen[key](arg);
			var value = info.value;
		} catch (error) {
			reject(error);
			return;
		}
		if (info.done) resolve(value);
		else Promise.resolve(value).then(_next, _throw);
	}
	function _asyncToGenerator(fn) {
		return function() {
			var self = this, args = arguments;
			return new Promise(function(resolve, reject) {
				var gen = fn.apply(self, args);
				function _next(value) {
					asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
				}
				function _throw(err) {
					asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
				}
				_next(void 0);
			});
		};
	}
	const color = require_kleur();
	const Prompt = require_prompt$1();
	const _require = require_util$1(), style = _require.style, clear = _require.clear, figures = _require.figures;
	const _require2 = require_src(), erase = _require2.erase, cursor = _require2.cursor;
	const _require3 = require_dateparts$1(), DatePart = _require3.DatePart, Meridiem = _require3.Meridiem, Day = _require3.Day, Hours = _require3.Hours, Milliseconds = _require3.Milliseconds, Minutes = _require3.Minutes, Month = _require3.Month, Seconds = _require3.Seconds, Year = _require3.Year;
	const regex = /\\(.)|"((?:\\["\\]|[^"])+)"|(D[Do]?|d{3,4}|d)|(M{1,4})|(YY(?:YY)?)|([aA])|([Hh]{1,2})|(m{1,2})|(s{1,2})|(S{1,4})|./g;
	const regexGroups = {
		1: ({ token }) => token.replace(/\\(.)/g, "$1"),
		2: (opts) => new Day(opts),
		3: (opts) => new Month(opts),
		4: (opts) => new Year(opts),
		5: (opts) => new Meridiem(opts),
		6: (opts) => new Hours(opts),
		7: (opts) => new Minutes(opts),
		8: (opts) => new Seconds(opts),
		9: (opts) => new Milliseconds(opts)
	};
	const dfltLocales = {
		months: "January,February,March,April,May,June,July,August,September,October,November,December".split(","),
		monthsShort: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),
		weekdays: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),
		weekdaysShort: "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(",")
	};
	/**
	* DatePrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Number} [opts.initial] Index of default value
	* @param {String} [opts.mask] The format mask
	* @param {object} [opts.locales] The date locales
	* @param {String} [opts.error] The error message shown on invalid value
	* @param {Function} [opts.validate] Function to validate the submitted value
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var DatePrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.cursor = 0;
			this.typed = "";
			this.locales = Object.assign(dfltLocales, opts.locales);
			this._date = opts.initial || /* @__PURE__ */ new Date();
			this.errorMsg = opts.error || "Please Enter A Valid Value";
			this.validator = opts.validate || (() => true);
			this.mask = opts.mask || "YYYY-MM-DD HH:mm:ss";
			this.clear = clear("", this.out.columns);
			this.render();
		}
		get value() {
			return this.date;
		}
		get date() {
			return this._date;
		}
		set date(date) {
			if (date) this._date.setTime(date.getTime());
		}
		set mask(mask) {
			let result;
			this.parts = [];
			while (result = regex.exec(mask)) {
				let match = result.shift();
				let idx = result.findIndex((gr) => gr != null);
				this.parts.push(idx in regexGroups ? regexGroups[idx]({
					token: result[idx] || match,
					date: this.date,
					parts: this.parts,
					locales: this.locales
				}) : result[idx] || match);
			}
			let parts = this.parts.reduce((arr, i) => {
				if (typeof i === "string" && typeof arr[arr.length - 1] === "string") arr[arr.length - 1] += i;
				else arr.push(i);
				return arr;
			}, []);
			this.parts.splice(0);
			this.parts.push(...parts);
			this.reset();
		}
		moveCursor(n) {
			this.typed = "";
			this.cursor = n;
			this.fire();
		}
		reset() {
			this.moveCursor(this.parts.findIndex((p) => p instanceof DatePart));
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.error = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		validate() {
			var _this = this;
			return _asyncToGenerator(function* () {
				let valid = yield _this.validator(_this.value);
				if (typeof valid === "string") {
					_this.errorMsg = valid;
					valid = false;
				}
				_this.error = !valid;
			})();
		}
		submit() {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				yield _this2.validate();
				if (_this2.error) {
					_this2.color = "red";
					_this2.fire();
					_this2.render();
					return;
				}
				_this2.done = true;
				_this2.aborted = false;
				_this2.fire();
				_this2.render();
				_this2.out.write("\n");
				_this2.close();
			})();
		}
		up() {
			this.typed = "";
			this.parts[this.cursor].up();
			this.render();
		}
		down() {
			this.typed = "";
			this.parts[this.cursor].down();
			this.render();
		}
		left() {
			let prev = this.parts[this.cursor].prev();
			if (prev == null) return this.bell();
			this.moveCursor(this.parts.indexOf(prev));
			this.render();
		}
		right() {
			let next = this.parts[this.cursor].next();
			if (next == null) return this.bell();
			this.moveCursor(this.parts.indexOf(next));
			this.render();
		}
		next() {
			let next = this.parts[this.cursor].next();
			this.moveCursor(next ? this.parts.indexOf(next) : this.parts.findIndex((part) => part instanceof DatePart));
			this.render();
		}
		_(c) {
			if (/\d/.test(c)) {
				this.typed += c;
				this.parts[this.cursor].setTo(this.typed);
				this.render();
			}
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			else this.out.write(clear(this.outputText, this.out.columns));
			super.render();
			this.outputText = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(false),
				this.parts.reduce((arr, p, idx) => arr.concat(idx === this.cursor && !this.done ? color.cyan().underline(p.toString()) : p), []).join("")
			].join(" ");
			if (this.error) this.outputText += this.errorMsg.split("\n").reduce((a, l, i) => a + `\n${i ? ` ` : figures.pointerSmall} ${color.red().italic(l)}`, ``);
			this.out.write(erase.line + cursor.to(0) + this.outputText);
		}
	};
	module.exports = DatePrompt;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/number.js
var require_number$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
		try {
			var info = gen[key](arg);
			var value = info.value;
		} catch (error) {
			reject(error);
			return;
		}
		if (info.done) resolve(value);
		else Promise.resolve(value).then(_next, _throw);
	}
	function _asyncToGenerator(fn) {
		return function() {
			var self = this, args = arguments;
			return new Promise(function(resolve, reject) {
				var gen = fn.apply(self, args);
				function _next(value) {
					asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
				}
				function _throw(err) {
					asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
				}
				_next(void 0);
			});
		};
	}
	const color = require_kleur();
	const Prompt = require_prompt$1();
	const _require = require_src(), cursor = _require.cursor, erase = _require.erase;
	const _require2 = require_util$1(), style = _require2.style, figures = _require2.figures, clear = _require2.clear, lines = _require2.lines;
	const isNumber = /[0-9]/;
	const isDef = (any) => any !== void 0;
	const round = (number, precision) => {
		let factor = Math.pow(10, precision);
		return Math.round(number * factor) / factor;
	};
	/**
	* NumberPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {String} [opts.style='default'] Render style
	* @param {Number} [opts.initial] Default value
	* @param {Number} [opts.max=+Infinity] Max value
	* @param {Number} [opts.min=-Infinity] Min value
	* @param {Boolean} [opts.float=false] Parse input as floats
	* @param {Number} [opts.round=2] Round floats to x decimals
	* @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
	* @param {Function} [opts.validate] Validate function
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {String} [opts.error] The invalid error label
	*/
	var NumberPrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.transform = style.render(opts.style);
			this.msg = opts.message;
			this.initial = isDef(opts.initial) ? opts.initial : "";
			this.float = !!opts.float;
			this.round = opts.round || 2;
			this.inc = opts.increment || 1;
			this.min = isDef(opts.min) ? opts.min : -Infinity;
			this.max = isDef(opts.max) ? opts.max : Infinity;
			this.errorMsg = opts.error || `Please Enter A Valid Value`;
			this.validator = opts.validate || (() => true);
			this.color = `cyan`;
			this.value = ``;
			this.typed = ``;
			this.lastHit = 0;
			this.render();
		}
		set value(v) {
			if (!v && v !== 0) {
				this.placeholder = true;
				this.rendered = color.gray(this.transform.render(`${this.initial}`));
				this._value = ``;
			} else {
				this.placeholder = false;
				this.rendered = this.transform.render(`${round(v, this.round)}`);
				this._value = round(v, this.round);
			}
			this.fire();
		}
		get value() {
			return this._value;
		}
		parse(x) {
			return this.float ? parseFloat(x) : parseInt(x);
		}
		valid(c) {
			return c === `-` || c === `.` && this.float || isNumber.test(c);
		}
		reset() {
			this.typed = ``;
			this.value = ``;
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			let x = this.value;
			this.value = x !== `` ? x : this.initial;
			this.done = this.aborted = true;
			this.error = false;
			this.fire();
			this.render();
			this.out.write(`\n`);
			this.close();
		}
		validate() {
			var _this = this;
			return _asyncToGenerator(function* () {
				let valid = yield _this.validator(_this.value);
				if (typeof valid === `string`) {
					_this.errorMsg = valid;
					valid = false;
				}
				_this.error = !valid;
			})();
		}
		submit() {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				yield _this2.validate();
				if (_this2.error) {
					_this2.color = `red`;
					_this2.fire();
					_this2.render();
					return;
				}
				let x = _this2.value;
				_this2.value = x !== `` ? x : _this2.initial;
				_this2.done = true;
				_this2.aborted = false;
				_this2.error = false;
				_this2.fire();
				_this2.render();
				_this2.out.write(`\n`);
				_this2.close();
			})();
		}
		up() {
			this.typed = ``;
			if (this.value === "") this.value = this.min - this.inc;
			if (this.value >= this.max) return this.bell();
			this.value += this.inc;
			this.color = `cyan`;
			this.fire();
			this.render();
		}
		down() {
			this.typed = ``;
			if (this.value === "") this.value = this.min + this.inc;
			if (this.value <= this.min) return this.bell();
			this.value -= this.inc;
			this.color = `cyan`;
			this.fire();
			this.render();
		}
		delete() {
			let val = this.value.toString();
			if (val.length === 0) return this.bell();
			this.value = this.parse(val = val.slice(0, -1)) || ``;
			if (this.value !== "" && this.value < this.min) this.value = this.min;
			this.color = `cyan`;
			this.fire();
			this.render();
		}
		next() {
			this.value = this.initial;
			this.fire();
			this.render();
		}
		_(c, key) {
			if (!this.valid(c)) return this.bell();
			const now = Date.now();
			if (now - this.lastHit > 1e3) this.typed = ``;
			this.typed += c;
			this.lastHit = now;
			this.color = `cyan`;
			if (c === `.`) return this.fire();
			this.value = Math.min(this.parse(this.typed), this.max);
			if (this.value > this.max) this.value = this.max;
			if (this.value < this.min) this.value = this.min;
			this.fire();
			this.render();
		}
		render() {
			if (this.closed) return;
			if (!this.firstRender) {
				if (this.outputError) this.out.write(cursor.down(lines(this.outputError, this.out.columns) - 1) + clear(this.outputError, this.out.columns));
				this.out.write(clear(this.outputText, this.out.columns));
			}
			super.render();
			this.outputError = "";
			this.outputText = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(this.done),
				!this.done || !this.done && !this.placeholder ? color[this.color]().underline(this.rendered) : this.rendered
			].join(` `);
			if (this.error) this.outputError += this.errorMsg.split(`\n`).reduce((a, l, i) => a + `\n${i ? ` ` : figures.pointerSmall} ${color.red().italic(l)}`, ``);
			this.out.write(erase.line + cursor.to(0) + this.outputText + cursor.save + this.outputError + cursor.restore);
		}
	};
	module.exports = NumberPrompt;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/multiselect.js
var require_multiselect$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const color = require_kleur();
	const cursor = require_src().cursor;
	const Prompt = require_prompt$1();
	const _require2 = require_util$1(), clear = _require2.clear, figures = _require2.figures, style = _require2.style, wrap = _require2.wrap, entriesToDisplay = _require2.entriesToDisplay;
	/**
	* MultiselectPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Array} opts.choices Array of choice objects
	* @param {String} [opts.hint] Hint to display
	* @param {String} [opts.warn] Hint shown for disabled choices
	* @param {Number} [opts.max] Max choices
	* @param {Number} [opts.cursor=0] Cursor start position
	* @param {Number} [opts.optionsPerPage=10] Max options to display at once
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var MultiselectPrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.cursor = opts.cursor || 0;
			this.scrollIndex = opts.cursor || 0;
			this.hint = opts.hint || "";
			this.warn = opts.warn || "- This option is disabled -";
			this.minSelected = opts.min;
			this.showMinError = false;
			this.maxChoices = opts.max;
			this.instructions = opts.instructions;
			this.optionsPerPage = opts.optionsPerPage || 10;
			this.value = opts.choices.map((ch, idx) => {
				if (typeof ch === "string") ch = {
					title: ch,
					value: idx
				};
				return {
					title: ch && (ch.title || ch.value || ch),
					description: ch && ch.description,
					value: ch && (ch.value === void 0 ? idx : ch.value),
					selected: ch && ch.selected,
					disabled: ch && ch.disabled
				};
			});
			this.clear = clear("", this.out.columns);
			if (!opts.overrideRender) this.render();
		}
		reset() {
			this.value.map((v) => !v.selected);
			this.cursor = 0;
			this.fire();
			this.render();
		}
		selected() {
			return this.value.filter((v) => v.selected);
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			const selected = this.value.filter((e) => e.selected);
			if (this.minSelected && selected.length < this.minSelected) {
				this.showMinError = true;
				this.render();
			} else {
				this.done = true;
				this.aborted = false;
				this.fire();
				this.render();
				this.out.write("\n");
				this.close();
			}
		}
		first() {
			this.cursor = 0;
			this.render();
		}
		last() {
			this.cursor = this.value.length - 1;
			this.render();
		}
		next() {
			this.cursor = (this.cursor + 1) % this.value.length;
			this.render();
		}
		up() {
			if (this.cursor === 0) this.cursor = this.value.length - 1;
			else this.cursor--;
			this.render();
		}
		down() {
			if (this.cursor === this.value.length - 1) this.cursor = 0;
			else this.cursor++;
			this.render();
		}
		left() {
			this.value[this.cursor].selected = false;
			this.render();
		}
		right() {
			if (this.value.filter((e) => e.selected).length >= this.maxChoices) return this.bell();
			this.value[this.cursor].selected = true;
			this.render();
		}
		handleSpaceToggle() {
			const v = this.value[this.cursor];
			if (v.selected) {
				v.selected = false;
				this.render();
			} else if (v.disabled || this.value.filter((e) => e.selected).length >= this.maxChoices) return this.bell();
			else {
				v.selected = true;
				this.render();
			}
		}
		toggleAll() {
			if (this.maxChoices !== void 0 || this.value[this.cursor].disabled) return this.bell();
			const newSelected = !this.value[this.cursor].selected;
			this.value.filter((v) => !v.disabled).forEach((v) => v.selected = newSelected);
			this.render();
		}
		_(c, key) {
			if (c === " ") this.handleSpaceToggle();
			else if (c === "a") this.toggleAll();
			else return this.bell();
		}
		renderInstructions() {
			if (this.instructions === void 0 || this.instructions) {
				if (typeof this.instructions === "string") return this.instructions;
				return `
Instructions:
    ${figures.arrowUp}/${figures.arrowDown}: Highlight option\n    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection\n` + (this.maxChoices === void 0 ? `    a: Toggle all\n` : "") + `    enter/return: Complete answer`;
			}
			return "";
		}
		renderOption(cursor, v, i, arrowIndicator) {
			const prefix = (v.selected ? color.green(figures.radioOn) : figures.radioOff) + " " + arrowIndicator + " ";
			let title, desc;
			if (v.disabled) title = cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
			else {
				title = cursor === i ? color.cyan().underline(v.title) : v.title;
				if (cursor === i && v.description) {
					desc = ` - ${v.description}`;
					if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) desc = "\n" + wrap(v.description, {
						margin: prefix.length,
						width: this.out.columns
					});
				}
			}
			return prefix + title + color.gray(desc || "");
		}
		paginateOptions(options) {
			if (options.length === 0) return color.red("No matches for this query.");
			let _entriesToDisplay = entriesToDisplay(this.cursor, options.length, this.optionsPerPage), startIndex = _entriesToDisplay.startIndex, endIndex = _entriesToDisplay.endIndex;
			let prefix, styledOptions = [];
			for (let i = startIndex; i < endIndex; i++) {
				if (i === startIndex && startIndex > 0) prefix = figures.arrowUp;
				else if (i === endIndex - 1 && endIndex < options.length) prefix = figures.arrowDown;
				else prefix = " ";
				styledOptions.push(this.renderOption(this.cursor, options[i], i, prefix));
			}
			return "\n" + styledOptions.join("\n");
		}
		renderOptions(options) {
			if (!this.done) return this.paginateOptions(options);
			return "";
		}
		renderDoneOrInstructions() {
			if (this.done) return this.value.filter((e) => e.selected).map((v) => v.title).join(", ");
			const output = [color.gray(this.hint), this.renderInstructions()];
			if (this.value[this.cursor].disabled) output.push(color.yellow(this.warn));
			return output.join(" ");
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			super.render();
			let prompt = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(false),
				this.renderDoneOrInstructions()
			].join(" ");
			if (this.showMinError) {
				prompt += color.red(`You must select a minimum of ${this.minSelected} choices.`);
				this.showMinError = false;
			}
			prompt += this.renderOptions(this.value);
			this.out.write(this.clear + prompt);
			this.clear = clear(prompt, this.out.columns);
		}
	};
	module.exports = MultiselectPrompt;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/autocomplete.js
var require_autocomplete$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
		try {
			var info = gen[key](arg);
			var value = info.value;
		} catch (error) {
			reject(error);
			return;
		}
		if (info.done) resolve(value);
		else Promise.resolve(value).then(_next, _throw);
	}
	function _asyncToGenerator(fn) {
		return function() {
			var self = this, args = arguments;
			return new Promise(function(resolve, reject) {
				var gen = fn.apply(self, args);
				function _next(value) {
					asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
				}
				function _throw(err) {
					asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
				}
				_next(void 0);
			});
		};
	}
	const color = require_kleur();
	const Prompt = require_prompt$1();
	const _require = require_src(), erase = _require.erase, cursor = _require.cursor;
	const _require2 = require_util$1(), style = _require2.style, clear = _require2.clear, figures = _require2.figures, wrap = _require2.wrap, entriesToDisplay = _require2.entriesToDisplay;
	const getVal = (arr, i) => arr[i] && (arr[i].value || arr[i].title || arr[i]);
	const getTitle = (arr, i) => arr[i] && (arr[i].title || arr[i].value || arr[i]);
	const getIndex = (arr, valOrTitle) => {
		const index = arr.findIndex((el) => el.value === valOrTitle || el.title === valOrTitle);
		return index > -1 ? index : void 0;
	};
	/**
	* TextPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Array} opts.choices Array of auto-complete choices objects
	* @param {Function} [opts.suggest] Filter function. Defaults to sort by title
	* @param {Number} [opts.limit=10] Max number of results to show
	* @param {Number} [opts.cursor=0] Cursor start position
	* @param {String} [opts.style='default'] Render style
	* @param {String} [opts.fallback] Fallback message - initial to default value
	* @param {String} [opts.initial] Index of the default value
	* @param {Boolean} [opts.clearFirst] The first ESCAPE keypress will clear the input
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {String} [opts.noMatches] The no matches found label
	*/
	var AutocompletePrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.suggest = opts.suggest;
			this.choices = opts.choices;
			this.initial = typeof opts.initial === "number" ? opts.initial : getIndex(opts.choices, opts.initial);
			this.select = this.initial || opts.cursor || 0;
			this.i18n = { noMatches: opts.noMatches || "no matches found" };
			this.fallback = opts.fallback || this.initial;
			this.clearFirst = opts.clearFirst || false;
			this.suggestions = [];
			this.input = "";
			this.limit = opts.limit || 10;
			this.cursor = 0;
			this.transform = style.render(opts.style);
			this.scale = this.transform.scale;
			this.render = this.render.bind(this);
			this.complete = this.complete.bind(this);
			this.clear = clear("", this.out.columns);
			this.complete(this.render);
			this.render();
		}
		set fallback(fb) {
			this._fb = Number.isSafeInteger(parseInt(fb)) ? parseInt(fb) : fb;
		}
		get fallback() {
			let choice;
			if (typeof this._fb === "number") choice = this.choices[this._fb];
			else if (typeof this._fb === "string") choice = { title: this._fb };
			return choice || this._fb || { title: this.i18n.noMatches };
		}
		moveSelect(i) {
			this.select = i;
			if (this.suggestions.length > 0) this.value = getVal(this.suggestions, i);
			else this.value = this.fallback.value;
			this.fire();
		}
		complete(cb) {
			var _this = this;
			return _asyncToGenerator(function* () {
				const p = _this.completing = _this.suggest(_this.input, _this.choices);
				const suggestions = yield p;
				if (_this.completing !== p) return;
				_this.suggestions = suggestions.map((s, i, arr) => ({
					title: getTitle(arr, i),
					value: getVal(arr, i),
					description: s.description
				}));
				_this.completing = false;
				const l = Math.max(suggestions.length - 1, 0);
				_this.moveSelect(Math.min(l, _this.select));
				cb && cb();
			})();
		}
		reset() {
			this.input = "";
			this.complete(() => {
				this.moveSelect(this.initial !== void 0 ? this.initial : 0);
				this.render();
			});
			this.render();
		}
		exit() {
			if (this.clearFirst && this.input.length > 0) this.reset();
			else {
				this.done = this.exited = true;
				this.aborted = false;
				this.fire();
				this.render();
				this.out.write("\n");
				this.close();
			}
		}
		abort() {
			this.done = this.aborted = true;
			this.exited = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			this.done = true;
			this.aborted = this.exited = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		_(c, key) {
			let s1 = this.input.slice(0, this.cursor);
			let s2 = this.input.slice(this.cursor);
			this.input = `${s1}${c}${s2}`;
			this.cursor = s1.length + 1;
			this.complete(this.render);
			this.render();
		}
		delete() {
			if (this.cursor === 0) return this.bell();
			let s1 = this.input.slice(0, this.cursor - 1);
			let s2 = this.input.slice(this.cursor);
			this.input = `${s1}${s2}`;
			this.complete(this.render);
			this.cursor = this.cursor - 1;
			this.render();
		}
		deleteForward() {
			if (this.cursor * this.scale >= this.rendered.length) return this.bell();
			let s1 = this.input.slice(0, this.cursor);
			let s2 = this.input.slice(this.cursor + 1);
			this.input = `${s1}${s2}`;
			this.complete(this.render);
			this.render();
		}
		first() {
			this.moveSelect(0);
			this.render();
		}
		last() {
			this.moveSelect(this.suggestions.length - 1);
			this.render();
		}
		up() {
			if (this.select === 0) this.moveSelect(this.suggestions.length - 1);
			else this.moveSelect(this.select - 1);
			this.render();
		}
		down() {
			if (this.select === this.suggestions.length - 1) this.moveSelect(0);
			else this.moveSelect(this.select + 1);
			this.render();
		}
		next() {
			if (this.select === this.suggestions.length - 1) this.moveSelect(0);
			else this.moveSelect(this.select + 1);
			this.render();
		}
		nextPage() {
			this.moveSelect(Math.min(this.select + this.limit, this.suggestions.length - 1));
			this.render();
		}
		prevPage() {
			this.moveSelect(Math.max(this.select - this.limit, 0));
			this.render();
		}
		left() {
			if (this.cursor <= 0) return this.bell();
			this.cursor = this.cursor - 1;
			this.render();
		}
		right() {
			if (this.cursor * this.scale >= this.rendered.length) return this.bell();
			this.cursor = this.cursor + 1;
			this.render();
		}
		renderOption(v, hovered, isStart, isEnd) {
			let desc;
			let prefix = isStart ? figures.arrowUp : isEnd ? figures.arrowDown : " ";
			let title = hovered ? color.cyan().underline(v.title) : v.title;
			prefix = (hovered ? color.cyan(figures.pointer) + " " : "  ") + prefix;
			if (v.description) {
				desc = ` - ${v.description}`;
				if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) desc = "\n" + wrap(v.description, {
					margin: 3,
					width: this.out.columns
				});
			}
			return prefix + " " + title + color.gray(desc || "");
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			else this.out.write(clear(this.outputText, this.out.columns));
			super.render();
			let _entriesToDisplay = entriesToDisplay(this.select, this.choices.length, this.limit), startIndex = _entriesToDisplay.startIndex, endIndex = _entriesToDisplay.endIndex;
			this.outputText = [
				style.symbol(this.done, this.aborted, this.exited),
				color.bold(this.msg),
				style.delimiter(this.completing),
				this.done && this.suggestions[this.select] ? this.suggestions[this.select].title : this.rendered = this.transform.render(this.input)
			].join(" ");
			if (!this.done) {
				const suggestions = this.suggestions.slice(startIndex, endIndex).map((item, i) => this.renderOption(item, this.select === i + startIndex, i === 0 && startIndex > 0, i + startIndex === endIndex - 1 && endIndex < this.choices.length)).join("\n");
				this.outputText += `\n` + (suggestions || color.gray(this.fallback.title));
			}
			this.out.write(erase.line + cursor.to(0) + this.outputText);
		}
	};
	module.exports = AutocompletePrompt;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/autocompleteMultiselect.js
var require_autocompleteMultiselect$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const color = require_kleur();
	const cursor = require_src().cursor;
	const MultiselectPrompt = require_multiselect$1();
	const _require2 = require_util$1(), clear = _require2.clear, style = _require2.style, figures = _require2.figures;
	/**
	* MultiselectPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Array} opts.choices Array of choice objects
	* @param {String} [opts.hint] Hint to display
	* @param {String} [opts.warn] Hint shown for disabled choices
	* @param {Number} [opts.max] Max choices
	* @param {Number} [opts.cursor=0] Cursor start position
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var AutocompleteMultiselectPrompt = class extends MultiselectPrompt {
		constructor(opts = {}) {
			opts.overrideRender = true;
			super(opts);
			this.inputValue = "";
			this.clear = clear("", this.out.columns);
			this.filteredOptions = this.value;
			this.render();
		}
		last() {
			this.cursor = this.filteredOptions.length - 1;
			this.render();
		}
		next() {
			this.cursor = (this.cursor + 1) % this.filteredOptions.length;
			this.render();
		}
		up() {
			if (this.cursor === 0) this.cursor = this.filteredOptions.length - 1;
			else this.cursor--;
			this.render();
		}
		down() {
			if (this.cursor === this.filteredOptions.length - 1) this.cursor = 0;
			else this.cursor++;
			this.render();
		}
		left() {
			this.filteredOptions[this.cursor].selected = false;
			this.render();
		}
		right() {
			if (this.value.filter((e) => e.selected).length >= this.maxChoices) return this.bell();
			this.filteredOptions[this.cursor].selected = true;
			this.render();
		}
		delete() {
			if (this.inputValue.length) {
				this.inputValue = this.inputValue.substr(0, this.inputValue.length - 1);
				this.updateFilteredOptions();
			}
		}
		updateFilteredOptions() {
			const currentHighlight = this.filteredOptions[this.cursor];
			this.filteredOptions = this.value.filter((v) => {
				if (this.inputValue) {
					if (typeof v.title === "string") {
						if (v.title.toLowerCase().includes(this.inputValue.toLowerCase())) return true;
					}
					if (typeof v.value === "string") {
						if (v.value.toLowerCase().includes(this.inputValue.toLowerCase())) return true;
					}
					return false;
				}
				return true;
			});
			const newHighlightIndex = this.filteredOptions.findIndex((v) => v === currentHighlight);
			this.cursor = newHighlightIndex < 0 ? 0 : newHighlightIndex;
			this.render();
		}
		handleSpaceToggle() {
			const v = this.filteredOptions[this.cursor];
			if (v.selected) {
				v.selected = false;
				this.render();
			} else if (v.disabled || this.value.filter((e) => e.selected).length >= this.maxChoices) return this.bell();
			else {
				v.selected = true;
				this.render();
			}
		}
		handleInputChange(c) {
			this.inputValue = this.inputValue + c;
			this.updateFilteredOptions();
		}
		_(c, key) {
			if (c === " ") this.handleSpaceToggle();
			else this.handleInputChange(c);
		}
		renderInstructions() {
			if (this.instructions === void 0 || this.instructions) {
				if (typeof this.instructions === "string") return this.instructions;
				return `
Instructions:
    ${figures.arrowUp}/${figures.arrowDown}: Highlight option
    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection
    [a,b,c]/delete: Filter choices
    enter/return: Complete answer
`;
			}
			return "";
		}
		renderCurrentInput() {
			return `
Filtered results for: ${this.inputValue ? this.inputValue : color.gray("Enter something to filter")}\n`;
		}
		renderOption(cursor, v, i) {
			let title;
			if (v.disabled) title = cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
			else title = cursor === i ? color.cyan().underline(v.title) : v.title;
			return (v.selected ? color.green(figures.radioOn) : figures.radioOff) + "  " + title;
		}
		renderDoneOrInstructions() {
			if (this.done) return this.value.filter((e) => e.selected).map((v) => v.title).join(", ");
			const output = [
				color.gray(this.hint),
				this.renderInstructions(),
				this.renderCurrentInput()
			];
			if (this.filteredOptions.length && this.filteredOptions[this.cursor].disabled) output.push(color.yellow(this.warn));
			return output.join(" ");
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			super.render();
			let prompt = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(false),
				this.renderDoneOrInstructions()
			].join(" ");
			if (this.showMinError) {
				prompt += color.red(`You must select a minimum of ${this.minSelected} choices.`);
				this.showMinError = false;
			}
			prompt += this.renderOptions(this.filteredOptions);
			this.out.write(this.clear + prompt);
			this.clear = clear(prompt, this.out.columns);
		}
	};
	module.exports = AutocompleteMultiselectPrompt;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/confirm.js
var require_confirm$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const color = require_kleur();
	const Prompt = require_prompt$1();
	const _require = require_util$1(), style = _require.style, clear = _require.clear;
	const _require2 = require_src(), erase = _require2.erase, cursor = _require2.cursor;
	/**
	* ConfirmPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Boolean} [opts.initial] Default value (true/false)
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {String} [opts.yes] The "Yes" label
	* @param {String} [opts.yesOption] The "Yes" option when choosing between yes/no
	* @param {String} [opts.no] The "No" label
	* @param {String} [opts.noOption] The "No" option when choosing between yes/no
	*/
	var ConfirmPrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.value = opts.initial;
			this.initialValue = !!opts.initial;
			this.yesMsg = opts.yes || "yes";
			this.yesOption = opts.yesOption || "(Y/n)";
			this.noMsg = opts.no || "no";
			this.noOption = opts.noOption || "(y/N)";
			this.render();
		}
		reset() {
			this.value = this.initialValue;
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			this.value = this.value || false;
			this.done = true;
			this.aborted = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		_(c, key) {
			if (c.toLowerCase() === "y") {
				this.value = true;
				return this.submit();
			}
			if (c.toLowerCase() === "n") {
				this.value = false;
				return this.submit();
			}
			return this.bell();
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			else this.out.write(clear(this.outputText, this.out.columns));
			super.render();
			this.outputText = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(this.done),
				this.done ? this.value ? this.yesMsg : this.noMsg : color.gray(this.initialValue ? this.yesOption : this.noOption)
			].join(" ");
			this.out.write(erase.line + cursor.to(0) + this.outputText);
		}
	};
	module.exports = ConfirmPrompt;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/index.js
var require_elements$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		TextPrompt: require_text$1(),
		SelectPrompt: require_select$1(),
		TogglePrompt: require_toggle$1(),
		DatePrompt: require_date$1(),
		NumberPrompt: require_number$1(),
		MultiselectPrompt: require_multiselect$1(),
		AutocompletePrompt: require_autocomplete$1(),
		AutocompleteMultiselectPrompt: require_autocompleteMultiselect$1(),
		ConfirmPrompt: require_confirm$1()
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/prompts.js
var require_prompts$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	const $ = exports;
	const el = require_elements$1();
	const noop = (v) => v;
	function toPrompt(type, args, opts = {}) {
		return new Promise((res, rej) => {
			const p = new el[type](args);
			const onAbort = opts.onAbort || noop;
			const onSubmit = opts.onSubmit || noop;
			const onExit = opts.onExit || noop;
			p.on("state", args.onState || noop);
			p.on("submit", (x) => res(onSubmit(x)));
			p.on("exit", (x) => res(onExit(x)));
			p.on("abort", (x) => rej(onAbort(x)));
		});
	}
	/**
	* Text prompt
	* @param {string} args.message Prompt message to display
	* @param {string} [args.initial] Default string value
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {function} [args.onState] On state change callback
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.text = (args) => toPrompt("TextPrompt", args);
	/**
	* Password prompt with masked input
	* @param {string} args.message Prompt message to display
	* @param {string} [args.initial] Default string value
	* @param {function} [args.onState] On state change callback
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.password = (args) => {
		args.style = "password";
		return $.text(args);
	};
	/**
	* Prompt where input is invisible, like sudo
	* @param {string} args.message Prompt message to display
	* @param {string} [args.initial] Default string value
	* @param {function} [args.onState] On state change callback
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.invisible = (args) => {
		args.style = "invisible";
		return $.text(args);
	};
	/**
	* Number prompt
	* @param {string} args.message Prompt message to display
	* @param {number} args.initial Default number value
	* @param {function} [args.onState] On state change callback
	* @param {number} [args.max] Max value
	* @param {number} [args.min] Min value
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {Boolean} [opts.float=false] Parse input as floats
	* @param {Number} [opts.round=2] Round floats to x decimals
	* @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.number = (args) => toPrompt("NumberPrompt", args);
	/**
	* Date prompt
	* @param {string} args.message Prompt message to display
	* @param {number} args.initial Default number value
	* @param {function} [args.onState] On state change callback
	* @param {number} [args.max] Max value
	* @param {number} [args.min] Min value
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {Boolean} [opts.float=false] Parse input as floats
	* @param {Number} [opts.round=2] Round floats to x decimals
	* @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.date = (args) => toPrompt("DatePrompt", args);
	/**
	* Classic yes/no prompt
	* @param {string} args.message Prompt message to display
	* @param {boolean} [args.initial=false] Default value
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.confirm = (args) => toPrompt("ConfirmPrompt", args);
	/**
	* List prompt, split intput string by `seperator`
	* @param {string} args.message Prompt message to display
	* @param {string} [args.initial] Default string value
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {string} [args.separator] String separator
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input, in form of an `Array`
	*/
	$.list = (args) => {
		const sep = args.separator || ",";
		return toPrompt("TextPrompt", args, { onSubmit: (str) => str.split(sep).map((s) => s.trim()) });
	};
	/**
	* Toggle/switch prompt
	* @param {string} args.message Prompt message to display
	* @param {boolean} [args.initial=false] Default value
	* @param {string} [args.active="on"] Text for `active` state
	* @param {string} [args.inactive="off"] Text for `inactive` state
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.toggle = (args) => toPrompt("TogglePrompt", args);
	/**
	* Interactive select prompt
	* @param {string} args.message Prompt message to display
	* @param {Array} args.choices Array of choices objects `[{ title, value }, ...]`
	* @param {number} [args.initial] Index of default value
	* @param {String} [args.hint] Hint to display
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.select = (args) => toPrompt("SelectPrompt", args);
	/**
	* Interactive multi-select / autocompleteMultiselect prompt
	* @param {string} args.message Prompt message to display
	* @param {Array} args.choices Array of choices objects `[{ title, value, [selected] }, ...]`
	* @param {number} [args.max] Max select
	* @param {string} [args.hint] Hint to display user
	* @param {Number} [args.cursor=0] Cursor start position
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.multiselect = (args) => {
		args.choices = [].concat(args.choices || []);
		const toSelected = (items) => items.filter((item) => item.selected).map((item) => item.value);
		return toPrompt("MultiselectPrompt", args, {
			onAbort: toSelected,
			onSubmit: toSelected
		});
	};
	$.autocompleteMultiselect = (args) => {
		args.choices = [].concat(args.choices || []);
		const toSelected = (items) => items.filter((item) => item.selected).map((item) => item.value);
		return toPrompt("AutocompleteMultiselectPrompt", args, {
			onAbort: toSelected,
			onSubmit: toSelected
		});
	};
	const byTitle = (input, choices) => Promise.resolve(choices.filter((item) => item.title.slice(0, input.length).toLowerCase() === input.toLowerCase()));
	/**
	* Interactive auto-complete prompt
	* @param {string} args.message Prompt message to display
	* @param {Array} args.choices Array of auto-complete choices objects `[{ title, value }, ...]`
	* @param {Function} [args.suggest] Function to filter results based on user input. Defaults to sort by `title`
	* @param {number} [args.limit=10] Max number of results to show
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {String} [args.initial] Index of the default value
	* @param {boolean} [opts.clearFirst] The first ESCAPE keypress will clear the input
	* @param {String} [args.fallback] Fallback message - defaults to initial value
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.autocomplete = (args) => {
		args.suggest = args.suggest || byTitle;
		args.choices = [].concat(args.choices || []);
		return toPrompt("AutocompletePrompt", args);
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/index.js
var require_dist = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function ownKeys(object, enumerableOnly) {
		var keys = Object.keys(object);
		if (Object.getOwnPropertySymbols) {
			var symbols = Object.getOwnPropertySymbols(object);
			if (enumerableOnly) symbols = symbols.filter(function(sym) {
				return Object.getOwnPropertyDescriptor(object, sym).enumerable;
			});
			keys.push.apply(keys, symbols);
		}
		return keys;
	}
	function _objectSpread(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i] != null ? arguments[i] : {};
			if (i % 2) ownKeys(Object(source), true).forEach(function(key) {
				_defineProperty(target, key, source[key]);
			});
			else if (Object.getOwnPropertyDescriptors) Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
			else ownKeys(Object(source)).forEach(function(key) {
				Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
			});
		}
		return target;
	}
	function _defineProperty(obj, key, value) {
		if (key in obj) Object.defineProperty(obj, key, {
			value,
			enumerable: true,
			configurable: true,
			writable: true
		});
		else obj[key] = value;
		return obj;
	}
	function _createForOfIteratorHelper(o, allowArrayLike) {
		var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
		if (!it) {
			if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
				if (it) o = it;
				var i = 0;
				var F = function F() {};
				return {
					s: F,
					n: function n() {
						if (i >= o.length) return { done: true };
						return {
							done: false,
							value: o[i++]
						};
					},
					e: function e(_e) {
						throw _e;
					},
					f: F
				};
			}
			throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
		}
		var normalCompletion = true, didErr = false, err;
		return {
			s: function s() {
				it = it.call(o);
			},
			n: function n() {
				var step = it.next();
				normalCompletion = step.done;
				return step;
			},
			e: function e(_e2) {
				didErr = true;
				err = _e2;
			},
			f: function f() {
				try {
					if (!normalCompletion && it.return != null) it.return();
				} finally {
					if (didErr) throw err;
				}
			}
		};
	}
	function _unsupportedIterableToArray(o, minLen) {
		if (!o) return;
		if (typeof o === "string") return _arrayLikeToArray(o, minLen);
		var n = Object.prototype.toString.call(o).slice(8, -1);
		if (n === "Object" && o.constructor) n = o.constructor.name;
		if (n === "Map" || n === "Set") return Array.from(o);
		if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
	}
	function _arrayLikeToArray(arr, len) {
		if (len == null || len > arr.length) len = arr.length;
		for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
		return arr2;
	}
	function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
		try {
			var info = gen[key](arg);
			var value = info.value;
		} catch (error) {
			reject(error);
			return;
		}
		if (info.done) resolve(value);
		else Promise.resolve(value).then(_next, _throw);
	}
	function _asyncToGenerator(fn) {
		return function() {
			var self = this, args = arguments;
			return new Promise(function(resolve, reject) {
				var gen = fn.apply(self, args);
				function _next(value) {
					asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
				}
				function _throw(err) {
					asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
				}
				_next(void 0);
			});
		};
	}
	const prompts = require_prompts$2();
	const passOn = [
		"suggest",
		"format",
		"onState",
		"validate",
		"onRender",
		"type"
	];
	const noop = () => {};
	/**
	* Prompt for a series of questions
	* @param {Array|Object} questions Single question object or Array of question objects
	* @param {Function} [onSubmit] Callback function called on prompt submit
	* @param {Function} [onCancel] Callback function called on cancel/abort
	* @returns {Object} Object with values from user input
	*/
	function prompt() {
		return _prompt.apply(this, arguments);
	}
	function _prompt() {
		_prompt = _asyncToGenerator(function* (questions = [], { onSubmit = noop, onCancel = noop } = {}) {
			const answers = {};
			const override = prompt._override || {};
			questions = [].concat(questions);
			let answer, question, quit, name, type, lastPrompt;
			const getFormattedAnswer = /*#__PURE__*/ function() {
				var _ref = _asyncToGenerator(function* (question, answer, skipValidation = false) {
					if (!skipValidation && question.validate && question.validate(answer) !== true) return;
					return question.format ? yield question.format(answer, answers) : answer;
				});
				return function getFormattedAnswer(_x, _x2) {
					return _ref.apply(this, arguments);
				};
			}();
			var _iterator = _createForOfIteratorHelper(questions), _step;
			try {
				for (_iterator.s(); !(_step = _iterator.n()).done;) {
					question = _step.value;
					var _question = question;
					name = _question.name;
					type = _question.type;
					if (typeof type === "function") {
						type = yield type(answer, _objectSpread({}, answers), question);
						question["type"] = type;
					}
					if (!type) continue;
					for (let key in question) {
						if (passOn.includes(key)) continue;
						let value = question[key];
						question[key] = typeof value === "function" ? yield value(answer, _objectSpread({}, answers), lastPrompt) : value;
					}
					lastPrompt = question;
					if (typeof question.message !== "string") throw new Error("prompt message is required");
					var _question2 = question;
					name = _question2.name;
					type = _question2.type;
					if (prompts[type] === void 0) throw new Error(`prompt type (${type}) is not defined`);
					if (override[question.name] !== void 0) {
						answer = yield getFormattedAnswer(question, override[question.name]);
						if (answer !== void 0) {
							answers[name] = answer;
							continue;
						}
					}
					try {
						answer = prompt._injected ? getInjectedAnswer(prompt._injected, question.initial) : yield prompts[type](question);
						answers[name] = answer = yield getFormattedAnswer(question, answer, true);
						quit = yield onSubmit(question, answer, answers);
					} catch (err) {
						quit = !(yield onCancel(question, answers));
					}
					if (quit) return answers;
				}
			} catch (err) {
				_iterator.e(err);
			} finally {
				_iterator.f();
			}
			return answers;
		});
		return _prompt.apply(this, arguments);
	}
	function getInjectedAnswer(injected, deafultValue) {
		const answer = injected.shift();
		if (answer instanceof Error) throw answer;
		return answer === void 0 ? deafultValue : answer;
	}
	function inject(answers) {
		prompt._injected = (prompt._injected || []).concat(answers);
	}
	function override(answers) {
		prompt._override = Object.assign({}, answers);
	}
	module.exports = Object.assign(prompt, {
		prompt,
		prompts,
		inject,
		override
	});
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/action.js
var require_action = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = (key, isSelect) => {
		if (key.meta && key.name !== "escape") return;
		if (key.ctrl) {
			if (key.name === "a") return "first";
			if (key.name === "c") return "abort";
			if (key.name === "d") return "abort";
			if (key.name === "e") return "last";
			if (key.name === "g") return "reset";
		}
		if (isSelect) {
			if (key.name === "j") return "down";
			if (key.name === "k") return "up";
		}
		if (key.name === "return") return "submit";
		if (key.name === "enter") return "submit";
		if (key.name === "backspace") return "delete";
		if (key.name === "delete") return "deleteForward";
		if (key.name === "abort") return "abort";
		if (key.name === "escape") return "exit";
		if (key.name === "tab") return "next";
		if (key.name === "pagedown") return "nextPage";
		if (key.name === "pageup") return "prevPage";
		if (key.name === "home") return "home";
		if (key.name === "end") return "end";
		if (key.name === "up") return "up";
		if (key.name === "down") return "down";
		if (key.name === "right") return "right";
		if (key.name === "left") return "left";
		return false;
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/strip.js
var require_strip = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = (str) => {
		const pattern = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))"].join("|");
		const RGX = new RegExp(pattern, "g");
		return typeof str === "string" ? str.replace(RGX, "") : str;
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/clear.js
var require_clear = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const strip = require_strip();
	const { erase, cursor } = require_src();
	const width = (str) => [...strip(str)].length;
	/**
	* @param {string} prompt
	* @param {number} perLine
	*/
	module.exports = function(prompt, perLine) {
		if (!perLine) return erase.line + cursor.to(0);
		let rows = 0;
		const lines = prompt.split(/\r?\n/);
		for (let line of lines) rows += 1 + Math.floor(Math.max(width(line) - 1, 0) / perLine);
		return erase.lines(rows);
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/figures.js
var require_figures = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const main = {
		arrowUp: "↑",
		arrowDown: "↓",
		arrowLeft: "←",
		arrowRight: "→",
		radioOn: "◉",
		radioOff: "◯",
		tick: "✔",
		cross: "✖",
		ellipsis: "…",
		pointerSmall: "›",
		line: "─",
		pointer: "❯"
	};
	const win = {
		arrowUp: main.arrowUp,
		arrowDown: main.arrowDown,
		arrowLeft: main.arrowLeft,
		arrowRight: main.arrowRight,
		radioOn: "(*)",
		radioOff: "( )",
		tick: "√",
		cross: "×",
		ellipsis: "...",
		pointerSmall: "»",
		line: "─",
		pointer: ">"
	};
	const figures = process.platform === "win32" ? win : main;
	module.exports = figures;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/style.js
var require_style = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const c = require_kleur();
	const figures = require_figures();
	const styles = Object.freeze({
		password: {
			scale: 1,
			render: (input) => "*".repeat(input.length)
		},
		emoji: {
			scale: 2,
			render: (input) => "😃".repeat(input.length)
		},
		invisible: {
			scale: 0,
			render: (input) => ""
		},
		default: {
			scale: 1,
			render: (input) => `${input}`
		}
	});
	const render = (type) => styles[type] || styles.default;
	const symbols = Object.freeze({
		aborted: c.red(figures.cross),
		done: c.green(figures.tick),
		exited: c.yellow(figures.cross),
		default: c.cyan("?")
	});
	const symbol = (done, aborted, exited) => aborted ? symbols.aborted : exited ? symbols.exited : done ? symbols.done : symbols.default;
	const delimiter = (completing) => c.gray(completing ? figures.ellipsis : figures.pointerSmall);
	const item = (expandable, expanded) => c.gray(expandable ? expanded ? figures.pointerSmall : "+" : figures.line);
	module.exports = {
		styles,
		render,
		symbols,
		symbol,
		delimiter,
		item
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/lines.js
var require_lines = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const strip = require_strip();
	/**
	* @param {string} msg
	* @param {number} perLine
	*/
	module.exports = function(msg, perLine) {
		let lines = String(strip(msg) || "").split(/\r?\n/);
		if (!perLine) return lines.length;
		return lines.map((l) => Math.ceil(l.length / perLine)).reduce((a, b) => a + b);
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/wrap.js
var require_wrap = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* @param {string} msg The message to wrap
	* @param {object} opts
	* @param {number|string} [opts.margin] Left margin
	* @param {number} opts.width Maximum characters per line including the margin
	*/
	module.exports = (msg, opts = {}) => {
		const tab = Number.isSafeInteger(parseInt(opts.margin)) ? new Array(parseInt(opts.margin)).fill(" ").join("") : opts.margin || "";
		const width = opts.width;
		return (msg || "").split(/\r?\n/g).map((line) => line.split(/\s+/g).reduce((arr, w) => {
			if (w.length + tab.length >= width || arr[arr.length - 1].length + w.length + 1 < width) arr[arr.length - 1] += ` ${w}`;
			else arr.push(`${tab}${w}`);
			return arr;
		}, [tab]).join("\n")).join("\n");
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/entriesToDisplay.js
var require_entriesToDisplay = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Determine what entries should be displayed on the screen, based on the
	* currently selected index and the maximum visible. Used in list-based
	* prompts like `select` and `multiselect`.
	*
	* @param {number} cursor the currently selected entry
	* @param {number} total the total entries available to display
	* @param {number} [maxVisible] the number of entries that can be displayed
	*/
	module.exports = (cursor, total, maxVisible) => {
		maxVisible = maxVisible || total;
		let startIndex = Math.min(total - maxVisible, cursor - Math.floor(maxVisible / 2));
		if (startIndex < 0) startIndex = 0;
		let endIndex = Math.min(startIndex + maxVisible, total);
		return {
			startIndex,
			endIndex
		};
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/index.js
var require_util = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		action: require_action(),
		clear: require_clear(),
		style: require_style(),
		strip: require_strip(),
		figures: require_figures(),
		lines: require_lines(),
		wrap: require_wrap(),
		entriesToDisplay: require_entriesToDisplay()
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/prompt.js
var require_prompt = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const readline = __require$1("readline");
	const { action } = require_util();
	const EventEmitter = __require$1("events");
	const { beep, cursor } = require_src();
	const color = require_kleur();
	/**
	* Base prompt skeleton
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var Prompt = class extends EventEmitter {
		constructor(opts = {}) {
			super();
			this.firstRender = true;
			this.in = opts.stdin || process.stdin;
			this.out = opts.stdout || process.stdout;
			this.onRender = (opts.onRender || (() => void 0)).bind(this);
			const rl = readline.createInterface({
				input: this.in,
				escapeCodeTimeout: 50
			});
			readline.emitKeypressEvents(this.in, rl);
			if (this.in.isTTY) this.in.setRawMode(true);
			const isSelect = ["SelectPrompt", "MultiselectPrompt"].indexOf(this.constructor.name) > -1;
			const keypress = (str, key) => {
				let a = action(key, isSelect);
				if (a === false) this._ && this._(str, key);
				else if (typeof this[a] === "function") this[a](key);
				else this.bell();
			};
			this.close = () => {
				this.out.write(cursor.show);
				this.in.removeListener("keypress", keypress);
				if (this.in.isTTY) this.in.setRawMode(false);
				rl.close();
				this.emit(this.aborted ? "abort" : this.exited ? "exit" : "submit", this.value);
				this.closed = true;
			};
			this.in.on("keypress", keypress);
		}
		fire() {
			this.emit("state", {
				value: this.value,
				aborted: !!this.aborted,
				exited: !!this.exited
			});
		}
		bell() {
			this.out.write(beep);
		}
		render() {
			this.onRender(color);
			if (this.firstRender) this.firstRender = false;
		}
	};
	module.exports = Prompt;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/text.js
var require_text = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const color = require_kleur();
	const Prompt = require_prompt();
	const { erase, cursor } = require_src();
	const { style, clear, lines, figures } = require_util();
	/**
	* TextPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {String} [opts.style='default'] Render style
	* @param {String} [opts.initial] Default value
	* @param {Function} [opts.validate] Validate function
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {String} [opts.error] The invalid error label
	*/
	var TextPrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.transform = style.render(opts.style);
			this.scale = this.transform.scale;
			this.msg = opts.message;
			this.initial = opts.initial || ``;
			this.validator = opts.validate || (() => true);
			this.value = ``;
			this.errorMsg = opts.error || `Please Enter A Valid Value`;
			this.cursor = Number(!!this.initial);
			this.cursorOffset = 0;
			this.clear = clear(``, this.out.columns);
			this.render();
		}
		set value(v) {
			if (!v && this.initial) {
				this.placeholder = true;
				this.rendered = color.gray(this.transform.render(this.initial));
			} else {
				this.placeholder = false;
				this.rendered = this.transform.render(v);
			}
			this._value = v;
			this.fire();
		}
		get value() {
			return this._value;
		}
		reset() {
			this.value = ``;
			this.cursor = Number(!!this.initial);
			this.cursorOffset = 0;
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.value = this.value || this.initial;
			this.done = this.aborted = true;
			this.error = false;
			this.red = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		async validate() {
			let valid = await this.validator(this.value);
			if (typeof valid === `string`) {
				this.errorMsg = valid;
				valid = false;
			}
			this.error = !valid;
		}
		async submit() {
			this.value = this.value || this.initial;
			this.cursorOffset = 0;
			this.cursor = this.rendered.length;
			await this.validate();
			if (this.error) {
				this.red = true;
				this.fire();
				this.render();
				return;
			}
			this.done = true;
			this.aborted = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		next() {
			if (!this.placeholder) return this.bell();
			this.value = this.initial;
			this.cursor = this.rendered.length;
			this.fire();
			this.render();
		}
		moveCursor(n) {
			if (this.placeholder) return;
			this.cursor = this.cursor + n;
			this.cursorOffset += n;
		}
		_(c, key) {
			let s1 = this.value.slice(0, this.cursor);
			let s2 = this.value.slice(this.cursor);
			this.value = `${s1}${c}${s2}`;
			this.red = false;
			this.cursor = this.placeholder ? 0 : s1.length + 1;
			this.render();
		}
		delete() {
			if (this.isCursorAtStart()) return this.bell();
			let s1 = this.value.slice(0, this.cursor - 1);
			let s2 = this.value.slice(this.cursor);
			this.value = `${s1}${s2}`;
			this.red = false;
			if (this.isCursorAtStart()) this.cursorOffset = 0;
			else {
				this.cursorOffset++;
				this.moveCursor(-1);
			}
			this.render();
		}
		deleteForward() {
			if (this.cursor * this.scale >= this.rendered.length || this.placeholder) return this.bell();
			let s1 = this.value.slice(0, this.cursor);
			let s2 = this.value.slice(this.cursor + 1);
			this.value = `${s1}${s2}`;
			this.red = false;
			if (this.isCursorAtEnd()) this.cursorOffset = 0;
			else this.cursorOffset++;
			this.render();
		}
		first() {
			this.cursor = 0;
			this.render();
		}
		last() {
			this.cursor = this.value.length;
			this.render();
		}
		left() {
			if (this.cursor <= 0 || this.placeholder) return this.bell();
			this.moveCursor(-1);
			this.render();
		}
		right() {
			if (this.cursor * this.scale >= this.rendered.length || this.placeholder) return this.bell();
			this.moveCursor(1);
			this.render();
		}
		isCursorAtStart() {
			return this.cursor === 0 || this.placeholder && this.cursor === 1;
		}
		isCursorAtEnd() {
			return this.cursor === this.rendered.length || this.placeholder && this.cursor === this.rendered.length + 1;
		}
		render() {
			if (this.closed) return;
			if (!this.firstRender) {
				if (this.outputError) this.out.write(cursor.down(lines(this.outputError, this.out.columns) - 1) + clear(this.outputError, this.out.columns));
				this.out.write(clear(this.outputText, this.out.columns));
			}
			super.render();
			this.outputError = "";
			this.outputText = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(this.done),
				this.red ? color.red(this.rendered) : this.rendered
			].join(` `);
			if (this.error) this.outputError += this.errorMsg.split(`\n`).reduce((a, l, i) => a + `\n${i ? " " : figures.pointerSmall} ${color.red().italic(l)}`, ``);
			this.out.write(erase.line + cursor.to(0) + this.outputText + cursor.save + this.outputError + cursor.restore + cursor.move(this.cursorOffset, 0));
		}
	};
	module.exports = TextPrompt;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/select.js
var require_select = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const color = require_kleur();
	const Prompt = require_prompt();
	const { style, clear, figures, wrap, entriesToDisplay } = require_util();
	const { cursor } = require_src();
	/**
	* SelectPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Array} opts.choices Array of choice objects
	* @param {String} [opts.hint] Hint to display
	* @param {Number} [opts.initial] Index of default value
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {Number} [opts.optionsPerPage=10] Max options to display at once
	*/
	var SelectPrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.hint = opts.hint || "- Use arrow-keys. Return to submit.";
			this.warn = opts.warn || "- This option is disabled";
			this.cursor = opts.initial || 0;
			this.choices = opts.choices.map((ch, idx) => {
				if (typeof ch === "string") ch = {
					title: ch,
					value: idx
				};
				return {
					title: ch && (ch.title || ch.value || ch),
					value: ch && (ch.value === void 0 ? idx : ch.value),
					description: ch && ch.description,
					selected: ch && ch.selected,
					disabled: ch && ch.disabled
				};
			});
			this.optionsPerPage = opts.optionsPerPage || 10;
			this.value = (this.choices[this.cursor] || {}).value;
			this.clear = clear("", this.out.columns);
			this.render();
		}
		moveCursor(n) {
			this.cursor = n;
			this.value = this.choices[n].value;
			this.fire();
		}
		reset() {
			this.moveCursor(0);
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			if (!this.selection.disabled) {
				this.done = true;
				this.aborted = false;
				this.fire();
				this.render();
				this.out.write("\n");
				this.close();
			} else this.bell();
		}
		first() {
			this.moveCursor(0);
			this.render();
		}
		last() {
			this.moveCursor(this.choices.length - 1);
			this.render();
		}
		up() {
			if (this.cursor === 0) this.moveCursor(this.choices.length - 1);
			else this.moveCursor(this.cursor - 1);
			this.render();
		}
		down() {
			if (this.cursor === this.choices.length - 1) this.moveCursor(0);
			else this.moveCursor(this.cursor + 1);
			this.render();
		}
		next() {
			this.moveCursor((this.cursor + 1) % this.choices.length);
			this.render();
		}
		_(c, key) {
			if (c === " ") return this.submit();
		}
		get selection() {
			return this.choices[this.cursor];
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			else this.out.write(clear(this.outputText, this.out.columns));
			super.render();
			let { startIndex, endIndex } = entriesToDisplay(this.cursor, this.choices.length, this.optionsPerPage);
			this.outputText = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(false),
				this.done ? this.selection.title : this.selection.disabled ? color.yellow(this.warn) : color.gray(this.hint)
			].join(" ");
			if (!this.done) {
				this.outputText += "\n";
				for (let i = startIndex; i < endIndex; i++) {
					let title, prefix, desc = "", v = this.choices[i];
					if (i === startIndex && startIndex > 0) prefix = figures.arrowUp;
					else if (i === endIndex - 1 && endIndex < this.choices.length) prefix = figures.arrowDown;
					else prefix = " ";
					if (v.disabled) {
						title = this.cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
						prefix = (this.cursor === i ? color.bold().gray(figures.pointer) + " " : "  ") + prefix;
					} else {
						title = this.cursor === i ? color.cyan().underline(v.title) : v.title;
						prefix = (this.cursor === i ? color.cyan(figures.pointer) + " " : "  ") + prefix;
						if (v.description && this.cursor === i) {
							desc = ` - ${v.description}`;
							if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) desc = "\n" + wrap(v.description, {
								margin: 3,
								width: this.out.columns
							});
						}
					}
					this.outputText += `${prefix} ${title}${color.gray(desc)}\n`;
				}
			}
			this.out.write(this.outputText);
		}
	};
	module.exports = SelectPrompt;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/toggle.js
var require_toggle = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const color = require_kleur();
	const Prompt = require_prompt();
	const { style, clear } = require_util();
	const { cursor, erase } = require_src();
	/**
	* TogglePrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Boolean} [opts.initial=false] Default value
	* @param {String} [opts.active='no'] Active label
	* @param {String} [opts.inactive='off'] Inactive label
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var TogglePrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.value = !!opts.initial;
			this.active = opts.active || "on";
			this.inactive = opts.inactive || "off";
			this.initialValue = this.value;
			this.render();
		}
		reset() {
			this.value = this.initialValue;
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			this.done = true;
			this.aborted = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		deactivate() {
			if (this.value === false) return this.bell();
			this.value = false;
			this.render();
		}
		activate() {
			if (this.value === true) return this.bell();
			this.value = true;
			this.render();
		}
		delete() {
			this.deactivate();
		}
		left() {
			this.deactivate();
		}
		right() {
			this.activate();
		}
		down() {
			this.deactivate();
		}
		up() {
			this.activate();
		}
		next() {
			this.value = !this.value;
			this.fire();
			this.render();
		}
		_(c, key) {
			if (c === " ") this.value = !this.value;
			else if (c === "1") this.value = true;
			else if (c === "0") this.value = false;
			else return this.bell();
			this.render();
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			else this.out.write(clear(this.outputText, this.out.columns));
			super.render();
			this.outputText = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(this.done),
				this.value ? this.inactive : color.cyan().underline(this.inactive),
				color.gray("/"),
				this.value ? color.cyan().underline(this.active) : this.active
			].join(" ");
			this.out.write(erase.line + cursor.to(0) + this.outputText);
		}
	};
	module.exports = TogglePrompt;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/datepart.js
var require_datepart = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var DatePart = class DatePart {
		constructor({ token, date, parts, locales }) {
			this.token = token;
			this.date = date || /* @__PURE__ */ new Date();
			this.parts = parts || [this];
			this.locales = locales || {};
		}
		up() {}
		down() {}
		next() {
			const currentIdx = this.parts.indexOf(this);
			return this.parts.find((part, idx) => idx > currentIdx && part instanceof DatePart);
		}
		setTo(val) {}
		prev() {
			let parts = [].concat(this.parts).reverse();
			const currentIdx = parts.indexOf(this);
			return parts.find((part, idx) => idx > currentIdx && part instanceof DatePart);
		}
		toString() {
			return String(this.date);
		}
	};
	module.exports = DatePart;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/meridiem.js
var require_meridiem = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const DatePart = require_datepart();
	var Meridiem = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setHours((this.date.getHours() + 12) % 24);
		}
		down() {
			this.up();
		}
		toString() {
			let meridiem = this.date.getHours() > 12 ? "pm" : "am";
			return /\A/.test(this.token) ? meridiem.toUpperCase() : meridiem;
		}
	};
	module.exports = Meridiem;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/day.js
var require_day = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const DatePart = require_datepart();
	const pos = (n) => {
		n = n % 10;
		return n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th";
	};
	var Day = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setDate(this.date.getDate() + 1);
		}
		down() {
			this.date.setDate(this.date.getDate() - 1);
		}
		setTo(val) {
			this.date.setDate(parseInt(val.substr(-2)));
		}
		toString() {
			let date = this.date.getDate();
			let day = this.date.getDay();
			return this.token === "DD" ? String(date).padStart(2, "0") : this.token === "Do" ? date + pos(date) : this.token === "d" ? day + 1 : this.token === "ddd" ? this.locales.weekdaysShort[day] : this.token === "dddd" ? this.locales.weekdays[day] : date;
		}
	};
	module.exports = Day;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/hours.js
var require_hours = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const DatePart = require_datepart();
	var Hours = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setHours(this.date.getHours() + 1);
		}
		down() {
			this.date.setHours(this.date.getHours() - 1);
		}
		setTo(val) {
			this.date.setHours(parseInt(val.substr(-2)));
		}
		toString() {
			let hours = this.date.getHours();
			if (/h/.test(this.token)) hours = hours % 12 || 12;
			return this.token.length > 1 ? String(hours).padStart(2, "0") : hours;
		}
	};
	module.exports = Hours;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/milliseconds.js
var require_milliseconds = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const DatePart = require_datepart();
	var Milliseconds = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setMilliseconds(this.date.getMilliseconds() + 1);
		}
		down() {
			this.date.setMilliseconds(this.date.getMilliseconds() - 1);
		}
		setTo(val) {
			this.date.setMilliseconds(parseInt(val.substr(-this.token.length)));
		}
		toString() {
			return String(this.date.getMilliseconds()).padStart(4, "0").substr(0, this.token.length);
		}
	};
	module.exports = Milliseconds;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/minutes.js
var require_minutes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const DatePart = require_datepart();
	var Minutes = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setMinutes(this.date.getMinutes() + 1);
		}
		down() {
			this.date.setMinutes(this.date.getMinutes() - 1);
		}
		setTo(val) {
			this.date.setMinutes(parseInt(val.substr(-2)));
		}
		toString() {
			let m = this.date.getMinutes();
			return this.token.length > 1 ? String(m).padStart(2, "0") : m;
		}
	};
	module.exports = Minutes;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/month.js
var require_month = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const DatePart = require_datepart();
	var Month = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setMonth(this.date.getMonth() + 1);
		}
		down() {
			this.date.setMonth(this.date.getMonth() - 1);
		}
		setTo(val) {
			val = parseInt(val.substr(-2)) - 1;
			this.date.setMonth(val < 0 ? 0 : val);
		}
		toString() {
			let month = this.date.getMonth();
			let tl = this.token.length;
			return tl === 2 ? String(month + 1).padStart(2, "0") : tl === 3 ? this.locales.monthsShort[month] : tl === 4 ? this.locales.months[month] : String(month + 1);
		}
	};
	module.exports = Month;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/seconds.js
var require_seconds = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const DatePart = require_datepart();
	var Seconds = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setSeconds(this.date.getSeconds() + 1);
		}
		down() {
			this.date.setSeconds(this.date.getSeconds() - 1);
		}
		setTo(val) {
			this.date.setSeconds(parseInt(val.substr(-2)));
		}
		toString() {
			let s = this.date.getSeconds();
			return this.token.length > 1 ? String(s).padStart(2, "0") : s;
		}
	};
	module.exports = Seconds;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/year.js
var require_year = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const DatePart = require_datepart();
	var Year = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setFullYear(this.date.getFullYear() + 1);
		}
		down() {
			this.date.setFullYear(this.date.getFullYear() - 1);
		}
		setTo(val) {
			this.date.setFullYear(val.substr(-4));
		}
		toString() {
			let year = String(this.date.getFullYear()).padStart(4, "0");
			return this.token.length === 2 ? year.substr(-2) : year;
		}
	};
	module.exports = Year;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/index.js
var require_dateparts = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		DatePart: require_datepart(),
		Meridiem: require_meridiem(),
		Day: require_day(),
		Hours: require_hours(),
		Milliseconds: require_milliseconds(),
		Minutes: require_minutes(),
		Month: require_month(),
		Seconds: require_seconds(),
		Year: require_year()
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/date.js
var require_date = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const color = require_kleur();
	const Prompt = require_prompt();
	const { style, clear, figures } = require_util();
	const { erase, cursor } = require_src();
	const { DatePart, Meridiem, Day, Hours, Milliseconds, Minutes, Month, Seconds, Year } = require_dateparts();
	const regex = /\\(.)|"((?:\\["\\]|[^"])+)"|(D[Do]?|d{3,4}|d)|(M{1,4})|(YY(?:YY)?)|([aA])|([Hh]{1,2})|(m{1,2})|(s{1,2})|(S{1,4})|./g;
	const regexGroups = {
		1: ({ token }) => token.replace(/\\(.)/g, "$1"),
		2: (opts) => new Day(opts),
		3: (opts) => new Month(opts),
		4: (opts) => new Year(opts),
		5: (opts) => new Meridiem(opts),
		6: (opts) => new Hours(opts),
		7: (opts) => new Minutes(opts),
		8: (opts) => new Seconds(opts),
		9: (opts) => new Milliseconds(opts)
	};
	const dfltLocales = {
		months: "January,February,March,April,May,June,July,August,September,October,November,December".split(","),
		monthsShort: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),
		weekdays: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),
		weekdaysShort: "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(",")
	};
	/**
	* DatePrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Number} [opts.initial] Index of default value
	* @param {String} [opts.mask] The format mask
	* @param {object} [opts.locales] The date locales
	* @param {String} [opts.error] The error message shown on invalid value
	* @param {Function} [opts.validate] Function to validate the submitted value
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var DatePrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.cursor = 0;
			this.typed = "";
			this.locales = Object.assign(dfltLocales, opts.locales);
			this._date = opts.initial || /* @__PURE__ */ new Date();
			this.errorMsg = opts.error || "Please Enter A Valid Value";
			this.validator = opts.validate || (() => true);
			this.mask = opts.mask || "YYYY-MM-DD HH:mm:ss";
			this.clear = clear("", this.out.columns);
			this.render();
		}
		get value() {
			return this.date;
		}
		get date() {
			return this._date;
		}
		set date(date) {
			if (date) this._date.setTime(date.getTime());
		}
		set mask(mask) {
			let result;
			this.parts = [];
			while (result = regex.exec(mask)) {
				let match = result.shift();
				let idx = result.findIndex((gr) => gr != null);
				this.parts.push(idx in regexGroups ? regexGroups[idx]({
					token: result[idx] || match,
					date: this.date,
					parts: this.parts,
					locales: this.locales
				}) : result[idx] || match);
			}
			let parts = this.parts.reduce((arr, i) => {
				if (typeof i === "string" && typeof arr[arr.length - 1] === "string") arr[arr.length - 1] += i;
				else arr.push(i);
				return arr;
			}, []);
			this.parts.splice(0);
			this.parts.push(...parts);
			this.reset();
		}
		moveCursor(n) {
			this.typed = "";
			this.cursor = n;
			this.fire();
		}
		reset() {
			this.moveCursor(this.parts.findIndex((p) => p instanceof DatePart));
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.error = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		async validate() {
			let valid = await this.validator(this.value);
			if (typeof valid === "string") {
				this.errorMsg = valid;
				valid = false;
			}
			this.error = !valid;
		}
		async submit() {
			await this.validate();
			if (this.error) {
				this.color = "red";
				this.fire();
				this.render();
				return;
			}
			this.done = true;
			this.aborted = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		up() {
			this.typed = "";
			this.parts[this.cursor].up();
			this.render();
		}
		down() {
			this.typed = "";
			this.parts[this.cursor].down();
			this.render();
		}
		left() {
			let prev = this.parts[this.cursor].prev();
			if (prev == null) return this.bell();
			this.moveCursor(this.parts.indexOf(prev));
			this.render();
		}
		right() {
			let next = this.parts[this.cursor].next();
			if (next == null) return this.bell();
			this.moveCursor(this.parts.indexOf(next));
			this.render();
		}
		next() {
			let next = this.parts[this.cursor].next();
			this.moveCursor(next ? this.parts.indexOf(next) : this.parts.findIndex((part) => part instanceof DatePart));
			this.render();
		}
		_(c) {
			if (/\d/.test(c)) {
				this.typed += c;
				this.parts[this.cursor].setTo(this.typed);
				this.render();
			}
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			else this.out.write(clear(this.outputText, this.out.columns));
			super.render();
			this.outputText = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(false),
				this.parts.reduce((arr, p, idx) => arr.concat(idx === this.cursor && !this.done ? color.cyan().underline(p.toString()) : p), []).join("")
			].join(" ");
			if (this.error) this.outputText += this.errorMsg.split("\n").reduce((a, l, i) => a + `\n${i ? ` ` : figures.pointerSmall} ${color.red().italic(l)}`, ``);
			this.out.write(erase.line + cursor.to(0) + this.outputText);
		}
	};
	module.exports = DatePrompt;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/number.js
var require_number = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const color = require_kleur();
	const Prompt = require_prompt();
	const { cursor, erase } = require_src();
	const { style, figures, clear, lines } = require_util();
	const isNumber = /[0-9]/;
	const isDef = (any) => any !== void 0;
	const round = (number, precision) => {
		let factor = Math.pow(10, precision);
		return Math.round(number * factor) / factor;
	};
	/**
	* NumberPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {String} [opts.style='default'] Render style
	* @param {Number} [opts.initial] Default value
	* @param {Number} [opts.max=+Infinity] Max value
	* @param {Number} [opts.min=-Infinity] Min value
	* @param {Boolean} [opts.float=false] Parse input as floats
	* @param {Number} [opts.round=2] Round floats to x decimals
	* @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
	* @param {Function} [opts.validate] Validate function
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {String} [opts.error] The invalid error label
	*/
	var NumberPrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.transform = style.render(opts.style);
			this.msg = opts.message;
			this.initial = isDef(opts.initial) ? opts.initial : "";
			this.float = !!opts.float;
			this.round = opts.round || 2;
			this.inc = opts.increment || 1;
			this.min = isDef(opts.min) ? opts.min : -Infinity;
			this.max = isDef(opts.max) ? opts.max : Infinity;
			this.errorMsg = opts.error || `Please Enter A Valid Value`;
			this.validator = opts.validate || (() => true);
			this.color = `cyan`;
			this.value = ``;
			this.typed = ``;
			this.lastHit = 0;
			this.render();
		}
		set value(v) {
			if (!v && v !== 0) {
				this.placeholder = true;
				this.rendered = color.gray(this.transform.render(`${this.initial}`));
				this._value = ``;
			} else {
				this.placeholder = false;
				this.rendered = this.transform.render(`${round(v, this.round)}`);
				this._value = round(v, this.round);
			}
			this.fire();
		}
		get value() {
			return this._value;
		}
		parse(x) {
			return this.float ? parseFloat(x) : parseInt(x);
		}
		valid(c) {
			return c === `-` || c === `.` && this.float || isNumber.test(c);
		}
		reset() {
			this.typed = ``;
			this.value = ``;
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			let x = this.value;
			this.value = x !== `` ? x : this.initial;
			this.done = this.aborted = true;
			this.error = false;
			this.fire();
			this.render();
			this.out.write(`\n`);
			this.close();
		}
		async validate() {
			let valid = await this.validator(this.value);
			if (typeof valid === `string`) {
				this.errorMsg = valid;
				valid = false;
			}
			this.error = !valid;
		}
		async submit() {
			await this.validate();
			if (this.error) {
				this.color = `red`;
				this.fire();
				this.render();
				return;
			}
			let x = this.value;
			this.value = x !== `` ? x : this.initial;
			this.done = true;
			this.aborted = false;
			this.error = false;
			this.fire();
			this.render();
			this.out.write(`\n`);
			this.close();
		}
		up() {
			this.typed = ``;
			if (this.value === "") this.value = this.min - this.inc;
			if (this.value >= this.max) return this.bell();
			this.value += this.inc;
			this.color = `cyan`;
			this.fire();
			this.render();
		}
		down() {
			this.typed = ``;
			if (this.value === "") this.value = this.min + this.inc;
			if (this.value <= this.min) return this.bell();
			this.value -= this.inc;
			this.color = `cyan`;
			this.fire();
			this.render();
		}
		delete() {
			let val = this.value.toString();
			if (val.length === 0) return this.bell();
			this.value = this.parse(val = val.slice(0, -1)) || ``;
			if (this.value !== "" && this.value < this.min) this.value = this.min;
			this.color = `cyan`;
			this.fire();
			this.render();
		}
		next() {
			this.value = this.initial;
			this.fire();
			this.render();
		}
		_(c, key) {
			if (!this.valid(c)) return this.bell();
			const now = Date.now();
			if (now - this.lastHit > 1e3) this.typed = ``;
			this.typed += c;
			this.lastHit = now;
			this.color = `cyan`;
			if (c === `.`) return this.fire();
			this.value = Math.min(this.parse(this.typed), this.max);
			if (this.value > this.max) this.value = this.max;
			if (this.value < this.min) this.value = this.min;
			this.fire();
			this.render();
		}
		render() {
			if (this.closed) return;
			if (!this.firstRender) {
				if (this.outputError) this.out.write(cursor.down(lines(this.outputError, this.out.columns) - 1) + clear(this.outputError, this.out.columns));
				this.out.write(clear(this.outputText, this.out.columns));
			}
			super.render();
			this.outputError = "";
			this.outputText = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(this.done),
				!this.done || !this.done && !this.placeholder ? color[this.color]().underline(this.rendered) : this.rendered
			].join(` `);
			if (this.error) this.outputError += this.errorMsg.split(`\n`).reduce((a, l, i) => a + `\n${i ? ` ` : figures.pointerSmall} ${color.red().italic(l)}`, ``);
			this.out.write(erase.line + cursor.to(0) + this.outputText + cursor.save + this.outputError + cursor.restore);
		}
	};
	module.exports = NumberPrompt;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/multiselect.js
var require_multiselect = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const color = require_kleur();
	const { cursor } = require_src();
	const Prompt = require_prompt();
	const { clear, figures, style, wrap, entriesToDisplay } = require_util();
	/**
	* MultiselectPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Array} opts.choices Array of choice objects
	* @param {String} [opts.hint] Hint to display
	* @param {String} [opts.warn] Hint shown for disabled choices
	* @param {Number} [opts.max] Max choices
	* @param {Number} [opts.cursor=0] Cursor start position
	* @param {Number} [opts.optionsPerPage=10] Max options to display at once
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var MultiselectPrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.cursor = opts.cursor || 0;
			this.scrollIndex = opts.cursor || 0;
			this.hint = opts.hint || "";
			this.warn = opts.warn || "- This option is disabled -";
			this.minSelected = opts.min;
			this.showMinError = false;
			this.maxChoices = opts.max;
			this.instructions = opts.instructions;
			this.optionsPerPage = opts.optionsPerPage || 10;
			this.value = opts.choices.map((ch, idx) => {
				if (typeof ch === "string") ch = {
					title: ch,
					value: idx
				};
				return {
					title: ch && (ch.title || ch.value || ch),
					description: ch && ch.description,
					value: ch && (ch.value === void 0 ? idx : ch.value),
					selected: ch && ch.selected,
					disabled: ch && ch.disabled
				};
			});
			this.clear = clear("", this.out.columns);
			if (!opts.overrideRender) this.render();
		}
		reset() {
			this.value.map((v) => !v.selected);
			this.cursor = 0;
			this.fire();
			this.render();
		}
		selected() {
			return this.value.filter((v) => v.selected);
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			const selected = this.value.filter((e) => e.selected);
			if (this.minSelected && selected.length < this.minSelected) {
				this.showMinError = true;
				this.render();
			} else {
				this.done = true;
				this.aborted = false;
				this.fire();
				this.render();
				this.out.write("\n");
				this.close();
			}
		}
		first() {
			this.cursor = 0;
			this.render();
		}
		last() {
			this.cursor = this.value.length - 1;
			this.render();
		}
		next() {
			this.cursor = (this.cursor + 1) % this.value.length;
			this.render();
		}
		up() {
			if (this.cursor === 0) this.cursor = this.value.length - 1;
			else this.cursor--;
			this.render();
		}
		down() {
			if (this.cursor === this.value.length - 1) this.cursor = 0;
			else this.cursor++;
			this.render();
		}
		left() {
			this.value[this.cursor].selected = false;
			this.render();
		}
		right() {
			if (this.value.filter((e) => e.selected).length >= this.maxChoices) return this.bell();
			this.value[this.cursor].selected = true;
			this.render();
		}
		handleSpaceToggle() {
			const v = this.value[this.cursor];
			if (v.selected) {
				v.selected = false;
				this.render();
			} else if (v.disabled || this.value.filter((e) => e.selected).length >= this.maxChoices) return this.bell();
			else {
				v.selected = true;
				this.render();
			}
		}
		toggleAll() {
			if (this.maxChoices !== void 0 || this.value[this.cursor].disabled) return this.bell();
			const newSelected = !this.value[this.cursor].selected;
			this.value.filter((v) => !v.disabled).forEach((v) => v.selected = newSelected);
			this.render();
		}
		_(c, key) {
			if (c === " ") this.handleSpaceToggle();
			else if (c === "a") this.toggleAll();
			else return this.bell();
		}
		renderInstructions() {
			if (this.instructions === void 0 || this.instructions) {
				if (typeof this.instructions === "string") return this.instructions;
				return `
Instructions:
    ${figures.arrowUp}/${figures.arrowDown}: Highlight option\n    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection\n` + (this.maxChoices === void 0 ? `    a: Toggle all\n` : "") + `    enter/return: Complete answer`;
			}
			return "";
		}
		renderOption(cursor, v, i, arrowIndicator) {
			const prefix = (v.selected ? color.green(figures.radioOn) : figures.radioOff) + " " + arrowIndicator + " ";
			let title, desc;
			if (v.disabled) title = cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
			else {
				title = cursor === i ? color.cyan().underline(v.title) : v.title;
				if (cursor === i && v.description) {
					desc = ` - ${v.description}`;
					if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) desc = "\n" + wrap(v.description, {
						margin: prefix.length,
						width: this.out.columns
					});
				}
			}
			return prefix + title + color.gray(desc || "");
		}
		paginateOptions(options) {
			if (options.length === 0) return color.red("No matches for this query.");
			let { startIndex, endIndex } = entriesToDisplay(this.cursor, options.length, this.optionsPerPage);
			let prefix, styledOptions = [];
			for (let i = startIndex; i < endIndex; i++) {
				if (i === startIndex && startIndex > 0) prefix = figures.arrowUp;
				else if (i === endIndex - 1 && endIndex < options.length) prefix = figures.arrowDown;
				else prefix = " ";
				styledOptions.push(this.renderOption(this.cursor, options[i], i, prefix));
			}
			return "\n" + styledOptions.join("\n");
		}
		renderOptions(options) {
			if (!this.done) return this.paginateOptions(options);
			return "";
		}
		renderDoneOrInstructions() {
			if (this.done) return this.value.filter((e) => e.selected).map((v) => v.title).join(", ");
			const output = [color.gray(this.hint), this.renderInstructions()];
			if (this.value[this.cursor].disabled) output.push(color.yellow(this.warn));
			return output.join(" ");
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			super.render();
			let prompt = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(false),
				this.renderDoneOrInstructions()
			].join(" ");
			if (this.showMinError) {
				prompt += color.red(`You must select a minimum of ${this.minSelected} choices.`);
				this.showMinError = false;
			}
			prompt += this.renderOptions(this.value);
			this.out.write(this.clear + prompt);
			this.clear = clear(prompt, this.out.columns);
		}
	};
	module.exports = MultiselectPrompt;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/autocomplete.js
var require_autocomplete = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const color = require_kleur();
	const Prompt = require_prompt();
	const { erase, cursor } = require_src();
	const { style, clear, figures, wrap, entriesToDisplay } = require_util();
	const getVal = (arr, i) => arr[i] && (arr[i].value || arr[i].title || arr[i]);
	const getTitle = (arr, i) => arr[i] && (arr[i].title || arr[i].value || arr[i]);
	const getIndex = (arr, valOrTitle) => {
		const index = arr.findIndex((el) => el.value === valOrTitle || el.title === valOrTitle);
		return index > -1 ? index : void 0;
	};
	/**
	* TextPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Array} opts.choices Array of auto-complete choices objects
	* @param {Function} [opts.suggest] Filter function. Defaults to sort by title
	* @param {Number} [opts.limit=10] Max number of results to show
	* @param {Number} [opts.cursor=0] Cursor start position
	* @param {String} [opts.style='default'] Render style
	* @param {String} [opts.fallback] Fallback message - initial to default value
	* @param {String} [opts.initial] Index of the default value
	* @param {Boolean} [opts.clearFirst] The first ESCAPE keypress will clear the input
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {String} [opts.noMatches] The no matches found label
	*/
	var AutocompletePrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.suggest = opts.suggest;
			this.choices = opts.choices;
			this.initial = typeof opts.initial === "number" ? opts.initial : getIndex(opts.choices, opts.initial);
			this.select = this.initial || opts.cursor || 0;
			this.i18n = { noMatches: opts.noMatches || "no matches found" };
			this.fallback = opts.fallback || this.initial;
			this.clearFirst = opts.clearFirst || false;
			this.suggestions = [];
			this.input = "";
			this.limit = opts.limit || 10;
			this.cursor = 0;
			this.transform = style.render(opts.style);
			this.scale = this.transform.scale;
			this.render = this.render.bind(this);
			this.complete = this.complete.bind(this);
			this.clear = clear("", this.out.columns);
			this.complete(this.render);
			this.render();
		}
		set fallback(fb) {
			this._fb = Number.isSafeInteger(parseInt(fb)) ? parseInt(fb) : fb;
		}
		get fallback() {
			let choice;
			if (typeof this._fb === "number") choice = this.choices[this._fb];
			else if (typeof this._fb === "string") choice = { title: this._fb };
			return choice || this._fb || { title: this.i18n.noMatches };
		}
		moveSelect(i) {
			this.select = i;
			if (this.suggestions.length > 0) this.value = getVal(this.suggestions, i);
			else this.value = this.fallback.value;
			this.fire();
		}
		async complete(cb) {
			const p = this.completing = this.suggest(this.input, this.choices);
			const suggestions = await p;
			if (this.completing !== p) return;
			this.suggestions = suggestions.map((s, i, arr) => ({
				title: getTitle(arr, i),
				value: getVal(arr, i),
				description: s.description
			}));
			this.completing = false;
			const l = Math.max(suggestions.length - 1, 0);
			this.moveSelect(Math.min(l, this.select));
			cb && cb();
		}
		reset() {
			this.input = "";
			this.complete(() => {
				this.moveSelect(this.initial !== void 0 ? this.initial : 0);
				this.render();
			});
			this.render();
		}
		exit() {
			if (this.clearFirst && this.input.length > 0) this.reset();
			else {
				this.done = this.exited = true;
				this.aborted = false;
				this.fire();
				this.render();
				this.out.write("\n");
				this.close();
			}
		}
		abort() {
			this.done = this.aborted = true;
			this.exited = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			this.done = true;
			this.aborted = this.exited = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		_(c, key) {
			let s1 = this.input.slice(0, this.cursor);
			let s2 = this.input.slice(this.cursor);
			this.input = `${s1}${c}${s2}`;
			this.cursor = s1.length + 1;
			this.complete(this.render);
			this.render();
		}
		delete() {
			if (this.cursor === 0) return this.bell();
			let s1 = this.input.slice(0, this.cursor - 1);
			let s2 = this.input.slice(this.cursor);
			this.input = `${s1}${s2}`;
			this.complete(this.render);
			this.cursor = this.cursor - 1;
			this.render();
		}
		deleteForward() {
			if (this.cursor * this.scale >= this.rendered.length) return this.bell();
			let s1 = this.input.slice(0, this.cursor);
			let s2 = this.input.slice(this.cursor + 1);
			this.input = `${s1}${s2}`;
			this.complete(this.render);
			this.render();
		}
		first() {
			this.moveSelect(0);
			this.render();
		}
		last() {
			this.moveSelect(this.suggestions.length - 1);
			this.render();
		}
		up() {
			if (this.select === 0) this.moveSelect(this.suggestions.length - 1);
			else this.moveSelect(this.select - 1);
			this.render();
		}
		down() {
			if (this.select === this.suggestions.length - 1) this.moveSelect(0);
			else this.moveSelect(this.select + 1);
			this.render();
		}
		next() {
			if (this.select === this.suggestions.length - 1) this.moveSelect(0);
			else this.moveSelect(this.select + 1);
			this.render();
		}
		nextPage() {
			this.moveSelect(Math.min(this.select + this.limit, this.suggestions.length - 1));
			this.render();
		}
		prevPage() {
			this.moveSelect(Math.max(this.select - this.limit, 0));
			this.render();
		}
		left() {
			if (this.cursor <= 0) return this.bell();
			this.cursor = this.cursor - 1;
			this.render();
		}
		right() {
			if (this.cursor * this.scale >= this.rendered.length) return this.bell();
			this.cursor = this.cursor + 1;
			this.render();
		}
		renderOption(v, hovered, isStart, isEnd) {
			let desc;
			let prefix = isStart ? figures.arrowUp : isEnd ? figures.arrowDown : " ";
			let title = hovered ? color.cyan().underline(v.title) : v.title;
			prefix = (hovered ? color.cyan(figures.pointer) + " " : "  ") + prefix;
			if (v.description) {
				desc = ` - ${v.description}`;
				if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) desc = "\n" + wrap(v.description, {
					margin: 3,
					width: this.out.columns
				});
			}
			return prefix + " " + title + color.gray(desc || "");
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			else this.out.write(clear(this.outputText, this.out.columns));
			super.render();
			let { startIndex, endIndex } = entriesToDisplay(this.select, this.choices.length, this.limit);
			this.outputText = [
				style.symbol(this.done, this.aborted, this.exited),
				color.bold(this.msg),
				style.delimiter(this.completing),
				this.done && this.suggestions[this.select] ? this.suggestions[this.select].title : this.rendered = this.transform.render(this.input)
			].join(" ");
			if (!this.done) {
				const suggestions = this.suggestions.slice(startIndex, endIndex).map((item, i) => this.renderOption(item, this.select === i + startIndex, i === 0 && startIndex > 0, i + startIndex === endIndex - 1 && endIndex < this.choices.length)).join("\n");
				this.outputText += `\n` + (suggestions || color.gray(this.fallback.title));
			}
			this.out.write(erase.line + cursor.to(0) + this.outputText);
		}
	};
	module.exports = AutocompletePrompt;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/autocompleteMultiselect.js
var require_autocompleteMultiselect = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const color = require_kleur();
	const { cursor } = require_src();
	const MultiselectPrompt = require_multiselect();
	const { clear, style, figures } = require_util();
	/**
	* MultiselectPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Array} opts.choices Array of choice objects
	* @param {String} [opts.hint] Hint to display
	* @param {String} [opts.warn] Hint shown for disabled choices
	* @param {Number} [opts.max] Max choices
	* @param {Number} [opts.cursor=0] Cursor start position
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var AutocompleteMultiselectPrompt = class extends MultiselectPrompt {
		constructor(opts = {}) {
			opts.overrideRender = true;
			super(opts);
			this.inputValue = "";
			this.clear = clear("", this.out.columns);
			this.filteredOptions = this.value;
			this.render();
		}
		last() {
			this.cursor = this.filteredOptions.length - 1;
			this.render();
		}
		next() {
			this.cursor = (this.cursor + 1) % this.filteredOptions.length;
			this.render();
		}
		up() {
			if (this.cursor === 0) this.cursor = this.filteredOptions.length - 1;
			else this.cursor--;
			this.render();
		}
		down() {
			if (this.cursor === this.filteredOptions.length - 1) this.cursor = 0;
			else this.cursor++;
			this.render();
		}
		left() {
			this.filteredOptions[this.cursor].selected = false;
			this.render();
		}
		right() {
			if (this.value.filter((e) => e.selected).length >= this.maxChoices) return this.bell();
			this.filteredOptions[this.cursor].selected = true;
			this.render();
		}
		delete() {
			if (this.inputValue.length) {
				this.inputValue = this.inputValue.substr(0, this.inputValue.length - 1);
				this.updateFilteredOptions();
			}
		}
		updateFilteredOptions() {
			const currentHighlight = this.filteredOptions[this.cursor];
			this.filteredOptions = this.value.filter((v) => {
				if (this.inputValue) {
					if (typeof v.title === "string") {
						if (v.title.toLowerCase().includes(this.inputValue.toLowerCase())) return true;
					}
					if (typeof v.value === "string") {
						if (v.value.toLowerCase().includes(this.inputValue.toLowerCase())) return true;
					}
					return false;
				}
				return true;
			});
			const newHighlightIndex = this.filteredOptions.findIndex((v) => v === currentHighlight);
			this.cursor = newHighlightIndex < 0 ? 0 : newHighlightIndex;
			this.render();
		}
		handleSpaceToggle() {
			const v = this.filteredOptions[this.cursor];
			if (v.selected) {
				v.selected = false;
				this.render();
			} else if (v.disabled || this.value.filter((e) => e.selected).length >= this.maxChoices) return this.bell();
			else {
				v.selected = true;
				this.render();
			}
		}
		handleInputChange(c) {
			this.inputValue = this.inputValue + c;
			this.updateFilteredOptions();
		}
		_(c, key) {
			if (c === " ") this.handleSpaceToggle();
			else this.handleInputChange(c);
		}
		renderInstructions() {
			if (this.instructions === void 0 || this.instructions) {
				if (typeof this.instructions === "string") return this.instructions;
				return `
Instructions:
    ${figures.arrowUp}/${figures.arrowDown}: Highlight option
    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection
    [a,b,c]/delete: Filter choices
    enter/return: Complete answer
`;
			}
			return "";
		}
		renderCurrentInput() {
			return `
Filtered results for: ${this.inputValue ? this.inputValue : color.gray("Enter something to filter")}\n`;
		}
		renderOption(cursor, v, i) {
			let title;
			if (v.disabled) title = cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
			else title = cursor === i ? color.cyan().underline(v.title) : v.title;
			return (v.selected ? color.green(figures.radioOn) : figures.radioOff) + "  " + title;
		}
		renderDoneOrInstructions() {
			if (this.done) return this.value.filter((e) => e.selected).map((v) => v.title).join(", ");
			const output = [
				color.gray(this.hint),
				this.renderInstructions(),
				this.renderCurrentInput()
			];
			if (this.filteredOptions.length && this.filteredOptions[this.cursor].disabled) output.push(color.yellow(this.warn));
			return output.join(" ");
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			super.render();
			let prompt = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(false),
				this.renderDoneOrInstructions()
			].join(" ");
			if (this.showMinError) {
				prompt += color.red(`You must select a minimum of ${this.minSelected} choices.`);
				this.showMinError = false;
			}
			prompt += this.renderOptions(this.filteredOptions);
			this.out.write(this.clear + prompt);
			this.clear = clear(prompt, this.out.columns);
		}
	};
	module.exports = AutocompleteMultiselectPrompt;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/confirm.js
var require_confirm = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const color = require_kleur();
	const Prompt = require_prompt();
	const { style, clear } = require_util();
	const { erase, cursor } = require_src();
	/**
	* ConfirmPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Boolean} [opts.initial] Default value (true/false)
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {String} [opts.yes] The "Yes" label
	* @param {String} [opts.yesOption] The "Yes" option when choosing between yes/no
	* @param {String} [opts.no] The "No" label
	* @param {String} [opts.noOption] The "No" option when choosing between yes/no
	*/
	var ConfirmPrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.value = opts.initial;
			this.initialValue = !!opts.initial;
			this.yesMsg = opts.yes || "yes";
			this.yesOption = opts.yesOption || "(Y/n)";
			this.noMsg = opts.no || "no";
			this.noOption = opts.noOption || "(y/N)";
			this.render();
		}
		reset() {
			this.value = this.initialValue;
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			this.value = this.value || false;
			this.done = true;
			this.aborted = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		_(c, key) {
			if (c.toLowerCase() === "y") {
				this.value = true;
				return this.submit();
			}
			if (c.toLowerCase() === "n") {
				this.value = false;
				return this.submit();
			}
			return this.bell();
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			else this.out.write(clear(this.outputText, this.out.columns));
			super.render();
			this.outputText = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(this.done),
				this.done ? this.value ? this.yesMsg : this.noMsg : color.gray(this.initialValue ? this.yesOption : this.noOption)
			].join(" ");
			this.out.write(erase.line + cursor.to(0) + this.outputText);
		}
	};
	module.exports = ConfirmPrompt;
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/index.js
var require_elements = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		TextPrompt: require_text(),
		SelectPrompt: require_select(),
		TogglePrompt: require_toggle(),
		DatePrompt: require_date(),
		NumberPrompt: require_number(),
		MultiselectPrompt: require_multiselect(),
		AutocompletePrompt: require_autocomplete(),
		AutocompleteMultiselectPrompt: require_autocompleteMultiselect(),
		ConfirmPrompt: require_confirm()
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/prompts.js
var require_prompts$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	const $ = exports;
	const el = require_elements();
	const noop = (v) => v;
	function toPrompt(type, args, opts = {}) {
		return new Promise((res, rej) => {
			const p = new el[type](args);
			const onAbort = opts.onAbort || noop;
			const onSubmit = opts.onSubmit || noop;
			const onExit = opts.onExit || noop;
			p.on("state", args.onState || noop);
			p.on("submit", (x) => res(onSubmit(x)));
			p.on("exit", (x) => res(onExit(x)));
			p.on("abort", (x) => rej(onAbort(x)));
		});
	}
	/**
	* Text prompt
	* @param {string} args.message Prompt message to display
	* @param {string} [args.initial] Default string value
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {function} [args.onState] On state change callback
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.text = (args) => toPrompt("TextPrompt", args);
	/**
	* Password prompt with masked input
	* @param {string} args.message Prompt message to display
	* @param {string} [args.initial] Default string value
	* @param {function} [args.onState] On state change callback
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.password = (args) => {
		args.style = "password";
		return $.text(args);
	};
	/**
	* Prompt where input is invisible, like sudo
	* @param {string} args.message Prompt message to display
	* @param {string} [args.initial] Default string value
	* @param {function} [args.onState] On state change callback
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.invisible = (args) => {
		args.style = "invisible";
		return $.text(args);
	};
	/**
	* Number prompt
	* @param {string} args.message Prompt message to display
	* @param {number} args.initial Default number value
	* @param {function} [args.onState] On state change callback
	* @param {number} [args.max] Max value
	* @param {number} [args.min] Min value
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {Boolean} [opts.float=false] Parse input as floats
	* @param {Number} [opts.round=2] Round floats to x decimals
	* @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.number = (args) => toPrompt("NumberPrompt", args);
	/**
	* Date prompt
	* @param {string} args.message Prompt message to display
	* @param {number} args.initial Default number value
	* @param {function} [args.onState] On state change callback
	* @param {number} [args.max] Max value
	* @param {number} [args.min] Min value
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {Boolean} [opts.float=false] Parse input as floats
	* @param {Number} [opts.round=2] Round floats to x decimals
	* @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.date = (args) => toPrompt("DatePrompt", args);
	/**
	* Classic yes/no prompt
	* @param {string} args.message Prompt message to display
	* @param {boolean} [args.initial=false] Default value
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.confirm = (args) => toPrompt("ConfirmPrompt", args);
	/**
	* List prompt, split intput string by `seperator`
	* @param {string} args.message Prompt message to display
	* @param {string} [args.initial] Default string value
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {string} [args.separator] String separator
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input, in form of an `Array`
	*/
	$.list = (args) => {
		const sep = args.separator || ",";
		return toPrompt("TextPrompt", args, { onSubmit: (str) => str.split(sep).map((s) => s.trim()) });
	};
	/**
	* Toggle/switch prompt
	* @param {string} args.message Prompt message to display
	* @param {boolean} [args.initial=false] Default value
	* @param {string} [args.active="on"] Text for `active` state
	* @param {string} [args.inactive="off"] Text for `inactive` state
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.toggle = (args) => toPrompt("TogglePrompt", args);
	/**
	* Interactive select prompt
	* @param {string} args.message Prompt message to display
	* @param {Array} args.choices Array of choices objects `[{ title, value }, ...]`
	* @param {number} [args.initial] Index of default value
	* @param {String} [args.hint] Hint to display
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.select = (args) => toPrompt("SelectPrompt", args);
	/**
	* Interactive multi-select / autocompleteMultiselect prompt
	* @param {string} args.message Prompt message to display
	* @param {Array} args.choices Array of choices objects `[{ title, value, [selected] }, ...]`
	* @param {number} [args.max] Max select
	* @param {string} [args.hint] Hint to display user
	* @param {Number} [args.cursor=0] Cursor start position
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.multiselect = (args) => {
		args.choices = [].concat(args.choices || []);
		const toSelected = (items) => items.filter((item) => item.selected).map((item) => item.value);
		return toPrompt("MultiselectPrompt", args, {
			onAbort: toSelected,
			onSubmit: toSelected
		});
	};
	$.autocompleteMultiselect = (args) => {
		args.choices = [].concat(args.choices || []);
		const toSelected = (items) => items.filter((item) => item.selected).map((item) => item.value);
		return toPrompt("AutocompleteMultiselectPrompt", args, {
			onAbort: toSelected,
			onSubmit: toSelected
		});
	};
	const byTitle = (input, choices) => Promise.resolve(choices.filter((item) => item.title.slice(0, input.length).toLowerCase() === input.toLowerCase()));
	/**
	* Interactive auto-complete prompt
	* @param {string} args.message Prompt message to display
	* @param {Array} args.choices Array of auto-complete choices objects `[{ title, value }, ...]`
	* @param {Function} [args.suggest] Function to filter results based on user input. Defaults to sort by `title`
	* @param {number} [args.limit=10] Max number of results to show
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {String} [args.initial] Index of the default value
	* @param {boolean} [opts.clearFirst] The first ESCAPE keypress will clear the input
	* @param {String} [args.fallback] Fallback message - defaults to initial value
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.autocomplete = (args) => {
		args.suggest = args.suggest || byTitle;
		args.choices = [].concat(args.choices || []);
		return toPrompt("AutocompletePrompt", args);
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/index.js
var require_lib = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const prompts = require_prompts$1();
	const passOn = [
		"suggest",
		"format",
		"onState",
		"validate",
		"onRender",
		"type"
	];
	const noop = () => {};
	/**
	* Prompt for a series of questions
	* @param {Array|Object} questions Single question object or Array of question objects
	* @param {Function} [onSubmit] Callback function called on prompt submit
	* @param {Function} [onCancel] Callback function called on cancel/abort
	* @returns {Object} Object with values from user input
	*/
	async function prompt(questions = [], { onSubmit = noop, onCancel = noop } = {}) {
		const answers = {};
		const override = prompt._override || {};
		questions = [].concat(questions);
		let answer, question, quit, name, type, lastPrompt;
		const getFormattedAnswer = async (question, answer, skipValidation = false) => {
			if (!skipValidation && question.validate && question.validate(answer) !== true) return;
			return question.format ? await question.format(answer, answers) : answer;
		};
		for (question of questions) {
			({name, type} = question);
			if (typeof type === "function") {
				type = await type(answer, { ...answers }, question);
				question["type"] = type;
			}
			if (!type) continue;
			for (let key in question) {
				if (passOn.includes(key)) continue;
				let value = question[key];
				question[key] = typeof value === "function" ? await value(answer, { ...answers }, lastPrompt) : value;
			}
			lastPrompt = question;
			if (typeof question.message !== "string") throw new Error("prompt message is required");
			({name, type} = question);
			if (prompts[type] === void 0) throw new Error(`prompt type (${type}) is not defined`);
			if (override[question.name] !== void 0) {
				answer = await getFormattedAnswer(question, override[question.name]);
				if (answer !== void 0) {
					answers[name] = answer;
					continue;
				}
			}
			try {
				answer = prompt._injected ? getInjectedAnswer(prompt._injected, question.initial) : await prompts[type](question);
				answers[name] = answer = await getFormattedAnswer(question, answer, true);
				quit = await onSubmit(question, answer, answers);
			} catch (err) {
				quit = !await onCancel(question, answers);
			}
			if (quit) return answers;
		}
		return answers;
	}
	function getInjectedAnswer(injected, deafultValue) {
		const answer = injected.shift();
		if (answer instanceof Error) throw answer;
		return answer === void 0 ? deafultValue : answer;
	}
	function inject(answers) {
		prompt._injected = (prompt._injected || []).concat(answers);
	}
	function override(answers) {
		prompt._override = Object.assign({}, answers);
	}
	module.exports = Object.assign(prompt, {
		prompt,
		prompts,
		inject,
		override
	});
}));

//#endregion
//#region ../../node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/index.js
var require_prompts = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function isNodeLT(tar) {
		tar = (Array.isArray(tar) ? tar : tar.split(".")).map(Number);
		let i = 0, src = process.versions.node.split(".").map(Number);
		for (; i < tar.length; i++) {
			if (src[i] > tar[i]) return false;
			if (tar[i] > src[i]) return true;
		}
		return false;
	}
	module.exports = isNodeLT("8.6.0") ? require_dist() : require_lib();
}));

//#endregion
//#region src/cli/utils/diff.ts
var import_prompts = /* @__PURE__ */ __toESM(require_prompts(), 1);
var import_picocolors = /* @__PURE__ */ __toESM(require_picocolors(), 1);
const generateDiff = (originalContent, newContent) => {
	const originalLines = originalContent.split("\n");
	const newLines = newContent.split("\n");
	const diff = [];
	let originalIndex = 0;
	let newIndex = 0;
	while (originalIndex < originalLines.length || newIndex < newLines.length) {
		const originalLine = originalLines[originalIndex];
		const newLine = newLines[newIndex];
		if (originalLine === newLine) {
			diff.push({
				type: "unchanged",
				content: originalLine
			});
			originalIndex++;
			newIndex++;
		} else if (originalLine === void 0) {
			diff.push({
				type: "added",
				content: newLine
			});
			newIndex++;
		} else if (newLine === void 0) {
			diff.push({
				type: "removed",
				content: originalLine
			});
			originalIndex++;
		} else {
			const originalInNew = newLines.indexOf(originalLine, newIndex);
			const newInOriginal = originalLines.indexOf(newLine, originalIndex);
			if (originalInNew !== -1 && (newInOriginal === -1 || originalInNew - newIndex < newInOriginal - originalIndex)) while (newIndex < originalInNew) {
				diff.push({
					type: "added",
					content: newLines[newIndex]
				});
				newIndex++;
			}
			else if (newInOriginal !== -1) while (originalIndex < newInOriginal) {
				diff.push({
					type: "removed",
					content: originalLines[originalIndex]
				});
				originalIndex++;
			}
			else {
				diff.push({
					type: "removed",
					content: originalLine
				});
				diff.push({
					type: "added",
					content: newLine
				});
				originalIndex++;
				newIndex++;
			}
		}
	}
	return diff;
};
const formatDiff = (diff, contextLines = 2) => {
	const lines = [];
	let lastPrintedIndex = -1;
	const changedIndices = diff.map((line, index) => line.type !== "unchanged" ? index : -1).filter((index) => index !== -1);
	if (changedIndices.length === 0) return import_picocolors.default.dim("No changes");
	for (const changedIndex of changedIndices) {
		const startContext = Math.max(0, changedIndex - contextLines);
		const endContext = Math.min(diff.length - 1, changedIndex + contextLines);
		if (startContext > lastPrintedIndex + 1 && lastPrintedIndex !== -1) lines.push(import_picocolors.default.dim("  …"));
		for (let lineIndex = Math.max(startContext, lastPrintedIndex + 1); lineIndex <= endContext; lineIndex++) {
			const diffLine = diff[lineIndex];
			if (diffLine.type === "added") lines.push(import_picocolors.default.green(`+ ${diffLine.content}`));
			else if (diffLine.type === "removed") lines.push(import_picocolors.default.red(`- ${diffLine.content}`));
			else lines.push(import_picocolors.default.dim(`  ${diffLine.content}`));
			lastPrintedIndex = lineIndex;
		}
	}
	return lines.join("\n");
};
const printDiff = (filePath, originalContent, newContent) => {
	console.log(import_picocolors.default.bold(filePath));
	console.log(formatDiff(generateDiff(originalContent, newContent)));
	console.log("");
};

//#endregion
//#region ../../node_modules/.pnpm/fdir@6.5.0_picomatch@4.0.4/node_modules/fdir/dist/index.mjs
var __require = /* @__PURE__ */ createRequire$1(import.meta.url);
function cleanPath(path) {
	let normalized = normalize(path);
	if (normalized.length > 1 && normalized[normalized.length - 1] === sep) normalized = normalized.substring(0, normalized.length - 1);
	return normalized;
}
const SLASHES_REGEX = /[\\/]/g;
function convertSlashes(path, separator) {
	return path.replace(SLASHES_REGEX, separator);
}
const WINDOWS_ROOT_DIR_REGEX = /^[a-z]:[\\/]$/i;
function isRootDirectory(path) {
	return path === "/" || WINDOWS_ROOT_DIR_REGEX.test(path);
}
function normalizePath(path, options) {
	const { resolvePaths, normalizePath: normalizePath$1, pathSeparator } = options;
	const pathNeedsCleaning = process.platform === "win32" && path.includes("/") || path.startsWith(".");
	if (resolvePaths) path = resolve$1(path);
	if (normalizePath$1 || pathNeedsCleaning) path = cleanPath(path);
	if (path === ".") return "";
	return convertSlashes(path[path.length - 1] !== pathSeparator ? path + pathSeparator : path, pathSeparator);
}
function joinPathWithBasePath(filename, directoryPath) {
	return directoryPath + filename;
}
function joinPathWithRelativePath(root, options) {
	return function(filename, directoryPath) {
		if (directoryPath.startsWith(root)) return directoryPath.slice(root.length) + filename;
		else return convertSlashes(relative$1(root, directoryPath), options.pathSeparator) + options.pathSeparator + filename;
	};
}
function joinPath(filename) {
	return filename;
}
function joinDirectoryPath(filename, directoryPath, separator) {
	return directoryPath + filename + separator;
}
function build$7(root, options) {
	const { relativePaths, includeBasePath } = options;
	return relativePaths && root ? joinPathWithRelativePath(root, options) : includeBasePath ? joinPathWithBasePath : joinPath;
}
function pushDirectoryWithRelativePath(root) {
	return function(directoryPath, paths) {
		paths.push(directoryPath.substring(root.length) || ".");
	};
}
function pushDirectoryFilterWithRelativePath(root) {
	return function(directoryPath, paths, filters) {
		const relativePath = directoryPath.substring(root.length) || ".";
		if (filters.every((filter) => filter(relativePath, true))) paths.push(relativePath);
	};
}
const pushDirectory = (directoryPath, paths) => {
	paths.push(directoryPath || ".");
};
const pushDirectoryFilter = (directoryPath, paths, filters) => {
	const path = directoryPath || ".";
	if (filters.every((filter) => filter(path, true))) paths.push(path);
};
const empty$2 = () => {};
function build$6(root, options) {
	const { includeDirs, filters, relativePaths } = options;
	if (!includeDirs) return empty$2;
	if (relativePaths) return filters && filters.length ? pushDirectoryFilterWithRelativePath(root) : pushDirectoryWithRelativePath(root);
	return filters && filters.length ? pushDirectoryFilter : pushDirectory;
}
const pushFileFilterAndCount = (filename, _paths, counts, filters) => {
	if (filters.every((filter) => filter(filename, false))) counts.files++;
};
const pushFileFilter = (filename, paths, _counts, filters) => {
	if (filters.every((filter) => filter(filename, false))) paths.push(filename);
};
const pushFileCount = (_filename, _paths, counts, _filters) => {
	counts.files++;
};
const pushFile = (filename, paths) => {
	paths.push(filename);
};
const empty$1 = () => {};
function build$5(options) {
	const { excludeFiles, filters, onlyCounts } = options;
	if (excludeFiles) return empty$1;
	if (filters && filters.length) return onlyCounts ? pushFileFilterAndCount : pushFileFilter;
	else if (onlyCounts) return pushFileCount;
	else return pushFile;
}
const getArray = (paths) => {
	return paths;
};
const getArrayGroup = () => {
	return [""].slice(0, 0);
};
function build$4(options) {
	return options.group ? getArrayGroup : getArray;
}
const groupFiles = (groups, directory, files) => {
	groups.push({
		directory,
		files,
		dir: directory
	});
};
const empty = () => {};
function build$3(options) {
	return options.group ? groupFiles : empty;
}
const resolveSymlinksAsync = function(path, state, callback$1) {
	const { queue, fs, options: { suppressErrors } } = state;
	queue.enqueue();
	fs.realpath(path, (error, resolvedPath) => {
		if (error) return queue.dequeue(suppressErrors ? null : error, state);
		fs.stat(resolvedPath, (error$1, stat) => {
			if (error$1) return queue.dequeue(suppressErrors ? null : error$1, state);
			if (stat.isDirectory() && isRecursive(path, resolvedPath, state)) return queue.dequeue(null, state);
			callback$1(stat, resolvedPath);
			queue.dequeue(null, state);
		});
	});
};
const resolveSymlinks = function(path, state, callback$1) {
	const { queue, fs, options: { suppressErrors } } = state;
	queue.enqueue();
	try {
		const resolvedPath = fs.realpathSync(path);
		const stat = fs.statSync(resolvedPath);
		if (stat.isDirectory() && isRecursive(path, resolvedPath, state)) return;
		callback$1(stat, resolvedPath);
	} catch (e) {
		if (!suppressErrors) throw e;
	}
};
function build$2(options, isSynchronous) {
	if (!options.resolveSymlinks || options.excludeSymlinks) return null;
	return isSynchronous ? resolveSymlinks : resolveSymlinksAsync;
}
function isRecursive(path, resolved, state) {
	if (state.options.useRealPaths) return isRecursiveUsingRealPaths(resolved, state);
	let parent = dirname(path);
	let depth = 1;
	while (parent !== state.root && depth < 2) {
		const resolvedPath = state.symlinks.get(parent);
		if (!!resolvedPath && (resolvedPath === resolved || resolvedPath.startsWith(resolved) || resolved.startsWith(resolvedPath))) depth++;
		else parent = dirname(parent);
	}
	state.symlinks.set(path, resolved);
	return depth > 1;
}
function isRecursiveUsingRealPaths(resolved, state) {
	return state.visited.includes(resolved + state.options.pathSeparator);
}
const onlyCountsSync = (state) => {
	return state.counts;
};
const groupsSync = (state) => {
	return state.groups;
};
const defaultSync = (state) => {
	return state.paths;
};
const limitFilesSync = (state) => {
	return state.paths.slice(0, state.options.maxFiles);
};
const onlyCountsAsync = (state, error, callback$1) => {
	report(error, callback$1, state.counts, state.options.suppressErrors);
	return null;
};
const defaultAsync = (state, error, callback$1) => {
	report(error, callback$1, state.paths, state.options.suppressErrors);
	return null;
};
const limitFilesAsync = (state, error, callback$1) => {
	report(error, callback$1, state.paths.slice(0, state.options.maxFiles), state.options.suppressErrors);
	return null;
};
const groupsAsync = (state, error, callback$1) => {
	report(error, callback$1, state.groups, state.options.suppressErrors);
	return null;
};
function report(error, callback$1, output, suppressErrors) {
	if (error && !suppressErrors) callback$1(error, output);
	else callback$1(null, output);
}
function build$1(options, isSynchronous) {
	const { onlyCounts, group, maxFiles } = options;
	if (onlyCounts) return isSynchronous ? onlyCountsSync : onlyCountsAsync;
	else if (group) return isSynchronous ? groupsSync : groupsAsync;
	else if (maxFiles) return isSynchronous ? limitFilesSync : limitFilesAsync;
	else return isSynchronous ? defaultSync : defaultAsync;
}
const readdirOpts = { withFileTypes: true };
const walkAsync = (state, crawlPath, directoryPath, currentDepth, callback$1) => {
	state.queue.enqueue();
	if (currentDepth < 0) return state.queue.dequeue(null, state);
	const { fs } = state;
	state.visited.push(crawlPath);
	state.counts.directories++;
	fs.readdir(crawlPath || ".", readdirOpts, (error, entries = []) => {
		callback$1(entries, directoryPath, currentDepth);
		state.queue.dequeue(state.options.suppressErrors ? null : error, state);
	});
};
const walkSync = (state, crawlPath, directoryPath, currentDepth, callback$1) => {
	const { fs } = state;
	if (currentDepth < 0) return;
	state.visited.push(crawlPath);
	state.counts.directories++;
	let entries = [];
	try {
		entries = fs.readdirSync(crawlPath || ".", readdirOpts);
	} catch (e) {
		if (!state.options.suppressErrors) throw e;
	}
	callback$1(entries, directoryPath, currentDepth);
};
function build(isSynchronous) {
	return isSynchronous ? walkSync : walkAsync;
}
/**
* This is a custom stateless queue to track concurrent async fs calls.
* It increments a counter whenever a call is queued and decrements it
* as soon as it completes. When the counter hits 0, it calls onQueueEmpty.
*/
var Queue = class {
	count = 0;
	constructor(onQueueEmpty) {
		this.onQueueEmpty = onQueueEmpty;
	}
	enqueue() {
		this.count++;
		return this.count;
	}
	dequeue(error, output) {
		if (this.onQueueEmpty && (--this.count <= 0 || error)) {
			this.onQueueEmpty(error, output);
			if (error) {
				output.controller.abort();
				this.onQueueEmpty = void 0;
			}
		}
	}
};
var Counter = class {
	_files = 0;
	_directories = 0;
	set files(num) {
		this._files = num;
	}
	get files() {
		return this._files;
	}
	set directories(num) {
		this._directories = num;
	}
	get directories() {
		return this._directories;
	}
	/**
	* @deprecated use `directories` instead
	*/
	/* c8 ignore next 3 */
	get dirs() {
		return this._directories;
	}
};
/**
* AbortController is not supported on Node 14 so we use this until we can drop
* support for Node 14.
*/
var Aborter = class {
	aborted = false;
	abort() {
		this.aborted = true;
	}
};
var Walker = class {
	root;
	isSynchronous;
	state;
	joinPath;
	pushDirectory;
	pushFile;
	getArray;
	groupFiles;
	resolveSymlink;
	walkDirectory;
	callbackInvoker;
	constructor(root, options, callback$1) {
		this.isSynchronous = !callback$1;
		this.callbackInvoker = build$1(options, this.isSynchronous);
		this.root = normalizePath(root, options);
		this.state = {
			root: isRootDirectory(this.root) ? this.root : this.root.slice(0, -1),
			paths: [""].slice(0, 0),
			groups: [],
			counts: new Counter(),
			options,
			queue: new Queue((error, state) => this.callbackInvoker(state, error, callback$1)),
			symlinks: /* @__PURE__ */ new Map(),
			visited: [""].slice(0, 0),
			controller: new Aborter(),
			fs: options.fs || nativeFs
		};
		this.joinPath = build$7(this.root, options);
		this.pushDirectory = build$6(this.root, options);
		this.pushFile = build$5(options);
		this.getArray = build$4(options);
		this.groupFiles = build$3(options);
		this.resolveSymlink = build$2(options, this.isSynchronous);
		this.walkDirectory = build(this.isSynchronous);
	}
	start() {
		this.pushDirectory(this.root, this.state.paths, this.state.options.filters);
		this.walkDirectory(this.state, this.root, this.root, this.state.options.maxDepth, this.walk);
		return this.isSynchronous ? this.callbackInvoker(this.state, null) : null;
	}
	walk = (entries, directoryPath, depth) => {
		const { paths, options: { filters, resolveSymlinks: resolveSymlinks$1, excludeSymlinks, exclude, maxFiles, signal, useRealPaths, pathSeparator }, controller } = this.state;
		if (controller.aborted || signal && signal.aborted || maxFiles && paths.length > maxFiles) return;
		const files = this.getArray(this.state.paths);
		for (let i = 0; i < entries.length; ++i) {
			const entry = entries[i];
			if (entry.isFile() || entry.isSymbolicLink() && !resolveSymlinks$1 && !excludeSymlinks) {
				const filename = this.joinPath(entry.name, directoryPath);
				this.pushFile(filename, files, this.state.counts, filters);
			} else if (entry.isDirectory()) {
				let path = joinDirectoryPath(entry.name, directoryPath, this.state.options.pathSeparator);
				if (exclude && exclude(entry.name, path)) continue;
				this.pushDirectory(path, paths, filters);
				this.walkDirectory(this.state, path, path, depth - 1, this.walk);
			} else if (this.resolveSymlink && entry.isSymbolicLink()) {
				let path = joinPathWithBasePath(entry.name, directoryPath);
				this.resolveSymlink(path, this.state, (stat, resolvedPath) => {
					if (stat.isDirectory()) {
						resolvedPath = normalizePath(resolvedPath, this.state.options);
						if (exclude && exclude(entry.name, useRealPaths ? resolvedPath : path + pathSeparator)) return;
						this.walkDirectory(this.state, resolvedPath, useRealPaths ? resolvedPath : path + pathSeparator, depth - 1, this.walk);
					} else {
						resolvedPath = useRealPaths ? resolvedPath : path;
						const filename = basename(resolvedPath);
						const directoryPath$1 = normalizePath(dirname(resolvedPath), this.state.options);
						resolvedPath = this.joinPath(filename, directoryPath$1);
						this.pushFile(resolvedPath, files, this.state.counts, filters);
					}
				});
			}
		}
		this.groupFiles(this.state.groups, directoryPath, files);
	};
};
function promise(root, options) {
	return new Promise((resolve$1, reject) => {
		callback(root, options, (err, output) => {
			if (err) return reject(err);
			resolve$1(output);
		});
	});
}
function callback(root, options, callback$1) {
	new Walker(root, options, callback$1).start();
}
function sync(root, options) {
	return new Walker(root, options).start();
}
var APIBuilder = class {
	constructor(root, options) {
		this.root = root;
		this.options = options;
	}
	withPromise() {
		return promise(this.root, this.options);
	}
	withCallback(cb) {
		callback(this.root, this.options, cb);
	}
	sync() {
		return sync(this.root, this.options);
	}
};
let pm = null;
/* c8 ignore next 6 */
try {
	__require.resolve("picomatch");
	pm = __require("picomatch");
} catch {}
var Builder = class {
	globCache = {};
	options = {
		maxDepth: Infinity,
		suppressErrors: true,
		pathSeparator: sep,
		filters: []
	};
	globFunction;
	constructor(options) {
		this.options = {
			...this.options,
			...options
		};
		this.globFunction = this.options.globFunction;
	}
	group() {
		this.options.group = true;
		return this;
	}
	withPathSeparator(separator) {
		this.options.pathSeparator = separator;
		return this;
	}
	withBasePath() {
		this.options.includeBasePath = true;
		return this;
	}
	withRelativePaths() {
		this.options.relativePaths = true;
		return this;
	}
	withDirs() {
		this.options.includeDirs = true;
		return this;
	}
	withMaxDepth(depth) {
		this.options.maxDepth = depth;
		return this;
	}
	withMaxFiles(limit) {
		this.options.maxFiles = limit;
		return this;
	}
	withFullPaths() {
		this.options.resolvePaths = true;
		this.options.includeBasePath = true;
		return this;
	}
	withErrors() {
		this.options.suppressErrors = false;
		return this;
	}
	withSymlinks({ resolvePaths = true } = {}) {
		this.options.resolveSymlinks = true;
		this.options.useRealPaths = resolvePaths;
		return this.withFullPaths();
	}
	withAbortSignal(signal) {
		this.options.signal = signal;
		return this;
	}
	normalize() {
		this.options.normalizePath = true;
		return this;
	}
	filter(predicate) {
		this.options.filters.push(predicate);
		return this;
	}
	onlyDirs() {
		this.options.excludeFiles = true;
		this.options.includeDirs = true;
		return this;
	}
	exclude(predicate) {
		this.options.exclude = predicate;
		return this;
	}
	onlyCounts() {
		this.options.onlyCounts = true;
		return this;
	}
	crawl(root) {
		return new APIBuilder(root || ".", this.options);
	}
	withGlobFunction(fn) {
		this.globFunction = fn;
		return this;
	}
	/**
	* @deprecated Pass options using the constructor instead:
	* ```ts
	* new fdir(options).crawl("/path/to/root");
	* ```
	* This method will be removed in v7.0
	*/
	/* c8 ignore next 4 */
	crawlWithOptions(root, options) {
		this.options = {
			...this.options,
			...options
		};
		return new APIBuilder(root || ".", this.options);
	}
	glob(...patterns) {
		if (this.globFunction) return this.globWithOptions(patterns);
		return this.globWithOptions(patterns, ...[{ dot: true }]);
	}
	globWithOptions(patterns, ...options) {
		const globFn = this.globFunction || pm;
		/* c8 ignore next 5 */
		if (!globFn) throw new Error("Please specify a glob function to use glob matching.");
		var isMatch = this.globCache[patterns.join("\0")];
		if (!isMatch) {
			isMatch = globFn(patterns, ...options);
			this.globCache[patterns.join("\0")] = isMatch;
		}
		this.options.filters.push((path) => isMatch(path));
		return this;
	}
};

//#endregion
//#region ../../node_modules/.pnpm/picomatch@4.0.4/node_modules/picomatch/lib/constants.js
var require_constants = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const WIN_SLASH = "\\\\/";
	const WIN_NO_SLASH = `[^${WIN_SLASH}]`;
	const DEFAULT_MAX_EXTGLOB_RECURSION = 0;
	/**
	* Posix glob regex
	*/
	const DOT_LITERAL = "\\.";
	const PLUS_LITERAL = "\\+";
	const QMARK_LITERAL = "\\?";
	const SLASH_LITERAL = "\\/";
	const ONE_CHAR = "(?=.)";
	const QMARK = "[^/]";
	const END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
	const START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
	const DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
	const POSIX_CHARS = {
		DOT_LITERAL,
		PLUS_LITERAL,
		QMARK_LITERAL,
		SLASH_LITERAL,
		ONE_CHAR,
		QMARK,
		END_ANCHOR,
		DOTS_SLASH,
		NO_DOT: `(?!${DOT_LITERAL})`,
		NO_DOTS: `(?!${START_ANCHOR}${DOTS_SLASH})`,
		NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`,
		NO_DOTS_SLASH: `(?!${DOTS_SLASH})`,
		QMARK_NO_DOT: `[^.${SLASH_LITERAL}]`,
		STAR: `${QMARK}*?`,
		START_ANCHOR,
		SEP: "/"
	};
	/**
	* Windows glob regex
	*/
	const WINDOWS_CHARS = {
		...POSIX_CHARS,
		SLASH_LITERAL: `[${WIN_SLASH}]`,
		QMARK: WIN_NO_SLASH,
		STAR: `${WIN_NO_SLASH}*?`,
		DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
		NO_DOT: `(?!${DOT_LITERAL})`,
		NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
		NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
		NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
		QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
		START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
		END_ANCHOR: `(?:[${WIN_SLASH}]|$)`,
		SEP: "\\"
	};
	/**
	* POSIX Bracket Regex
	*/
	const POSIX_REGEX_SOURCE = {
		__proto__: null,
		alnum: "a-zA-Z0-9",
		alpha: "a-zA-Z",
		ascii: "\\x00-\\x7F",
		blank: " \\t",
		cntrl: "\\x00-\\x1F\\x7F",
		digit: "0-9",
		graph: "\\x21-\\x7E",
		lower: "a-z",
		print: "\\x20-\\x7E ",
		punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",
		space: " \\t\\r\\n\\v\\f",
		upper: "A-Z",
		word: "A-Za-z0-9_",
		xdigit: "A-Fa-f0-9"
	};
	module.exports = {
		DEFAULT_MAX_EXTGLOB_RECURSION,
		MAX_LENGTH: 1024 * 64,
		POSIX_REGEX_SOURCE,
		REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
		REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
		REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
		REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
		REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
		REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
		REPLACEMENTS: {
			__proto__: null,
			"***": "*",
			"**/**": "**",
			"**/**/**": "**"
		},
		CHAR_0: 48,
		CHAR_9: 57,
		CHAR_UPPERCASE_A: 65,
		CHAR_LOWERCASE_A: 97,
		CHAR_UPPERCASE_Z: 90,
		CHAR_LOWERCASE_Z: 122,
		CHAR_LEFT_PARENTHESES: 40,
		CHAR_RIGHT_PARENTHESES: 41,
		CHAR_ASTERISK: 42,
		CHAR_AMPERSAND: 38,
		CHAR_AT: 64,
		CHAR_BACKWARD_SLASH: 92,
		CHAR_CARRIAGE_RETURN: 13,
		CHAR_CIRCUMFLEX_ACCENT: 94,
		CHAR_COLON: 58,
		CHAR_COMMA: 44,
		CHAR_DOT: 46,
		CHAR_DOUBLE_QUOTE: 34,
		CHAR_EQUAL: 61,
		CHAR_EXCLAMATION_MARK: 33,
		CHAR_FORM_FEED: 12,
		CHAR_FORWARD_SLASH: 47,
		CHAR_GRAVE_ACCENT: 96,
		CHAR_HASH: 35,
		CHAR_HYPHEN_MINUS: 45,
		CHAR_LEFT_ANGLE_BRACKET: 60,
		CHAR_LEFT_CURLY_BRACE: 123,
		CHAR_LEFT_SQUARE_BRACKET: 91,
		CHAR_LINE_FEED: 10,
		CHAR_NO_BREAK_SPACE: 160,
		CHAR_PERCENT: 37,
		CHAR_PLUS: 43,
		CHAR_QUESTION_MARK: 63,
		CHAR_RIGHT_ANGLE_BRACKET: 62,
		CHAR_RIGHT_CURLY_BRACE: 125,
		CHAR_RIGHT_SQUARE_BRACKET: 93,
		CHAR_SEMICOLON: 59,
		CHAR_SINGLE_QUOTE: 39,
		CHAR_SPACE: 32,
		CHAR_TAB: 9,
		CHAR_UNDERSCORE: 95,
		CHAR_VERTICAL_LINE: 124,
		CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
		/**
		* Create EXTGLOB_CHARS
		*/
		extglobChars(chars) {
			return {
				"!": {
					type: "negate",
					open: "(?:(?!(?:",
					close: `))${chars.STAR})`
				},
				"?": {
					type: "qmark",
					open: "(?:",
					close: ")?"
				},
				"+": {
					type: "plus",
					open: "(?:",
					close: ")+"
				},
				"*": {
					type: "star",
					open: "(?:",
					close: ")*"
				},
				"@": {
					type: "at",
					open: "(?:",
					close: ")"
				}
			};
		},
		/**
		* Create GLOB_CHARS
		*/
		globChars(win32) {
			return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
		}
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/picomatch@4.0.4/node_modules/picomatch/lib/utils.js
var require_utils = /* @__PURE__ */ __commonJSMin(((exports) => {
	const { REGEX_BACKSLASH, REGEX_REMOVE_BACKSLASH, REGEX_SPECIAL_CHARS, REGEX_SPECIAL_CHARS_GLOBAL } = require_constants();
	exports.isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
	exports.hasRegexChars = (str) => REGEX_SPECIAL_CHARS.test(str);
	exports.isRegexChar = (str) => str.length === 1 && exports.hasRegexChars(str);
	exports.escapeRegex = (str) => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, "\\$1");
	exports.toPosixSlashes = (str) => str.replace(REGEX_BACKSLASH, "/");
	exports.isWindows = () => {
		if (typeof navigator !== "undefined" && navigator.platform) {
			const platform = navigator.platform.toLowerCase();
			return platform === "win32" || platform === "windows";
		}
		if (typeof process !== "undefined" && process.platform) return process.platform === "win32";
		return false;
	};
	exports.removeBackslashes = (str) => {
		return str.replace(REGEX_REMOVE_BACKSLASH, (match) => {
			return match === "\\" ? "" : match;
		});
	};
	exports.escapeLast = (input, char, lastIdx) => {
		const idx = input.lastIndexOf(char, lastIdx);
		if (idx === -1) return input;
		if (input[idx - 1] === "\\") return exports.escapeLast(input, char, idx - 1);
		return `${input.slice(0, idx)}\\${input.slice(idx)}`;
	};
	exports.removePrefix = (input, state = {}) => {
		let output = input;
		if (output.startsWith("./")) {
			output = output.slice(2);
			state.prefix = "./";
		}
		return output;
	};
	exports.wrapOutput = (input, state = {}, options = {}) => {
		let output = `${options.contains ? "" : "^"}(?:${input})${options.contains ? "" : "$"}`;
		if (state.negated === true) output = `(?:^(?!${output}).*$)`;
		return output;
	};
	exports.basename = (path, { windows } = {}) => {
		const segs = path.split(windows ? /[\\/]/ : "/");
		const last = segs[segs.length - 1];
		if (last === "") return segs[segs.length - 2];
		return last;
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/picomatch@4.0.4/node_modules/picomatch/lib/scan.js
var require_scan = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const utils = require_utils();
	const { CHAR_ASTERISK, CHAR_AT, CHAR_BACKWARD_SLASH, CHAR_COMMA, CHAR_DOT, CHAR_EXCLAMATION_MARK, CHAR_FORWARD_SLASH, CHAR_LEFT_CURLY_BRACE, CHAR_LEFT_PARENTHESES, CHAR_LEFT_SQUARE_BRACKET, CHAR_PLUS, CHAR_QUESTION_MARK, CHAR_RIGHT_CURLY_BRACE, CHAR_RIGHT_PARENTHESES, CHAR_RIGHT_SQUARE_BRACKET } = require_constants();
	const isPathSeparator = (code) => {
		return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
	};
	const depth = (token) => {
		if (token.isPrefix !== true) token.depth = token.isGlobstar ? Infinity : 1;
	};
	/**
	* Quickly scans a glob pattern and returns an object with a handful of
	* useful properties, like `isGlob`, `path` (the leading non-glob, if it exists),
	* `glob` (the actual pattern), `negated` (true if the path starts with `!` but not
	* with `!(`) and `negatedExtglob` (true if the path starts with `!(`).
	*
	* ```js
	* const pm = require('picomatch');
	* console.log(pm.scan('foo/bar/*.js'));
	* { isGlob: true, input: 'foo/bar/*.js', base: 'foo/bar', glob: '*.js' }
	* ```
	* @param {String} `str`
	* @param {Object} `options`
	* @return {Object} Returns an object with tokens and regex source string.
	* @api public
	*/
	const scan = (input, options) => {
		const opts = options || {};
		const length = input.length - 1;
		const scanToEnd = opts.parts === true || opts.scanToEnd === true;
		const slashes = [];
		const tokens = [];
		const parts = [];
		let str = input;
		let index = -1;
		let start = 0;
		let lastIndex = 0;
		let isBrace = false;
		let isBracket = false;
		let isGlob = false;
		let isExtglob = false;
		let isGlobstar = false;
		let braceEscaped = false;
		let backslashes = false;
		let negated = false;
		let negatedExtglob = false;
		let finished = false;
		let braces = 0;
		let prev;
		let code;
		let token = {
			value: "",
			depth: 0,
			isGlob: false
		};
		const eos = () => index >= length;
		const peek = () => str.charCodeAt(index + 1);
		const advance = () => {
			prev = code;
			return str.charCodeAt(++index);
		};
		while (index < length) {
			code = advance();
			let next;
			if (code === CHAR_BACKWARD_SLASH) {
				backslashes = token.backslashes = true;
				code = advance();
				if (code === CHAR_LEFT_CURLY_BRACE) braceEscaped = true;
				continue;
			}
			if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
				braces++;
				while (eos() !== true && (code = advance())) {
					if (code === CHAR_BACKWARD_SLASH) {
						backslashes = token.backslashes = true;
						advance();
						continue;
					}
					if (code === CHAR_LEFT_CURLY_BRACE) {
						braces++;
						continue;
					}
					if (braceEscaped !== true && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
						isBrace = token.isBrace = true;
						isGlob = token.isGlob = true;
						finished = true;
						if (scanToEnd === true) continue;
						break;
					}
					if (braceEscaped !== true && code === CHAR_COMMA) {
						isBrace = token.isBrace = true;
						isGlob = token.isGlob = true;
						finished = true;
						if (scanToEnd === true) continue;
						break;
					}
					if (code === CHAR_RIGHT_CURLY_BRACE) {
						braces--;
						if (braces === 0) {
							braceEscaped = false;
							isBrace = token.isBrace = true;
							finished = true;
							break;
						}
					}
				}
				if (scanToEnd === true) continue;
				break;
			}
			if (code === CHAR_FORWARD_SLASH) {
				slashes.push(index);
				tokens.push(token);
				token = {
					value: "",
					depth: 0,
					isGlob: false
				};
				if (finished === true) continue;
				if (prev === CHAR_DOT && index === start + 1) {
					start += 2;
					continue;
				}
				lastIndex = index + 1;
				continue;
			}
			if (opts.noext !== true) {
				if ((code === CHAR_PLUS || code === CHAR_AT || code === CHAR_ASTERISK || code === CHAR_QUESTION_MARK || code === CHAR_EXCLAMATION_MARK) === true && peek() === CHAR_LEFT_PARENTHESES) {
					isGlob = token.isGlob = true;
					isExtglob = token.isExtglob = true;
					finished = true;
					if (code === CHAR_EXCLAMATION_MARK && index === start) negatedExtglob = true;
					if (scanToEnd === true) {
						while (eos() !== true && (code = advance())) {
							if (code === CHAR_BACKWARD_SLASH) {
								backslashes = token.backslashes = true;
								code = advance();
								continue;
							}
							if (code === CHAR_RIGHT_PARENTHESES) {
								isGlob = token.isGlob = true;
								finished = true;
								break;
							}
						}
						continue;
					}
					break;
				}
			}
			if (code === CHAR_ASTERISK) {
				if (prev === CHAR_ASTERISK) isGlobstar = token.isGlobstar = true;
				isGlob = token.isGlob = true;
				finished = true;
				if (scanToEnd === true) continue;
				break;
			}
			if (code === CHAR_QUESTION_MARK) {
				isGlob = token.isGlob = true;
				finished = true;
				if (scanToEnd === true) continue;
				break;
			}
			if (code === CHAR_LEFT_SQUARE_BRACKET) {
				while (eos() !== true && (next = advance())) {
					if (next === CHAR_BACKWARD_SLASH) {
						backslashes = token.backslashes = true;
						advance();
						continue;
					}
					if (next === CHAR_RIGHT_SQUARE_BRACKET) {
						isBracket = token.isBracket = true;
						isGlob = token.isGlob = true;
						finished = true;
						break;
					}
				}
				if (scanToEnd === true) continue;
				break;
			}
			if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start) {
				negated = token.negated = true;
				start++;
				continue;
			}
			if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
				isGlob = token.isGlob = true;
				if (scanToEnd === true) {
					while (eos() !== true && (code = advance())) {
						if (code === CHAR_LEFT_PARENTHESES) {
							backslashes = token.backslashes = true;
							code = advance();
							continue;
						}
						if (code === CHAR_RIGHT_PARENTHESES) {
							finished = true;
							break;
						}
					}
					continue;
				}
				break;
			}
			if (isGlob === true) {
				finished = true;
				if (scanToEnd === true) continue;
				break;
			}
		}
		if (opts.noext === true) {
			isExtglob = false;
			isGlob = false;
		}
		let base = str;
		let prefix = "";
		let glob = "";
		if (start > 0) {
			prefix = str.slice(0, start);
			str = str.slice(start);
			lastIndex -= start;
		}
		if (base && isGlob === true && lastIndex > 0) {
			base = str.slice(0, lastIndex);
			glob = str.slice(lastIndex);
		} else if (isGlob === true) {
			base = "";
			glob = str;
		} else base = str;
		if (base && base !== "" && base !== "/" && base !== str) {
			if (isPathSeparator(base.charCodeAt(base.length - 1))) base = base.slice(0, -1);
		}
		if (opts.unescape === true) {
			if (glob) glob = utils.removeBackslashes(glob);
			if (base && backslashes === true) base = utils.removeBackslashes(base);
		}
		const state = {
			prefix,
			input,
			start,
			base,
			glob,
			isBrace,
			isBracket,
			isGlob,
			isExtglob,
			isGlobstar,
			negated,
			negatedExtglob
		};
		if (opts.tokens === true) {
			state.maxDepth = 0;
			if (!isPathSeparator(code)) tokens.push(token);
			state.tokens = tokens;
		}
		if (opts.parts === true || opts.tokens === true) {
			let prevIndex;
			for (let idx = 0; idx < slashes.length; idx++) {
				const n = prevIndex ? prevIndex + 1 : start;
				const i = slashes[idx];
				const value = input.slice(n, i);
				if (opts.tokens) {
					if (idx === 0 && start !== 0) {
						tokens[idx].isPrefix = true;
						tokens[idx].value = prefix;
					} else tokens[idx].value = value;
					depth(tokens[idx]);
					state.maxDepth += tokens[idx].depth;
				}
				if (idx !== 0 || value !== "") parts.push(value);
				prevIndex = i;
			}
			if (prevIndex && prevIndex + 1 < input.length) {
				const value = input.slice(prevIndex + 1);
				parts.push(value);
				if (opts.tokens) {
					tokens[tokens.length - 1].value = value;
					depth(tokens[tokens.length - 1]);
					state.maxDepth += tokens[tokens.length - 1].depth;
				}
			}
			state.slashes = slashes;
			state.parts = parts;
		}
		return state;
	};
	module.exports = scan;
}));

//#endregion
//#region ../../node_modules/.pnpm/picomatch@4.0.4/node_modules/picomatch/lib/parse.js
var require_parse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const constants = require_constants();
	const utils = require_utils();
	/**
	* Constants
	*/
	const { MAX_LENGTH, POSIX_REGEX_SOURCE, REGEX_NON_SPECIAL_CHARS, REGEX_SPECIAL_CHARS_BACKREF, REPLACEMENTS } = constants;
	/**
	* Helpers
	*/
	const expandRange = (args, options) => {
		if (typeof options.expandRange === "function") return options.expandRange(...args, options);
		args.sort();
		const value = `[${args.join("-")}]`;
		try {
			new RegExp(value);
		} catch (ex) {
			return args.map((v) => utils.escapeRegex(v)).join("..");
		}
		return value;
	};
	/**
	* Create the message for a syntax error
	*/
	const syntaxError = (type, char) => {
		return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
	};
	const splitTopLevel = (input) => {
		const parts = [];
		let bracket = 0;
		let paren = 0;
		let quote = 0;
		let value = "";
		let escaped = false;
		for (const ch of input) {
			if (escaped === true) {
				value += ch;
				escaped = false;
				continue;
			}
			if (ch === "\\") {
				value += ch;
				escaped = true;
				continue;
			}
			if (ch === "\"") {
				quote = quote === 1 ? 0 : 1;
				value += ch;
				continue;
			}
			if (quote === 0) {
				if (ch === "[") bracket++;
				else if (ch === "]" && bracket > 0) bracket--;
				else if (bracket === 0) {
					if (ch === "(") paren++;
					else if (ch === ")" && paren > 0) paren--;
					else if (ch === "|" && paren === 0) {
						parts.push(value);
						value = "";
						continue;
					}
				}
			}
			value += ch;
		}
		parts.push(value);
		return parts;
	};
	const isPlainBranch = (branch) => {
		let escaped = false;
		for (const ch of branch) {
			if (escaped === true) {
				escaped = false;
				continue;
			}
			if (ch === "\\") {
				escaped = true;
				continue;
			}
			if (/[?*+@!()[\]{}]/.test(ch)) return false;
		}
		return true;
	};
	const normalizeSimpleBranch = (branch) => {
		let value = branch.trim();
		let changed = true;
		while (changed === true) {
			changed = false;
			if (/^@\([^\\()[\]{}|]+\)$/.test(value)) {
				value = value.slice(2, -1);
				changed = true;
			}
		}
		if (!isPlainBranch(value)) return;
		return value.replace(/\\(.)/g, "$1");
	};
	const hasRepeatedCharPrefixOverlap = (branches) => {
		const values = branches.map(normalizeSimpleBranch).filter(Boolean);
		for (let i = 0; i < values.length; i++) for (let j = i + 1; j < values.length; j++) {
			const a = values[i];
			const b = values[j];
			const char = a[0];
			if (!char || a !== char.repeat(a.length) || b !== char.repeat(b.length)) continue;
			if (a === b || a.startsWith(b) || b.startsWith(a)) return true;
		}
		return false;
	};
	const parseRepeatedExtglob = (pattern, requireEnd = true) => {
		if (pattern[0] !== "+" && pattern[0] !== "*" || pattern[1] !== "(") return;
		let bracket = 0;
		let paren = 0;
		let quote = 0;
		let escaped = false;
		for (let i = 1; i < pattern.length; i++) {
			const ch = pattern[i];
			if (escaped === true) {
				escaped = false;
				continue;
			}
			if (ch === "\\") {
				escaped = true;
				continue;
			}
			if (ch === "\"") {
				quote = quote === 1 ? 0 : 1;
				continue;
			}
			if (quote === 1) continue;
			if (ch === "[") {
				bracket++;
				continue;
			}
			if (ch === "]" && bracket > 0) {
				bracket--;
				continue;
			}
			if (bracket > 0) continue;
			if (ch === "(") {
				paren++;
				continue;
			}
			if (ch === ")") {
				paren--;
				if (paren === 0) {
					if (requireEnd === true && i !== pattern.length - 1) return;
					return {
						type: pattern[0],
						body: pattern.slice(2, i),
						end: i
					};
				}
			}
		}
	};
	const getStarExtglobSequenceOutput = (pattern) => {
		let index = 0;
		const chars = [];
		while (index < pattern.length) {
			const match = parseRepeatedExtglob(pattern.slice(index), false);
			if (!match || match.type !== "*") return;
			const branches = splitTopLevel(match.body).map((branch) => branch.trim());
			if (branches.length !== 1) return;
			const branch = normalizeSimpleBranch(branches[0]);
			if (!branch || branch.length !== 1) return;
			chars.push(branch);
			index += match.end + 1;
		}
		if (chars.length < 1) return;
		return `${chars.length === 1 ? utils.escapeRegex(chars[0]) : `[${chars.map((ch) => utils.escapeRegex(ch)).join("")}]`}*`;
	};
	const repeatedExtglobRecursion = (pattern) => {
		let depth = 0;
		let value = pattern.trim();
		let match = parseRepeatedExtglob(value);
		while (match) {
			depth++;
			value = match.body.trim();
			match = parseRepeatedExtglob(value);
		}
		return depth;
	};
	const analyzeRepeatedExtglob = (body, options) => {
		if (options.maxExtglobRecursion === false) return { risky: false };
		const max = typeof options.maxExtglobRecursion === "number" ? options.maxExtglobRecursion : constants.DEFAULT_MAX_EXTGLOB_RECURSION;
		const branches = splitTopLevel(body).map((branch) => branch.trim());
		if (branches.length > 1) {
			if (branches.some((branch) => branch === "") || branches.some((branch) => /^[*?]+$/.test(branch)) || hasRepeatedCharPrefixOverlap(branches)) return { risky: true };
		}
		for (const branch of branches) {
			const safeOutput = getStarExtglobSequenceOutput(branch);
			if (safeOutput) return {
				risky: true,
				safeOutput
			};
			if (repeatedExtglobRecursion(branch) > max) return { risky: true };
		}
		return { risky: false };
	};
	/**
	* Parse the given input string.
	* @param {String} input
	* @param {Object} options
	* @return {Object}
	*/
	const parse = (input, options) => {
		if (typeof input !== "string") throw new TypeError("Expected a string");
		input = REPLACEMENTS[input] || input;
		const opts = { ...options };
		const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
		let len = input.length;
		if (len > max) throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
		const bos = {
			type: "bos",
			value: "",
			output: opts.prepend || ""
		};
		const tokens = [bos];
		const capture = opts.capture ? "" : "?:";
		const PLATFORM_CHARS = constants.globChars(opts.windows);
		const EXTGLOB_CHARS = constants.extglobChars(PLATFORM_CHARS);
		const { DOT_LITERAL, PLUS_LITERAL, SLASH_LITERAL, ONE_CHAR, DOTS_SLASH, NO_DOT, NO_DOT_SLASH, NO_DOTS_SLASH, QMARK, QMARK_NO_DOT, STAR, START_ANCHOR } = PLATFORM_CHARS;
		const globstar = (opts) => {
			return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
		};
		const nodot = opts.dot ? "" : NO_DOT;
		const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
		let star = opts.bash === true ? globstar(opts) : STAR;
		if (opts.capture) star = `(${star})`;
		if (typeof opts.noext === "boolean") opts.noextglob = opts.noext;
		const state = {
			input,
			index: -1,
			start: 0,
			dot: opts.dot === true,
			consumed: "",
			output: "",
			prefix: "",
			backtrack: false,
			negated: false,
			brackets: 0,
			braces: 0,
			parens: 0,
			quotes: 0,
			globstar: false,
			tokens
		};
		input = utils.removePrefix(input, state);
		len = input.length;
		const extglobs = [];
		const braces = [];
		const stack = [];
		let prev = bos;
		let value;
		/**
		* Tokenizing helpers
		*/
		const eos = () => state.index === len - 1;
		const peek = state.peek = (n = 1) => input[state.index + n];
		const advance = state.advance = () => input[++state.index] || "";
		const remaining = () => input.slice(state.index + 1);
		const consume = (value = "", num = 0) => {
			state.consumed += value;
			state.index += num;
		};
		const append = (token) => {
			state.output += token.output != null ? token.output : token.value;
			consume(token.value);
		};
		const negate = () => {
			let count = 1;
			while (peek() === "!" && (peek(2) !== "(" || peek(3) === "?")) {
				advance();
				state.start++;
				count++;
			}
			if (count % 2 === 0) return false;
			state.negated = true;
			state.start++;
			return true;
		};
		const increment = (type) => {
			state[type]++;
			stack.push(type);
		};
		const decrement = (type) => {
			state[type]--;
			stack.pop();
		};
		/**
		* Push tokens onto the tokens array. This helper speeds up
		* tokenizing by 1) helping us avoid backtracking as much as possible,
		* and 2) helping us avoid creating extra tokens when consecutive
		* characters are plain text. This improves performance and simplifies
		* lookbehinds.
		*/
		const push = (tok) => {
			if (prev.type === "globstar") {
				const isBrace = state.braces > 0 && (tok.type === "comma" || tok.type === "brace");
				const isExtglob = tok.extglob === true || extglobs.length && (tok.type === "pipe" || tok.type === "paren");
				if (tok.type !== "slash" && tok.type !== "paren" && !isBrace && !isExtglob) {
					state.output = state.output.slice(0, -prev.output.length);
					prev.type = "star";
					prev.value = "*";
					prev.output = star;
					state.output += prev.output;
				}
			}
			if (extglobs.length && tok.type !== "paren") extglobs[extglobs.length - 1].inner += tok.value;
			if (tok.value || tok.output) append(tok);
			if (prev && prev.type === "text" && tok.type === "text") {
				prev.output = (prev.output || prev.value) + tok.value;
				prev.value += tok.value;
				return;
			}
			tok.prev = prev;
			tokens.push(tok);
			prev = tok;
		};
		const extglobOpen = (type, value) => {
			const token = {
				...EXTGLOB_CHARS[value],
				conditions: 1,
				inner: ""
			};
			token.prev = prev;
			token.parens = state.parens;
			token.output = state.output;
			token.startIndex = state.index;
			token.tokensIndex = tokens.length;
			const output = (opts.capture ? "(" : "") + token.open;
			increment("parens");
			push({
				type,
				value,
				output: state.output ? "" : ONE_CHAR
			});
			push({
				type: "paren",
				extglob: true,
				value: advance(),
				output
			});
			extglobs.push(token);
		};
		const extglobClose = (token) => {
			const literal = input.slice(token.startIndex, state.index + 1);
			const analysis = analyzeRepeatedExtglob(input.slice(token.startIndex + 2, state.index), opts);
			if ((token.type === "plus" || token.type === "star") && analysis.risky) {
				const safeOutput = analysis.safeOutput ? (token.output ? "" : ONE_CHAR) + (opts.capture ? `(${analysis.safeOutput})` : analysis.safeOutput) : void 0;
				const open = tokens[token.tokensIndex];
				open.type = "text";
				open.value = literal;
				open.output = safeOutput || utils.escapeRegex(literal);
				for (let i = token.tokensIndex + 1; i < tokens.length; i++) {
					tokens[i].value = "";
					tokens[i].output = "";
					delete tokens[i].suffix;
				}
				state.output = token.output + open.output;
				state.backtrack = true;
				push({
					type: "paren",
					extglob: true,
					value,
					output: ""
				});
				decrement("parens");
				return;
			}
			let output = token.close + (opts.capture ? ")" : "");
			let rest;
			if (token.type === "negate") {
				let extglobStar = star;
				if (token.inner && token.inner.length > 1 && token.inner.includes("/")) extglobStar = globstar(opts);
				if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) output = token.close = `)$))${extglobStar}`;
				if (token.inner.includes("*") && (rest = remaining()) && /^\.[^\\/.]+$/.test(rest)) output = token.close = `)${parse(rest, {
					...options,
					fastpaths: false
				}).output})${extglobStar})`;
				if (token.prev.type === "bos") state.negatedExtglob = true;
			}
			push({
				type: "paren",
				extglob: true,
				value,
				output
			});
			decrement("parens");
		};
		/**
		* Fast paths
		*/
		if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
			let backslashes = false;
			let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars, first, rest, index) => {
				if (first === "\\") {
					backslashes = true;
					return m;
				}
				if (first === "?") {
					if (esc) return esc + first + (rest ? QMARK.repeat(rest.length) : "");
					if (index === 0) return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : "");
					return QMARK.repeat(chars.length);
				}
				if (first === ".") return DOT_LITERAL.repeat(chars.length);
				if (first === "*") {
					if (esc) return esc + first + (rest ? star : "");
					return star;
				}
				return esc ? m : `\\${m}`;
			});
			if (backslashes === true) if (opts.unescape === true) output = output.replace(/\\/g, "");
			else output = output.replace(/\\+/g, (m) => {
				return m.length % 2 === 0 ? "\\\\" : m ? "\\" : "";
			});
			if (output === input && opts.contains === true) {
				state.output = input;
				return state;
			}
			state.output = utils.wrapOutput(output, state, options);
			return state;
		}
		/**
		* Tokenize input until we reach end-of-string
		*/
		while (!eos()) {
			value = advance();
			if (value === "\0") continue;
			/**
			* Escaped characters
			*/
			if (value === "\\") {
				const next = peek();
				if (next === "/" && opts.bash !== true) continue;
				if (next === "." || next === ";") continue;
				if (!next) {
					value += "\\";
					push({
						type: "text",
						value
					});
					continue;
				}
				const match = /^\\+/.exec(remaining());
				let slashes = 0;
				if (match && match[0].length > 2) {
					slashes = match[0].length;
					state.index += slashes;
					if (slashes % 2 !== 0) value += "\\";
				}
				if (opts.unescape === true) value = advance();
				else value += advance();
				if (state.brackets === 0) {
					push({
						type: "text",
						value
					});
					continue;
				}
			}
			/**
			* If we're inside a regex character class, continue
			* until we reach the closing bracket.
			*/
			if (state.brackets > 0 && (value !== "]" || prev.value === "[" || prev.value === "[^")) {
				if (opts.posix !== false && value === ":") {
					const inner = prev.value.slice(1);
					if (inner.includes("[")) {
						prev.posix = true;
						if (inner.includes(":")) {
							const idx = prev.value.lastIndexOf("[");
							const pre = prev.value.slice(0, idx);
							const posix = POSIX_REGEX_SOURCE[prev.value.slice(idx + 2)];
							if (posix) {
								prev.value = pre + posix;
								state.backtrack = true;
								advance();
								if (!bos.output && tokens.indexOf(prev) === 1) bos.output = ONE_CHAR;
								continue;
							}
						}
					}
				}
				if (value === "[" && peek() !== ":" || value === "-" && peek() === "]") value = `\\${value}`;
				if (value === "]" && (prev.value === "[" || prev.value === "[^")) value = `\\${value}`;
				if (opts.posix === true && value === "!" && prev.value === "[") value = "^";
				prev.value += value;
				append({ value });
				continue;
			}
			/**
			* If we're inside a quoted string, continue
			* until we reach the closing double quote.
			*/
			if (state.quotes === 1 && value !== "\"") {
				value = utils.escapeRegex(value);
				prev.value += value;
				append({ value });
				continue;
			}
			/**
			* Double quotes
			*/
			if (value === "\"") {
				state.quotes = state.quotes === 1 ? 0 : 1;
				if (opts.keepQuotes === true) push({
					type: "text",
					value
				});
				continue;
			}
			/**
			* Parentheses
			*/
			if (value === "(") {
				increment("parens");
				push({
					type: "paren",
					value
				});
				continue;
			}
			if (value === ")") {
				if (state.parens === 0 && opts.strictBrackets === true) throw new SyntaxError(syntaxError("opening", "("));
				const extglob = extglobs[extglobs.length - 1];
				if (extglob && state.parens === extglob.parens + 1) {
					extglobClose(extglobs.pop());
					continue;
				}
				push({
					type: "paren",
					value,
					output: state.parens ? ")" : "\\)"
				});
				decrement("parens");
				continue;
			}
			/**
			* Square brackets
			*/
			if (value === "[") {
				if (opts.nobracket === true || !remaining().includes("]")) {
					if (opts.nobracket !== true && opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "]"));
					value = `\\${value}`;
				} else increment("brackets");
				push({
					type: "bracket",
					value
				});
				continue;
			}
			if (value === "]") {
				if (opts.nobracket === true || prev && prev.type === "bracket" && prev.value.length === 1) {
					push({
						type: "text",
						value,
						output: `\\${value}`
					});
					continue;
				}
				if (state.brackets === 0) {
					if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("opening", "["));
					push({
						type: "text",
						value,
						output: `\\${value}`
					});
					continue;
				}
				decrement("brackets");
				const prevValue = prev.value.slice(1);
				if (prev.posix !== true && prevValue[0] === "^" && !prevValue.includes("/")) value = `/${value}`;
				prev.value += value;
				append({ value });
				if (opts.literalBrackets === false || utils.hasRegexChars(prevValue)) continue;
				const escaped = utils.escapeRegex(prev.value);
				state.output = state.output.slice(0, -prev.value.length);
				if (opts.literalBrackets === true) {
					state.output += escaped;
					prev.value = escaped;
					continue;
				}
				prev.value = `(${capture}${escaped}|${prev.value})`;
				state.output += prev.value;
				continue;
			}
			/**
			* Braces
			*/
			if (value === "{" && opts.nobrace !== true) {
				increment("braces");
				const open = {
					type: "brace",
					value,
					output: "(",
					outputIndex: state.output.length,
					tokensIndex: state.tokens.length
				};
				braces.push(open);
				push(open);
				continue;
			}
			if (value === "}") {
				const brace = braces[braces.length - 1];
				if (opts.nobrace === true || !brace) {
					push({
						type: "text",
						value,
						output: value
					});
					continue;
				}
				let output = ")";
				if (brace.dots === true) {
					const arr = tokens.slice();
					const range = [];
					for (let i = arr.length - 1; i >= 0; i--) {
						tokens.pop();
						if (arr[i].type === "brace") break;
						if (arr[i].type !== "dots") range.unshift(arr[i].value);
					}
					output = expandRange(range, opts);
					state.backtrack = true;
				}
				if (brace.comma !== true && brace.dots !== true) {
					const out = state.output.slice(0, brace.outputIndex);
					const toks = state.tokens.slice(brace.tokensIndex);
					brace.value = brace.output = "\\{";
					value = output = "\\}";
					state.output = out;
					for (const t of toks) state.output += t.output || t.value;
				}
				push({
					type: "brace",
					value,
					output
				});
				decrement("braces");
				braces.pop();
				continue;
			}
			/**
			* Pipes
			*/
			if (value === "|") {
				if (extglobs.length > 0) extglobs[extglobs.length - 1].conditions++;
				push({
					type: "text",
					value
				});
				continue;
			}
			/**
			* Commas
			*/
			if (value === ",") {
				let output = value;
				const brace = braces[braces.length - 1];
				if (brace && stack[stack.length - 1] === "braces") {
					brace.comma = true;
					output = "|";
				}
				push({
					type: "comma",
					value,
					output
				});
				continue;
			}
			/**
			* Slashes
			*/
			if (value === "/") {
				if (prev.type === "dot" && state.index === state.start + 1) {
					state.start = state.index + 1;
					state.consumed = "";
					state.output = "";
					tokens.pop();
					prev = bos;
					continue;
				}
				push({
					type: "slash",
					value,
					output: SLASH_LITERAL
				});
				continue;
			}
			/**
			* Dots
			*/
			if (value === ".") {
				if (state.braces > 0 && prev.type === "dot") {
					if (prev.value === ".") prev.output = DOT_LITERAL;
					const brace = braces[braces.length - 1];
					prev.type = "dots";
					prev.output += value;
					prev.value += value;
					brace.dots = true;
					continue;
				}
				if (state.braces + state.parens === 0 && prev.type !== "bos" && prev.type !== "slash") {
					push({
						type: "text",
						value,
						output: DOT_LITERAL
					});
					continue;
				}
				push({
					type: "dot",
					value,
					output: DOT_LITERAL
				});
				continue;
			}
			/**
			* Question marks
			*/
			if (value === "?") {
				if (!(prev && prev.value === "(") && opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
					extglobOpen("qmark", value);
					continue;
				}
				if (prev && prev.type === "paren") {
					const next = peek();
					let output = value;
					if (prev.value === "(" && !/[!=<:]/.test(next) || next === "<" && !/<([!=]|\w+>)/.test(remaining())) output = `\\${value}`;
					push({
						type: "text",
						value,
						output
					});
					continue;
				}
				if (opts.dot !== true && (prev.type === "slash" || prev.type === "bos")) {
					push({
						type: "qmark",
						value,
						output: QMARK_NO_DOT
					});
					continue;
				}
				push({
					type: "qmark",
					value,
					output: QMARK
				});
				continue;
			}
			/**
			* Exclamation
			*/
			if (value === "!") {
				if (opts.noextglob !== true && peek() === "(") {
					if (peek(2) !== "?" || !/[!=<:]/.test(peek(3))) {
						extglobOpen("negate", value);
						continue;
					}
				}
				if (opts.nonegate !== true && state.index === 0) {
					negate();
					continue;
				}
			}
			/**
			* Plus
			*/
			if (value === "+") {
				if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
					extglobOpen("plus", value);
					continue;
				}
				if (prev && prev.value === "(" || opts.regex === false) {
					push({
						type: "plus",
						value,
						output: PLUS_LITERAL
					});
					continue;
				}
				if (prev && (prev.type === "bracket" || prev.type === "paren" || prev.type === "brace") || state.parens > 0) {
					push({
						type: "plus",
						value
					});
					continue;
				}
				push({
					type: "plus",
					value: PLUS_LITERAL
				});
				continue;
			}
			/**
			* Plain text
			*/
			if (value === "@") {
				if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
					push({
						type: "at",
						extglob: true,
						value,
						output: ""
					});
					continue;
				}
				push({
					type: "text",
					value
				});
				continue;
			}
			/**
			* Plain text
			*/
			if (value !== "*") {
				if (value === "$" || value === "^") value = `\\${value}`;
				const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
				if (match) {
					value += match[0];
					state.index += match[0].length;
				}
				push({
					type: "text",
					value
				});
				continue;
			}
			/**
			* Stars
			*/
			if (prev && (prev.type === "globstar" || prev.star === true)) {
				prev.type = "star";
				prev.star = true;
				prev.value += value;
				prev.output = star;
				state.backtrack = true;
				state.globstar = true;
				consume(value);
				continue;
			}
			let rest = remaining();
			if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
				extglobOpen("star", value);
				continue;
			}
			if (prev.type === "star") {
				if (opts.noglobstar === true) {
					consume(value);
					continue;
				}
				const prior = prev.prev;
				const before = prior.prev;
				const isStart = prior.type === "slash" || prior.type === "bos";
				const afterStar = before && (before.type === "star" || before.type === "globstar");
				if (opts.bash === true && (!isStart || rest[0] && rest[0] !== "/")) {
					push({
						type: "star",
						value,
						output: ""
					});
					continue;
				}
				const isBrace = state.braces > 0 && (prior.type === "comma" || prior.type === "brace");
				const isExtglob = extglobs.length && (prior.type === "pipe" || prior.type === "paren");
				if (!isStart && prior.type !== "paren" && !isBrace && !isExtglob) {
					push({
						type: "star",
						value,
						output: ""
					});
					continue;
				}
				while (rest.slice(0, 3) === "/**") {
					const after = input[state.index + 4];
					if (after && after !== "/") break;
					rest = rest.slice(3);
					consume("/**", 3);
				}
				if (prior.type === "bos" && eos()) {
					prev.type = "globstar";
					prev.value += value;
					prev.output = globstar(opts);
					state.output = prev.output;
					state.globstar = true;
					consume(value);
					continue;
				}
				if (prior.type === "slash" && prior.prev.type !== "bos" && !afterStar && eos()) {
					state.output = state.output.slice(0, -(prior.output + prev.output).length);
					prior.output = `(?:${prior.output}`;
					prev.type = "globstar";
					prev.output = globstar(opts) + (opts.strictSlashes ? ")" : "|$)");
					prev.value += value;
					state.globstar = true;
					state.output += prior.output + prev.output;
					consume(value);
					continue;
				}
				if (prior.type === "slash" && prior.prev.type !== "bos" && rest[0] === "/") {
					const end = rest[1] !== void 0 ? "|$" : "";
					state.output = state.output.slice(0, -(prior.output + prev.output).length);
					prior.output = `(?:${prior.output}`;
					prev.type = "globstar";
					prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
					prev.value += value;
					state.output += prior.output + prev.output;
					state.globstar = true;
					consume(value + advance());
					push({
						type: "slash",
						value: "/",
						output: ""
					});
					continue;
				}
				if (prior.type === "bos" && rest[0] === "/") {
					prev.type = "globstar";
					prev.value += value;
					prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
					state.output = prev.output;
					state.globstar = true;
					consume(value + advance());
					push({
						type: "slash",
						value: "/",
						output: ""
					});
					continue;
				}
				state.output = state.output.slice(0, -prev.output.length);
				prev.type = "globstar";
				prev.output = globstar(opts);
				prev.value += value;
				state.output += prev.output;
				state.globstar = true;
				consume(value);
				continue;
			}
			const token = {
				type: "star",
				value,
				output: star
			};
			if (opts.bash === true) {
				token.output = ".*?";
				if (prev.type === "bos" || prev.type === "slash") token.output = nodot + token.output;
				push(token);
				continue;
			}
			if (prev && (prev.type === "bracket" || prev.type === "paren") && opts.regex === true) {
				token.output = value;
				push(token);
				continue;
			}
			if (state.index === state.start || prev.type === "slash" || prev.type === "dot") {
				if (prev.type === "dot") {
					state.output += NO_DOT_SLASH;
					prev.output += NO_DOT_SLASH;
				} else if (opts.dot === true) {
					state.output += NO_DOTS_SLASH;
					prev.output += NO_DOTS_SLASH;
				} else {
					state.output += nodot;
					prev.output += nodot;
				}
				if (peek() !== "*") {
					state.output += ONE_CHAR;
					prev.output += ONE_CHAR;
				}
			}
			push(token);
		}
		while (state.brackets > 0) {
			if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "]"));
			state.output = utils.escapeLast(state.output, "[");
			decrement("brackets");
		}
		while (state.parens > 0) {
			if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", ")"));
			state.output = utils.escapeLast(state.output, "(");
			decrement("parens");
		}
		while (state.braces > 0) {
			if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "}"));
			state.output = utils.escapeLast(state.output, "{");
			decrement("braces");
		}
		if (opts.strictSlashes !== true && (prev.type === "star" || prev.type === "bracket")) push({
			type: "maybe_slash",
			value: "",
			output: `${SLASH_LITERAL}?`
		});
		if (state.backtrack === true) {
			state.output = "";
			for (const token of state.tokens) {
				state.output += token.output != null ? token.output : token.value;
				if (token.suffix) state.output += token.suffix;
			}
		}
		return state;
	};
	/**
	* Fast paths for creating regular expressions for common glob patterns.
	* This can significantly speed up processing and has very little downside
	* impact when none of the fast paths match.
	*/
	parse.fastpaths = (input, options) => {
		const opts = { ...options };
		const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
		const len = input.length;
		if (len > max) throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
		input = REPLACEMENTS[input] || input;
		const { DOT_LITERAL, SLASH_LITERAL, ONE_CHAR, DOTS_SLASH, NO_DOT, NO_DOTS, NO_DOTS_SLASH, STAR, START_ANCHOR } = constants.globChars(opts.windows);
		const nodot = opts.dot ? NO_DOTS : NO_DOT;
		const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
		const capture = opts.capture ? "" : "?:";
		const state = {
			negated: false,
			prefix: ""
		};
		let star = opts.bash === true ? ".*?" : STAR;
		if (opts.capture) star = `(${star})`;
		const globstar = (opts) => {
			if (opts.noglobstar === true) return star;
			return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
		};
		const create = (str) => {
			switch (str) {
				case "*": return `${nodot}${ONE_CHAR}${star}`;
				case ".*": return `${DOT_LITERAL}${ONE_CHAR}${star}`;
				case "*.*": return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
				case "*/*": return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;
				case "**": return nodot + globstar(opts);
				case "**/*": return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;
				case "**/*.*": return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
				case "**/.*": return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;
				default: {
					const match = /^(.*?)\.(\w+)$/.exec(str);
					if (!match) return;
					const source = create(match[1]);
					if (!source) return;
					return source + DOT_LITERAL + match[2];
				}
			}
		};
		let source = create(utils.removePrefix(input, state));
		if (source && opts.strictSlashes !== true) source += `${SLASH_LITERAL}?`;
		return source;
	};
	module.exports = parse;
}));

//#endregion
//#region ../../node_modules/.pnpm/picomatch@4.0.4/node_modules/picomatch/lib/picomatch.js
var require_picomatch$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const scan = require_scan();
	const parse = require_parse();
	const utils = require_utils();
	const constants = require_constants();
	const isObject = (val) => val && typeof val === "object" && !Array.isArray(val);
	/**
	* Creates a matcher function from one or more glob patterns. The
	* returned function takes a string to match as its first argument,
	* and returns true if the string is a match. The returned matcher
	* function also takes a boolean as the second argument that, when true,
	* returns an object with additional information.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch(glob[, options]);
	*
	* const isMatch = picomatch('*.!(*a)');
	* console.log(isMatch('a.a')); //=> false
	* console.log(isMatch('a.b')); //=> true
	* ```
	* @name picomatch
	* @param {String|Array} `globs` One or more glob patterns.
	* @param {Object=} `options`
	* @return {Function=} Returns a matcher function.
	* @api public
	*/
	const picomatch = (glob, options, returnState = false) => {
		if (Array.isArray(glob)) {
			const fns = glob.map((input) => picomatch(input, options, returnState));
			const arrayMatcher = (str) => {
				for (const isMatch of fns) {
					const state = isMatch(str);
					if (state) return state;
				}
				return false;
			};
			return arrayMatcher;
		}
		const isState = isObject(glob) && glob.tokens && glob.input;
		if (glob === "" || typeof glob !== "string" && !isState) throw new TypeError("Expected pattern to be a non-empty string");
		const opts = options || {};
		const posix = opts.windows;
		const regex = isState ? picomatch.compileRe(glob, options) : picomatch.makeRe(glob, options, false, true);
		const state = regex.state;
		delete regex.state;
		let isIgnored = () => false;
		if (opts.ignore) {
			const ignoreOpts = {
				...options,
				ignore: null,
				onMatch: null,
				onResult: null
			};
			isIgnored = picomatch(opts.ignore, ignoreOpts, returnState);
		}
		const matcher = (input, returnObject = false) => {
			const { isMatch, match, output } = picomatch.test(input, regex, options, {
				glob,
				posix
			});
			const result = {
				glob,
				state,
				regex,
				posix,
				input,
				output,
				match,
				isMatch
			};
			if (typeof opts.onResult === "function") opts.onResult(result);
			if (isMatch === false) {
				result.isMatch = false;
				return returnObject ? result : false;
			}
			if (isIgnored(input)) {
				if (typeof opts.onIgnore === "function") opts.onIgnore(result);
				result.isMatch = false;
				return returnObject ? result : false;
			}
			if (typeof opts.onMatch === "function") opts.onMatch(result);
			return returnObject ? result : true;
		};
		if (returnState) matcher.state = state;
		return matcher;
	};
	/**
	* Test `input` with the given `regex`. This is used by the main
	* `picomatch()` function to test the input string.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.test(input, regex[, options]);
	*
	* console.log(picomatch.test('foo/bar', /^(?:([^/]*?)\/([^/]*?))$/));
	* // { isMatch: true, match: [ 'foo/', 'foo', 'bar' ], output: 'foo/bar' }
	* ```
	* @param {String} `input` String to test.
	* @param {RegExp} `regex`
	* @return {Object} Returns an object with matching info.
	* @api public
	*/
	picomatch.test = (input, regex, options, { glob, posix } = {}) => {
		if (typeof input !== "string") throw new TypeError("Expected input to be a string");
		if (input === "") return {
			isMatch: false,
			output: ""
		};
		const opts = options || {};
		const format = opts.format || (posix ? utils.toPosixSlashes : null);
		let match = input === glob;
		let output = match && format ? format(input) : input;
		if (match === false) {
			output = format ? format(input) : input;
			match = output === glob;
		}
		if (match === false || opts.capture === true) if (opts.matchBase === true || opts.basename === true) match = picomatch.matchBase(input, regex, options, posix);
		else match = regex.exec(output);
		return {
			isMatch: Boolean(match),
			match,
			output
		};
	};
	/**
	* Match the basename of a filepath.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.matchBase(input, glob[, options]);
	* console.log(picomatch.matchBase('foo/bar.js', '*.js'); // true
	* ```
	* @param {String} `input` String to test.
	* @param {RegExp|String} `glob` Glob pattern or regex created by [.makeRe](#makeRe).
	* @return {Boolean}
	* @api public
	*/
	picomatch.matchBase = (input, glob, options) => {
		return (glob instanceof RegExp ? glob : picomatch.makeRe(glob, options)).test(utils.basename(input));
	};
	/**
	* Returns true if **any** of the given glob `patterns` match the specified `string`.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.isMatch(string, patterns[, options]);
	*
	* console.log(picomatch.isMatch('a.a', ['b.*', '*.a'])); //=> true
	* console.log(picomatch.isMatch('a.a', 'b.*')); //=> false
	* ```
	* @param {String|Array} str The string to test.
	* @param {String|Array} patterns One or more glob patterns to use for matching.
	* @param {Object} [options] See available [options](#options).
	* @return {Boolean} Returns true if any patterns match `str`
	* @api public
	*/
	picomatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);
	/**
	* Parse a glob pattern to create the source string for a regular
	* expression.
	*
	* ```js
	* const picomatch = require('picomatch');
	* const result = picomatch.parse(pattern[, options]);
	* ```
	* @param {String} `pattern`
	* @param {Object} `options`
	* @return {Object} Returns an object with useful properties and output to be used as a regex source string.
	* @api public
	*/
	picomatch.parse = (pattern, options) => {
		if (Array.isArray(pattern)) return pattern.map((p) => picomatch.parse(p, options));
		return parse(pattern, {
			...options,
			fastpaths: false
		});
	};
	/**
	* Scan a glob pattern to separate the pattern into segments.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.scan(input[, options]);
	*
	* const result = picomatch.scan('!./foo/*.js');
	* console.log(result);
	* { prefix: '!./',
	*   input: '!./foo/*.js',
	*   start: 3,
	*   base: 'foo',
	*   glob: '*.js',
	*   isBrace: false,
	*   isBracket: false,
	*   isGlob: true,
	*   isExtglob: false,
	*   isGlobstar: false,
	*   negated: true }
	* ```
	* @param {String} `input` Glob pattern to scan.
	* @param {Object} `options`
	* @return {Object} Returns an object with
	* @api public
	*/
	picomatch.scan = (input, options) => scan(input, options);
	/**
	* Compile a regular expression from the `state` object returned by the
	* [parse()](#parse) method.
	*
	* ```js
	* const picomatch = require('picomatch');
	* const state = picomatch.parse('*.js');
	* // picomatch.compileRe(state[, options]);
	*
	* console.log(picomatch.compileRe(state));
	* //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
	* ```
	* @param {Object} `state`
	* @param {Object} `options`
	* @param {Boolean} `returnOutput` Intended for implementors, this argument allows you to return the raw output from the parser.
	* @param {Boolean} `returnState` Adds the state to a `state` property on the returned regex. Useful for implementors and debugging.
	* @return {RegExp}
	* @api public
	*/
	picomatch.compileRe = (state, options, returnOutput = false, returnState = false) => {
		if (returnOutput === true) return state.output;
		const opts = options || {};
		const prepend = opts.contains ? "" : "^";
		const append = opts.contains ? "" : "$";
		let source = `${prepend}(?:${state.output})${append}`;
		if (state && state.negated === true) source = `^(?!${source}).*$`;
		const regex = picomatch.toRegex(source, options);
		if (returnState === true) regex.state = state;
		return regex;
	};
	/**
	* Create a regular expression from a parsed glob pattern.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.makeRe(state[, options]);
	*
	* const result = picomatch.makeRe('*.js');
	* console.log(result);
	* //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
	* ```
	* @param {String} `state` The object returned from the `.parse` method.
	* @param {Object} `options`
	* @param {Boolean} `returnOutput` Implementors may use this argument to return the compiled output, instead of a regular expression. This is not exposed on the options to prevent end-users from mutating the result.
	* @param {Boolean} `returnState` Implementors may use this argument to return the state from the parsed glob with the returned regular expression.
	* @return {RegExp} Returns a regex created from the given pattern.
	* @api public
	*/
	picomatch.makeRe = (input, options = {}, returnOutput = false, returnState = false) => {
		if (!input || typeof input !== "string") throw new TypeError("Expected a non-empty string");
		let parsed = {
			negated: false,
			fastpaths: true
		};
		if (options.fastpaths !== false && (input[0] === "." || input[0] === "*")) parsed.output = parse.fastpaths(input, options);
		if (!parsed.output) parsed = parse(input, options);
		return picomatch.compileRe(parsed, options, returnOutput, returnState);
	};
	/**
	* Create a regular expression from the given regex source string.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.toRegex(source[, options]);
	*
	* const { output } = picomatch.parse('*.js');
	* console.log(picomatch.toRegex(output));
	* //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
	* ```
	* @param {String} `source` Regular expression source string.
	* @param {Object} `options`
	* @return {RegExp}
	* @api public
	*/
	picomatch.toRegex = (source, options) => {
		try {
			const opts = options || {};
			return new RegExp(source, opts.flags || (opts.nocase ? "i" : ""));
		} catch (err) {
			if (options && options.debug === true) throw err;
			return /$^/;
		}
	};
	/**
	* Picomatch constants.
	* @return {Object}
	*/
	picomatch.constants = constants;
	/**
	* Expose "picomatch"
	*/
	module.exports = picomatch;
}));

//#endregion
//#region ../../node_modules/.pnpm/picomatch@4.0.4/node_modules/picomatch/index.js
var require_picomatch = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const pico = require_picomatch$1();
	const utils = require_utils();
	function picomatch(glob, options, returnState = false) {
		if (options && (options.windows === null || options.windows === void 0)) options = {
			...options,
			windows: utils.isWindows()
		};
		return pico(glob, options, returnState);
	}
	Object.assign(picomatch, pico);
	module.exports = picomatch;
}));

//#endregion
//#region ../../node_modules/.pnpm/tinyglobby@0.2.17/node_modules/tinyglobby/dist/index.mjs
var import_picomatch = /* @__PURE__ */ __toESM(require_picomatch(), 1);
const isReadonlyArray = Array.isArray;
const BACKSLASHES = /\\/g;
const DRIVE_RELATIVE_PATH = /^[A-Za-z]:$/;
const isWin = process.platform === "win32";
const ONLY_PARENT_DIRECTORIES = /^(\/?\.\.)+$/;
function getPartialMatcher(patterns, options = {}) {
	const patternsCount = patterns.length;
	const patternsParts = Array(patternsCount);
	const matchers = Array(patternsCount);
	let i, j;
	for (i = 0; i < patternsCount; i++) {
		const parts = splitPattern(patterns[i]);
		patternsParts[i] = parts;
		const partsCount = parts.length;
		const partMatchers = Array(partsCount);
		for (j = 0; j < partsCount; j++) partMatchers[j] = (0, import_picomatch.default)(parts[j], options);
		matchers[i] = partMatchers;
	}
	return (input) => {
		const inputParts = input.split("/");
		if (inputParts[0] === ".." && ONLY_PARENT_DIRECTORIES.test(input)) return true;
		for (i = 0; i < patternsCount; i++) {
			const patternParts = patternsParts[i];
			const matcher = matchers[i];
			const inputPatternCount = inputParts.length;
			const minParts = Math.min(inputPatternCount, patternParts.length);
			j = 0;
			while (j < minParts) {
				const part = patternParts[j];
				if (part.includes("/")) return true;
				if (!matcher[j](inputParts[j])) break;
				if (!options.noglobstar && part === "**") return true;
				j++;
			}
			if (j === inputPatternCount) return true;
		}
		return false;
	};
}
/* node:coverage ignore next 2 */
const WIN32_ROOT_DIR = /^[A-Z]:\/$/i;
const isRoot = isWin ? (p) => WIN32_ROOT_DIR.test(p) : (p) => p === "/";
function buildFormat(cwd, root, absolute) {
	if (cwd === root || root.startsWith(`${cwd}/`)) {
		if (absolute) {
			const start = cwd.length + +!isRoot(cwd);
			return (p, isDir) => p.slice(start, isDir ? -1 : void 0) || ".";
		}
		const prefix = root.slice(cwd.length + 1);
		if (prefix) return (p, isDir) => {
			if (p === ".") return prefix;
			const result = `${prefix}/${p}`;
			return isDir ? result.slice(0, -1) : result;
		};
		return (p, isDir) => isDir && p !== "." ? p.slice(0, -1) : p;
	}
	if (absolute) return (p) => posix.relative(cwd, p) || ".";
	return (p) => posix.relative(cwd, `${root}/${p}`) || ".";
}
function buildRelative(cwd, root) {
	if (root.startsWith(`${cwd}/`)) {
		const prefix = root.slice(cwd.length + 1);
		return (p) => `${prefix}/${p}`;
	}
	return (p) => {
		const result = posix.relative(cwd, `${root}/${p}`);
		return p[p.length - 1] === "/" && result !== "" ? `${result}/` : result || ".";
	};
}
function ensureNonDriveRelativePath(path) {
	return path.replace(DRIVE_RELATIVE_PATH, (match) => `${match}/`);
}
const splitPatternOptions = { parts: true };
function splitPattern(path) {
	var _result$parts;
	const result = import_picomatch.default.scan(path, splitPatternOptions);
	return ((_result$parts = result.parts) === null || _result$parts === void 0 ? void 0 : _result$parts.length) ? result.parts : [path];
}
const POSIX_UNESCAPED_GLOB_SYMBOLS = /(?<!\\)([()[\]{}*?|]|^!|[!+@](?=\()|\\(?![()[\]{}!*+?@|]))/g;
const WIN32_UNESCAPED_GLOB_SYMBOLS = /(?<!\\)([()[\]{}]|^!|[!+@](?=\())/g;
const escapePosixPath = (path) => path.replace(POSIX_UNESCAPED_GLOB_SYMBOLS, "\\$&");
const escapeWin32Path = (path) => path.replace(WIN32_UNESCAPED_GLOB_SYMBOLS, "\\$&");
/**
* Escapes a path's special characters depending on the platform.
* @see {@link https://superchupu.dev/tinyglobby/documentation#escapePath}
*/
/* node:coverage ignore next */
const escapePath = isWin ? escapeWin32Path : escapePosixPath;
/**
* Checks if a pattern has dynamic parts.
*
* Has a few minor differences with [`fast-glob`](https://github.com/mrmlnc/fast-glob) for better accuracy:
*
* - Doesn't necessarily return `false` on patterns that include `\`.
* - Returns `true` if the pattern includes parentheses, regardless of them representing one single pattern or not.
* - Returns `true` for unfinished glob extensions i.e. `(h`, `+(h`.
* - Returns `true` for unfinished brace expansions as long as they include `,` or `..`.
*
* @see {@link https://superchupu.dev/tinyglobby/documentation#isDynamicPattern}
*/
function isDynamicPattern(pattern, options) {
	if ((options === null || options === void 0 ? void 0 : options.caseSensitiveMatch) === false) return true;
	const scan = import_picomatch.default.scan(pattern);
	return scan.isGlob || scan.negated;
}
function log(...tasks) {
	console.log(`[tinyglobby ${(/* @__PURE__ */ new Date()).toLocaleTimeString("es")}]`, ...tasks);
}
function ensureStringArray(value) {
	return typeof value === "string" ? [value] : value !== null && value !== void 0 ? value : [];
}
const PARENT_DIRECTORY = /^(\/?\.\.)+/;
const ESCAPING_BACKSLASHES = /\\(?=[()[\]{}!*+?@|])/g;
function normalizePattern(pattern, opts, props, isIgnore) {
	var _PARENT_DIRECTORY$exe;
	const cwd = opts.cwd;
	let result = pattern;
	if (pattern[pattern.length - 1] === "/") result = pattern.slice(0, -1);
	if (result[result.length - 1] !== "*" && opts.expandDirectories) result += "/**";
	const escapedCwd = escapePath(cwd);
	result = isAbsolute(result.replace(ESCAPING_BACKSLASHES, "")) ? posix.relative(escapedCwd, result) : posix.normalize(result);
	const parentDir = (_PARENT_DIRECTORY$exe = PARENT_DIRECTORY.exec(result)) === null || _PARENT_DIRECTORY$exe === void 0 ? void 0 : _PARENT_DIRECTORY$exe[0];
	const parts = splitPattern(result);
	if (parentDir) {
		const n = (parentDir.length + 1) / 3;
		let i = 0;
		const cwdParts = escapedCwd.split("/");
		while (i < n && parts[i + n] === cwdParts[cwdParts.length + i - n]) {
			result = result.slice(0, (n - i - 1) * 3) + result.slice((n - i) * 3 + parts[i + n].length + 1) || ".";
			i++;
		}
		const potentialRoot = posix.join(cwd, parentDir.slice(i * 3));
		if (potentialRoot[0] !== "." && props.root.length > potentialRoot.length) {
			props.root = ensureNonDriveRelativePath(potentialRoot);
			props.depthOffset = -n + i;
		}
	}
	if (!isIgnore && props.depthOffset >= 0) {
		var _props$commonPath;
		(_props$commonPath = props.commonPath) !== null && _props$commonPath !== void 0 || (props.commonPath = parts);
		const newCommonPath = [];
		const length = Math.min(props.commonPath.length, parts.length);
		for (let i = 0; i < length; i++) {
			const part = parts[i];
			if (part === "**" && !parts[i + 1]) {
				newCommonPath.pop();
				break;
			}
			if (i === parts.length - 1 || part !== props.commonPath[i] || isDynamicPattern(part)) break;
			newCommonPath.push(part);
		}
		props.depthOffset = newCommonPath.length;
		props.commonPath = newCommonPath;
		props.root = ensureNonDriveRelativePath(newCommonPath.length > 0 ? posix.join(cwd, ...newCommonPath) : cwd);
	}
	return result;
}
function processPatterns(options, patterns, props) {
	const matchPatterns = [];
	const ignorePatterns = [];
	for (const pattern of options.ignore) {
		if (!pattern) continue;
		if (pattern[0] !== "!" || pattern[1] === "(") ignorePatterns.push(normalizePattern(pattern, options, props, true));
	}
	for (const pattern of patterns) {
		if (!pattern) continue;
		if (pattern[0] !== "!" || pattern[1] === "(") matchPatterns.push(normalizePattern(pattern, options, props, false));
		else if (pattern[1] !== "!" || pattern[2] === "(") ignorePatterns.push(normalizePattern(pattern.slice(1), options, props, true));
	}
	return {
		match: matchPatterns,
		ignore: ignorePatterns
	};
}
function buildCrawler(options, patterns) {
	const cwd = options.cwd;
	const props = {
		root: cwd,
		depthOffset: 0
	};
	const processed = processPatterns(options, patterns, props);
	if (options.debug) log("internal processing patterns:", processed);
	const { absolute, caseSensitiveMatch, debug, dot, followSymbolicLinks, onlyDirectories } = options;
	const root = props.root.replace(BACKSLASHES, "");
	const matchOptions = {
		dot,
		nobrace: options.braceExpansion === false,
		nocase: !caseSensitiveMatch,
		noextglob: options.extglob === false,
		noglobstar: options.globstar === false,
		posix: true
	};
	const matcher = (0, import_picomatch.default)(processed.match, matchOptions);
	const ignore = (0, import_picomatch.default)(processed.ignore, matchOptions);
	const partialMatcher = getPartialMatcher(processed.match, matchOptions);
	const format = buildFormat(cwd, root, absolute);
	const excludeFormatter = absolute ? format : buildFormat(cwd, root, true);
	const excludePredicate = (_, p) => {
		const relativePath = excludeFormatter(p, true);
		return relativePath !== "." && !partialMatcher(relativePath) || ignore(relativePath);
	};
	let maxDepth;
	if (options.deep !== void 0) maxDepth = Math.round(options.deep - props.depthOffset);
	const crawler = new Builder({
		filters: [debug ? (p, isDirectory) => {
			const path = format(p, isDirectory);
			const matches = matcher(path) && !ignore(path);
			if (matches) log(`matched ${path}`);
			return matches;
		} : (p, isDirectory) => {
			const path = format(p, isDirectory);
			return matcher(path) && !ignore(path);
		}],
		exclude: debug ? (_, p) => {
			const skipped = excludePredicate(_, p);
			log(`${skipped ? "skipped" : "crawling"} ${p}`);
			return skipped;
		} : excludePredicate,
		fs: options.fs,
		pathSeparator: "/",
		relativePaths: !absolute,
		resolvePaths: absolute,
		includeBasePath: absolute,
		resolveSymlinks: followSymbolicLinks,
		excludeSymlinks: !followSymbolicLinks,
		excludeFiles: onlyDirectories,
		includeDirs: onlyDirectories || !options.onlyFiles,
		maxDepth,
		signal: options.signal
	}).crawl(root);
	if (options.debug) log("internal properties:", {
		...props,
		root
	});
	return [crawler, cwd !== root && !absolute && buildRelative(cwd, root)];
}
function formatPaths(paths, mapper) {
	if (mapper) for (let i = paths.length - 1; i >= 0; i--) paths[i] = mapper(paths[i]);
	return paths;
}
const defaultOptions = {
	caseSensitiveMatch: true,
	debug: !!process.env.TINYGLOBBY_DEBUG,
	expandDirectories: true,
	followSymbolicLinks: true,
	onlyFiles: true
};
function getOptions(options) {
	const opts = Object.assign({}, options);
	for (const key in defaultOptions) if (opts[key] === void 0) Object.assign(opts, { [key]: defaultOptions[key] });
	opts.cwd = (opts.cwd instanceof URL ? fileURLToPath(opts.cwd) : resolve$1(opts.cwd || process.cwd())).replace(BACKSLASHES, "/");
	opts.ignore = ensureStringArray(opts.ignore);
	opts.fs && (opts.fs = {
		readdir: opts.fs.readdir || readdir,
		readdirSync: opts.fs.readdirSync || readdirSync,
		realpath: opts.fs.realpath || realpath,
		realpathSync: opts.fs.realpathSync || realpathSync,
		stat: opts.fs.stat || stat,
		statSync: opts.fs.statSync || statSync
	});
	if (opts.debug) log("globbing with options:", opts);
	return opts;
}
function getCrawler(globInput, inputOptions = {}) {
	var _ref;
	if (globInput && (inputOptions === null || inputOptions === void 0 ? void 0 : inputOptions.patterns)) throw new Error("Cannot pass patterns as both an argument and an option");
	const isModern = isReadonlyArray(globInput) || typeof globInput === "string";
	const patterns = ensureStringArray((_ref = isModern ? globInput : globInput.patterns) !== null && _ref !== void 0 ? _ref : "**/*");
	const options = getOptions(isModern ? inputOptions : globInput);
	return patterns.length > 0 ? buildCrawler(options, patterns) : [];
}
async function glob(globInput, options) {
	const [crawler, relative] = getCrawler(globInput, options);
	return crawler ? formatPaths(await crawler.withPromise(), relative) : [];
}

//#endregion
//#region src/cli/constants.ts
const TARGET_PACKAGE = "cnfast";
const MIGRATABLE_SOURCES = [
	"clsx",
	"classnames",
	"tailwind-merge"
];
const DEFAULT_EXPORT_NAME = {
	clsx: "clsx",
	classnames: "clsx",
	"tailwind-merge": "twMerge"
};
const SOURCE_FILE_GLOBS = ["**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}"];
const IGNORED_GLOBS = [
	"**/node_modules/**",
	"**/dist/**",
	"**/build/**",
	"**/out/**",
	"**/.next/**",
	"**/.turbo/**",
	"**/.git/**",
	"**/coverage/**"
];

//#endregion
//#region src/cli/utils/find-source-files.ts
const findSourceFiles = (cwd) => glob(SOURCE_FILE_GLOBS, {
	cwd,
	ignore: IGNORED_GLOBS,
	absolute: true,
	dot: false
});

//#endregion
//#region src/cli/utils/highlighter.ts
const highlighter = {
	error: import_picocolors.default.red,
	warn: import_picocolors.default.yellow,
	info: import_picocolors.default.cyan,
	success: import_picocolors.default.green,
	dim: import_picocolors.default.dim
};

//#endregion
//#region src/cli/utils/logger.ts
const logger = {
	error(...args) {
		console.log(highlighter.error(args.join(" ")));
	},
	warn(...args) {
		console.log(highlighter.warn(args.join(" ")));
	},
	success(...args) {
		console.log(highlighter.success(args.join(" ")));
	},
	info(...args) {
		console.log(highlighter.info(args.join(" ")));
	},
	log(...args) {
		console.log(args.join(" "));
	},
	break() {
		console.log("");
	}
};

//#endregion
//#region src/cli/utils/handle-error.ts
const handleError = (error) => {
	logger.break();
	logger.error("Something went wrong. Please check the error below for more details.");
	logger.error("If the problem persists, please open an issue on GitHub.");
	logger.error("");
	if (error instanceof Error) logger.error(error.message);
	logger.break();
	process.exit(1);
};

//#endregion
//#region ../../node_modules/.pnpm/@jridgewell+sourcemap-codec@1.5.5/node_modules/@jridgewell/sourcemap-codec/dist/sourcemap-codec.mjs
var comma = ",".charCodeAt(0);
var semicolon = ";".charCodeAt(0);
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var intToChar = new Uint8Array(64);
var charToInt = new Uint8Array(128);
for (let i = 0; i < chars.length; i++) {
	const c = chars.charCodeAt(i);
	intToChar[i] = c;
	charToInt[c] = i;
}
function encodeInteger(builder, num, relative) {
	let delta = num - relative;
	delta = delta < 0 ? -delta << 1 | 1 : delta << 1;
	do {
		let clamped = delta & 31;
		delta >>>= 5;
		if (delta > 0) clamped |= 32;
		builder.write(intToChar[clamped]);
	} while (delta > 0);
	return num;
}
var bufLength = 1024 * 16;
var td = typeof TextDecoder !== "undefined" ? /* @__PURE__ */ new TextDecoder() : typeof Buffer !== "undefined" ? { decode(buf) {
	return Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength).toString();
} } : { decode(buf) {
	let out = "";
	for (let i = 0; i < buf.length; i++) out += String.fromCharCode(buf[i]);
	return out;
} };
var StringWriter = class {
	constructor() {
		this.pos = 0;
		this.out = "";
		this.buffer = new Uint8Array(bufLength);
	}
	write(v) {
		const { buffer } = this;
		buffer[this.pos++] = v;
		if (this.pos === bufLength) {
			this.out += td.decode(buffer);
			this.pos = 0;
		}
	}
	flush() {
		const { buffer, out, pos } = this;
		return pos > 0 ? out + td.decode(buffer.subarray(0, pos)) : out;
	}
};
function encode(decoded) {
	const writer = new StringWriter();
	let sourcesIndex = 0;
	let sourceLine = 0;
	let sourceColumn = 0;
	let namesIndex = 0;
	for (let i = 0; i < decoded.length; i++) {
		const line = decoded[i];
		if (i > 0) writer.write(semicolon);
		if (line.length === 0) continue;
		let genColumn = 0;
		for (let j = 0; j < line.length; j++) {
			const segment = line[j];
			if (j > 0) writer.write(comma);
			genColumn = encodeInteger(writer, segment[0], genColumn);
			if (segment.length === 1) continue;
			sourcesIndex = encodeInteger(writer, segment[1], sourcesIndex);
			sourceLine = encodeInteger(writer, segment[2], sourceLine);
			sourceColumn = encodeInteger(writer, segment[3], sourceColumn);
			if (segment.length === 4) continue;
			namesIndex = encodeInteger(writer, segment[4], namesIndex);
		}
	}
	return writer.flush();
}

//#endregion
//#region ../../node_modules/.pnpm/magic-string@0.30.21/node_modules/magic-string/dist/magic-string.es.mjs
var BitSet = class BitSet {
	constructor(arg) {
		this.bits = arg instanceof BitSet ? arg.bits.slice() : [];
	}
	add(n) {
		this.bits[n >> 5] |= 1 << (n & 31);
	}
	has(n) {
		return !!(this.bits[n >> 5] & 1 << (n & 31));
	}
};
var Chunk = class Chunk {
	constructor(start, end, content) {
		this.start = start;
		this.end = end;
		this.original = content;
		this.intro = "";
		this.outro = "";
		this.content = content;
		this.storeName = false;
		this.edited = false;
		this.previous = null;
		this.next = null;
	}
	appendLeft(content) {
		this.outro += content;
	}
	appendRight(content) {
		this.intro = this.intro + content;
	}
	clone() {
		const chunk = new Chunk(this.start, this.end, this.original);
		chunk.intro = this.intro;
		chunk.outro = this.outro;
		chunk.content = this.content;
		chunk.storeName = this.storeName;
		chunk.edited = this.edited;
		return chunk;
	}
	contains(index) {
		return this.start < index && index < this.end;
	}
	eachNext(fn) {
		let chunk = this;
		while (chunk) {
			fn(chunk);
			chunk = chunk.next;
		}
	}
	eachPrevious(fn) {
		let chunk = this;
		while (chunk) {
			fn(chunk);
			chunk = chunk.previous;
		}
	}
	edit(content, storeName, contentOnly) {
		this.content = content;
		if (!contentOnly) {
			this.intro = "";
			this.outro = "";
		}
		this.storeName = storeName;
		this.edited = true;
		return this;
	}
	prependLeft(content) {
		this.outro = content + this.outro;
	}
	prependRight(content) {
		this.intro = content + this.intro;
	}
	reset() {
		this.intro = "";
		this.outro = "";
		if (this.edited) {
			this.content = this.original;
			this.storeName = false;
			this.edited = false;
		}
	}
	split(index) {
		const sliceIndex = index - this.start;
		const originalBefore = this.original.slice(0, sliceIndex);
		const originalAfter = this.original.slice(sliceIndex);
		this.original = originalBefore;
		const newChunk = new Chunk(index, this.end, originalAfter);
		newChunk.outro = this.outro;
		this.outro = "";
		this.end = index;
		if (this.edited) {
			newChunk.edit("", false);
			this.content = "";
		} else this.content = originalBefore;
		newChunk.next = this.next;
		if (newChunk.next) newChunk.next.previous = newChunk;
		newChunk.previous = this;
		this.next = newChunk;
		return newChunk;
	}
	toString() {
		return this.intro + this.content + this.outro;
	}
	trimEnd(rx) {
		this.outro = this.outro.replace(rx, "");
		if (this.outro.length) return true;
		const trimmed = this.content.replace(rx, "");
		if (trimmed.length) {
			if (trimmed !== this.content) {
				this.split(this.start + trimmed.length).edit("", void 0, true);
				if (this.edited) this.edit(trimmed, this.storeName, true);
			}
			return true;
		} else {
			this.edit("", void 0, true);
			this.intro = this.intro.replace(rx, "");
			if (this.intro.length) return true;
		}
	}
	trimStart(rx) {
		this.intro = this.intro.replace(rx, "");
		if (this.intro.length) return true;
		const trimmed = this.content.replace(rx, "");
		if (trimmed.length) {
			if (trimmed !== this.content) {
				const newChunk = this.split(this.end - trimmed.length);
				if (this.edited) newChunk.edit(trimmed, this.storeName, true);
				this.edit("", void 0, true);
			}
			return true;
		} else {
			this.edit("", void 0, true);
			this.outro = this.outro.replace(rx, "");
			if (this.outro.length) return true;
		}
	}
};
function getBtoa() {
	if (typeof globalThis !== "undefined" && typeof globalThis.btoa === "function") return (str) => globalThis.btoa(unescape(encodeURIComponent(str)));
	else if (typeof Buffer === "function") return (str) => Buffer.from(str, "utf-8").toString("base64");
	else return () => {
		throw new Error("Unsupported environment: `window.btoa` or `Buffer` should be supported.");
	};
}
const btoa = /*#__PURE__*/ getBtoa();
var SourceMap = class {
	constructor(properties) {
		this.version = 3;
		this.file = properties.file;
		this.sources = properties.sources;
		this.sourcesContent = properties.sourcesContent;
		this.names = properties.names;
		this.mappings = encode(properties.mappings);
		if (typeof properties.x_google_ignoreList !== "undefined") this.x_google_ignoreList = properties.x_google_ignoreList;
		if (typeof properties.debugId !== "undefined") this.debugId = properties.debugId;
	}
	toString() {
		return JSON.stringify(this);
	}
	toUrl() {
		return "data:application/json;charset=utf-8;base64," + btoa(this.toString());
	}
};
function guessIndent(code) {
	const lines = code.split("\n");
	const tabbed = lines.filter((line) => /^\t+/.test(line));
	const spaced = lines.filter((line) => /^ {2,}/.test(line));
	if (tabbed.length === 0 && spaced.length === 0) return null;
	if (tabbed.length >= spaced.length) return "	";
	const min = spaced.reduce((previous, current) => {
		const numSpaces = /^ +/.exec(current)[0].length;
		return Math.min(numSpaces, previous);
	}, Infinity);
	return new Array(min + 1).join(" ");
}
function getRelativePath(from, to) {
	const fromParts = from.split(/[/\\]/);
	const toParts = to.split(/[/\\]/);
	fromParts.pop();
	while (fromParts[0] === toParts[0]) {
		fromParts.shift();
		toParts.shift();
	}
	if (fromParts.length) {
		let i = fromParts.length;
		while (i--) fromParts[i] = "..";
	}
	return fromParts.concat(toParts).join("/");
}
const toString = Object.prototype.toString;
function isObject(thing) {
	return toString.call(thing) === "[object Object]";
}
function getLocator(source) {
	const originalLines = source.split("\n");
	const lineOffsets = [];
	for (let i = 0, pos = 0; i < originalLines.length; i++) {
		lineOffsets.push(pos);
		pos += originalLines[i].length + 1;
	}
	return function locate(index) {
		let i = 0;
		let j = lineOffsets.length;
		while (i < j) {
			const m = i + j >> 1;
			if (index < lineOffsets[m]) j = m;
			else i = m + 1;
		}
		const line = i - 1;
		return {
			line,
			column: index - lineOffsets[line]
		};
	};
}
const wordRegex = /\w/;
var Mappings = class {
	constructor(hires) {
		this.hires = hires;
		this.generatedCodeLine = 0;
		this.generatedCodeColumn = 0;
		this.raw = [];
		this.rawSegments = this.raw[this.generatedCodeLine] = [];
		this.pending = null;
	}
	addEdit(sourceIndex, content, loc, nameIndex) {
		if (content.length) {
			const contentLengthMinusOne = content.length - 1;
			let contentLineEnd = content.indexOf("\n", 0);
			let previousContentLineEnd = -1;
			while (contentLineEnd >= 0 && contentLengthMinusOne > contentLineEnd) {
				const segment = [
					this.generatedCodeColumn,
					sourceIndex,
					loc.line,
					loc.column
				];
				if (nameIndex >= 0) segment.push(nameIndex);
				this.rawSegments.push(segment);
				this.generatedCodeLine += 1;
				this.raw[this.generatedCodeLine] = this.rawSegments = [];
				this.generatedCodeColumn = 0;
				previousContentLineEnd = contentLineEnd;
				contentLineEnd = content.indexOf("\n", contentLineEnd + 1);
			}
			const segment = [
				this.generatedCodeColumn,
				sourceIndex,
				loc.line,
				loc.column
			];
			if (nameIndex >= 0) segment.push(nameIndex);
			this.rawSegments.push(segment);
			this.advance(content.slice(previousContentLineEnd + 1));
		} else if (this.pending) {
			this.rawSegments.push(this.pending);
			this.advance(content);
		}
		this.pending = null;
	}
	addUneditedChunk(sourceIndex, chunk, original, loc, sourcemapLocations) {
		let originalCharIndex = chunk.start;
		let first = true;
		let charInHiresBoundary = false;
		while (originalCharIndex < chunk.end) {
			if (original[originalCharIndex] === "\n") {
				loc.line += 1;
				loc.column = 0;
				this.generatedCodeLine += 1;
				this.raw[this.generatedCodeLine] = this.rawSegments = [];
				this.generatedCodeColumn = 0;
				first = true;
				charInHiresBoundary = false;
			} else {
				if (this.hires || first || sourcemapLocations.has(originalCharIndex)) {
					const segment = [
						this.generatedCodeColumn,
						sourceIndex,
						loc.line,
						loc.column
					];
					if (this.hires === "boundary") if (wordRegex.test(original[originalCharIndex])) {
						if (!charInHiresBoundary) {
							this.rawSegments.push(segment);
							charInHiresBoundary = true;
						}
					} else {
						this.rawSegments.push(segment);
						charInHiresBoundary = false;
					}
					else this.rawSegments.push(segment);
				}
				loc.column += 1;
				this.generatedCodeColumn += 1;
				first = false;
			}
			originalCharIndex += 1;
		}
		this.pending = null;
	}
	advance(str) {
		if (!str) return;
		const lines = str.split("\n");
		if (lines.length > 1) {
			for (let i = 0; i < lines.length - 1; i++) {
				this.generatedCodeLine++;
				this.raw[this.generatedCodeLine] = this.rawSegments = [];
			}
			this.generatedCodeColumn = 0;
		}
		this.generatedCodeColumn += lines[lines.length - 1].length;
	}
};
const n = "\n";
const warned = {
	insertLeft: false,
	insertRight: false,
	storeName: false
};
var MagicString = class MagicString {
	constructor(string, options = {}) {
		const chunk = new Chunk(0, string.length, string);
		Object.defineProperties(this, {
			original: {
				writable: true,
				value: string
			},
			outro: {
				writable: true,
				value: ""
			},
			intro: {
				writable: true,
				value: ""
			},
			firstChunk: {
				writable: true,
				value: chunk
			},
			lastChunk: {
				writable: true,
				value: chunk
			},
			lastSearchedChunk: {
				writable: true,
				value: chunk
			},
			byStart: {
				writable: true,
				value: {}
			},
			byEnd: {
				writable: true,
				value: {}
			},
			filename: {
				writable: true,
				value: options.filename
			},
			indentExclusionRanges: {
				writable: true,
				value: options.indentExclusionRanges
			},
			sourcemapLocations: {
				writable: true,
				value: new BitSet()
			},
			storedNames: {
				writable: true,
				value: {}
			},
			indentStr: {
				writable: true,
				value: void 0
			},
			ignoreList: {
				writable: true,
				value: options.ignoreList
			},
			offset: {
				writable: true,
				value: options.offset || 0
			}
		});
		this.byStart[0] = chunk;
		this.byEnd[string.length] = chunk;
	}
	addSourcemapLocation(char) {
		this.sourcemapLocations.add(char);
	}
	append(content) {
		if (typeof content !== "string") throw new TypeError("outro content must be a string");
		this.outro += content;
		return this;
	}
	appendLeft(index, content) {
		index = index + this.offset;
		if (typeof content !== "string") throw new TypeError("inserted content must be a string");
		this._split(index);
		const chunk = this.byEnd[index];
		if (chunk) chunk.appendLeft(content);
		else this.intro += content;
		return this;
	}
	appendRight(index, content) {
		index = index + this.offset;
		if (typeof content !== "string") throw new TypeError("inserted content must be a string");
		this._split(index);
		const chunk = this.byStart[index];
		if (chunk) chunk.appendRight(content);
		else this.outro += content;
		return this;
	}
	clone() {
		const cloned = new MagicString(this.original, {
			filename: this.filename,
			offset: this.offset
		});
		let originalChunk = this.firstChunk;
		let clonedChunk = cloned.firstChunk = cloned.lastSearchedChunk = originalChunk.clone();
		while (originalChunk) {
			cloned.byStart[clonedChunk.start] = clonedChunk;
			cloned.byEnd[clonedChunk.end] = clonedChunk;
			const nextOriginalChunk = originalChunk.next;
			const nextClonedChunk = nextOriginalChunk && nextOriginalChunk.clone();
			if (nextClonedChunk) {
				clonedChunk.next = nextClonedChunk;
				nextClonedChunk.previous = clonedChunk;
				clonedChunk = nextClonedChunk;
			}
			originalChunk = nextOriginalChunk;
		}
		cloned.lastChunk = clonedChunk;
		if (this.indentExclusionRanges) cloned.indentExclusionRanges = this.indentExclusionRanges.slice();
		cloned.sourcemapLocations = new BitSet(this.sourcemapLocations);
		cloned.intro = this.intro;
		cloned.outro = this.outro;
		return cloned;
	}
	generateDecodedMap(options) {
		options = options || {};
		const sourceIndex = 0;
		const names = Object.keys(this.storedNames);
		const mappings = new Mappings(options.hires);
		const locate = getLocator(this.original);
		if (this.intro) mappings.advance(this.intro);
		this.firstChunk.eachNext((chunk) => {
			const loc = locate(chunk.start);
			if (chunk.intro.length) mappings.advance(chunk.intro);
			if (chunk.edited) mappings.addEdit(sourceIndex, chunk.content, loc, chunk.storeName ? names.indexOf(chunk.original) : -1);
			else mappings.addUneditedChunk(sourceIndex, chunk, this.original, loc, this.sourcemapLocations);
			if (chunk.outro.length) mappings.advance(chunk.outro);
		});
		if (this.outro) mappings.advance(this.outro);
		return {
			file: options.file ? options.file.split(/[/\\]/).pop() : void 0,
			sources: [options.source ? getRelativePath(options.file || "", options.source) : options.file || ""],
			sourcesContent: options.includeContent ? [this.original] : void 0,
			names,
			mappings: mappings.raw,
			x_google_ignoreList: this.ignoreList ? [sourceIndex] : void 0
		};
	}
	generateMap(options) {
		return new SourceMap(this.generateDecodedMap(options));
	}
	_ensureindentStr() {
		if (this.indentStr === void 0) this.indentStr = guessIndent(this.original);
	}
	_getRawIndentString() {
		this._ensureindentStr();
		return this.indentStr;
	}
	getIndentString() {
		this._ensureindentStr();
		return this.indentStr === null ? "	" : this.indentStr;
	}
	indent(indentStr, options) {
		const pattern = /^[^\r\n]/gm;
		if (isObject(indentStr)) {
			options = indentStr;
			indentStr = void 0;
		}
		if (indentStr === void 0) {
			this._ensureindentStr();
			indentStr = this.indentStr || "	";
		}
		if (indentStr === "") return this;
		options = options || {};
		const isExcluded = {};
		if (options.exclude) (typeof options.exclude[0] === "number" ? [options.exclude] : options.exclude).forEach((exclusion) => {
			for (let i = exclusion[0]; i < exclusion[1]; i += 1) isExcluded[i] = true;
		});
		let shouldIndentNextCharacter = options.indentStart !== false;
		const replacer = (match) => {
			if (shouldIndentNextCharacter) return `${indentStr}${match}`;
			shouldIndentNextCharacter = true;
			return match;
		};
		this.intro = this.intro.replace(pattern, replacer);
		let charIndex = 0;
		let chunk = this.firstChunk;
		while (chunk) {
			const end = chunk.end;
			if (chunk.edited) {
				if (!isExcluded[charIndex]) {
					chunk.content = chunk.content.replace(pattern, replacer);
					if (chunk.content.length) shouldIndentNextCharacter = chunk.content[chunk.content.length - 1] === "\n";
				}
			} else {
				charIndex = chunk.start;
				while (charIndex < end) {
					if (!isExcluded[charIndex]) {
						const char = this.original[charIndex];
						if (char === "\n") shouldIndentNextCharacter = true;
						else if (char !== "\r" && shouldIndentNextCharacter) {
							shouldIndentNextCharacter = false;
							if (charIndex === chunk.start) chunk.prependRight(indentStr);
							else {
								this._splitChunk(chunk, charIndex);
								chunk = chunk.next;
								chunk.prependRight(indentStr);
							}
						}
					}
					charIndex += 1;
				}
			}
			charIndex = chunk.end;
			chunk = chunk.next;
		}
		this.outro = this.outro.replace(pattern, replacer);
		return this;
	}
	insert() {
		throw new Error("magicString.insert(...) is deprecated. Use prependRight(...) or appendLeft(...)");
	}
	insertLeft(index, content) {
		if (!warned.insertLeft) {
			console.warn("magicString.insertLeft(...) is deprecated. Use magicString.appendLeft(...) instead");
			warned.insertLeft = true;
		}
		return this.appendLeft(index, content);
	}
	insertRight(index, content) {
		if (!warned.insertRight) {
			console.warn("magicString.insertRight(...) is deprecated. Use magicString.prependRight(...) instead");
			warned.insertRight = true;
		}
		return this.prependRight(index, content);
	}
	move(start, end, index) {
		start = start + this.offset;
		end = end + this.offset;
		index = index + this.offset;
		if (index >= start && index <= end) throw new Error("Cannot move a selection inside itself");
		this._split(start);
		this._split(end);
		this._split(index);
		const first = this.byStart[start];
		const last = this.byEnd[end];
		const oldLeft = first.previous;
		const oldRight = last.next;
		const newRight = this.byStart[index];
		if (!newRight && last === this.lastChunk) return this;
		const newLeft = newRight ? newRight.previous : this.lastChunk;
		if (oldLeft) oldLeft.next = oldRight;
		if (oldRight) oldRight.previous = oldLeft;
		if (newLeft) newLeft.next = first;
		if (newRight) newRight.previous = last;
		if (!first.previous) this.firstChunk = last.next;
		if (!last.next) {
			this.lastChunk = first.previous;
			this.lastChunk.next = null;
		}
		first.previous = newLeft;
		last.next = newRight || null;
		if (!newLeft) this.firstChunk = first;
		if (!newRight) this.lastChunk = last;
		return this;
	}
	overwrite(start, end, content, options) {
		options = options || {};
		return this.update(start, end, content, {
			...options,
			overwrite: !options.contentOnly
		});
	}
	update(start, end, content, options) {
		start = start + this.offset;
		end = end + this.offset;
		if (typeof content !== "string") throw new TypeError("replacement content must be a string");
		if (this.original.length !== 0) {
			while (start < 0) start += this.original.length;
			while (end < 0) end += this.original.length;
		}
		if (end > this.original.length) throw new Error("end is out of bounds");
		if (start === end) throw new Error("Cannot overwrite a zero-length range – use appendLeft or prependRight instead");
		this._split(start);
		this._split(end);
		if (options === true) {
			if (!warned.storeName) {
				console.warn("The final argument to magicString.overwrite(...) should be an options object. See https://github.com/rich-harris/magic-string");
				warned.storeName = true;
			}
			options = { storeName: true };
		}
		const storeName = options !== void 0 ? options.storeName : false;
		const overwrite = options !== void 0 ? options.overwrite : false;
		if (storeName) {
			const original = this.original.slice(start, end);
			Object.defineProperty(this.storedNames, original, {
				writable: true,
				value: true,
				enumerable: true
			});
		}
		const first = this.byStart[start];
		const last = this.byEnd[end];
		if (first) {
			let chunk = first;
			while (chunk !== last) {
				if (chunk.next !== this.byStart[chunk.end]) throw new Error("Cannot overwrite across a split point");
				chunk = chunk.next;
				chunk.edit("", false);
			}
			first.edit(content, storeName, !overwrite);
		} else {
			const newChunk = new Chunk(start, end, "").edit(content, storeName);
			last.next = newChunk;
			newChunk.previous = last;
		}
		return this;
	}
	prepend(content) {
		if (typeof content !== "string") throw new TypeError("outro content must be a string");
		this.intro = content + this.intro;
		return this;
	}
	prependLeft(index, content) {
		index = index + this.offset;
		if (typeof content !== "string") throw new TypeError("inserted content must be a string");
		this._split(index);
		const chunk = this.byEnd[index];
		if (chunk) chunk.prependLeft(content);
		else this.intro = content + this.intro;
		return this;
	}
	prependRight(index, content) {
		index = index + this.offset;
		if (typeof content !== "string") throw new TypeError("inserted content must be a string");
		this._split(index);
		const chunk = this.byStart[index];
		if (chunk) chunk.prependRight(content);
		else this.outro = content + this.outro;
		return this;
	}
	remove(start, end) {
		start = start + this.offset;
		end = end + this.offset;
		if (this.original.length !== 0) {
			while (start < 0) start += this.original.length;
			while (end < 0) end += this.original.length;
		}
		if (start === end) return this;
		if (start < 0 || end > this.original.length) throw new Error("Character is out of bounds");
		if (start > end) throw new Error("end must be greater than start");
		this._split(start);
		this._split(end);
		let chunk = this.byStart[start];
		while (chunk) {
			chunk.intro = "";
			chunk.outro = "";
			chunk.edit("");
			chunk = end > chunk.end ? this.byStart[chunk.end] : null;
		}
		return this;
	}
	reset(start, end) {
		start = start + this.offset;
		end = end + this.offset;
		if (this.original.length !== 0) {
			while (start < 0) start += this.original.length;
			while (end < 0) end += this.original.length;
		}
		if (start === end) return this;
		if (start < 0 || end > this.original.length) throw new Error("Character is out of bounds");
		if (start > end) throw new Error("end must be greater than start");
		this._split(start);
		this._split(end);
		let chunk = this.byStart[start];
		while (chunk) {
			chunk.reset();
			chunk = end > chunk.end ? this.byStart[chunk.end] : null;
		}
		return this;
	}
	lastChar() {
		if (this.outro.length) return this.outro[this.outro.length - 1];
		let chunk = this.lastChunk;
		do {
			if (chunk.outro.length) return chunk.outro[chunk.outro.length - 1];
			if (chunk.content.length) return chunk.content[chunk.content.length - 1];
			if (chunk.intro.length) return chunk.intro[chunk.intro.length - 1];
		} while (chunk = chunk.previous);
		if (this.intro.length) return this.intro[this.intro.length - 1];
		return "";
	}
	lastLine() {
		let lineIndex = this.outro.lastIndexOf(n);
		if (lineIndex !== -1) return this.outro.substr(lineIndex + 1);
		let lineStr = this.outro;
		let chunk = this.lastChunk;
		do {
			if (chunk.outro.length > 0) {
				lineIndex = chunk.outro.lastIndexOf(n);
				if (lineIndex !== -1) return chunk.outro.substr(lineIndex + 1) + lineStr;
				lineStr = chunk.outro + lineStr;
			}
			if (chunk.content.length > 0) {
				lineIndex = chunk.content.lastIndexOf(n);
				if (lineIndex !== -1) return chunk.content.substr(lineIndex + 1) + lineStr;
				lineStr = chunk.content + lineStr;
			}
			if (chunk.intro.length > 0) {
				lineIndex = chunk.intro.lastIndexOf(n);
				if (lineIndex !== -1) return chunk.intro.substr(lineIndex + 1) + lineStr;
				lineStr = chunk.intro + lineStr;
			}
		} while (chunk = chunk.previous);
		lineIndex = this.intro.lastIndexOf(n);
		if (lineIndex !== -1) return this.intro.substr(lineIndex + 1) + lineStr;
		return this.intro + lineStr;
	}
	slice(start = 0, end = this.original.length - this.offset) {
		start = start + this.offset;
		end = end + this.offset;
		if (this.original.length !== 0) {
			while (start < 0) start += this.original.length;
			while (end < 0) end += this.original.length;
		}
		let result = "";
		let chunk = this.firstChunk;
		while (chunk && (chunk.start > start || chunk.end <= start)) {
			if (chunk.start < end && chunk.end >= end) return result;
			chunk = chunk.next;
		}
		if (chunk && chunk.edited && chunk.start !== start) throw new Error(`Cannot use replaced character ${start} as slice start anchor.`);
		const startChunk = chunk;
		while (chunk) {
			if (chunk.intro && (startChunk !== chunk || chunk.start === start)) result += chunk.intro;
			const containsEnd = chunk.start < end && chunk.end >= end;
			if (containsEnd && chunk.edited && chunk.end !== end) throw new Error(`Cannot use replaced character ${end} as slice end anchor.`);
			const sliceStart = startChunk === chunk ? start - chunk.start : 0;
			const sliceEnd = containsEnd ? chunk.content.length + end - chunk.end : chunk.content.length;
			result += chunk.content.slice(sliceStart, sliceEnd);
			if (chunk.outro && (!containsEnd || chunk.end === end)) result += chunk.outro;
			if (containsEnd) break;
			chunk = chunk.next;
		}
		return result;
	}
	snip(start, end) {
		const clone = this.clone();
		clone.remove(0, start);
		clone.remove(end, clone.original.length);
		return clone;
	}
	_split(index) {
		if (this.byStart[index] || this.byEnd[index]) return;
		let chunk = this.lastSearchedChunk;
		let previousChunk = chunk;
		const searchForward = index > chunk.end;
		while (chunk) {
			if (chunk.contains(index)) return this._splitChunk(chunk, index);
			chunk = searchForward ? this.byStart[chunk.end] : this.byEnd[chunk.start];
			if (chunk === previousChunk) return;
			previousChunk = chunk;
		}
	}
	_splitChunk(chunk, index) {
		if (chunk.edited && chunk.content.length) {
			const loc = getLocator(this.original)(index);
			throw new Error(`Cannot split a chunk that has already been edited (${loc.line}:${loc.column} – "${chunk.original}")`);
		}
		const newChunk = chunk.split(index);
		this.byEnd[index] = chunk;
		this.byStart[index] = newChunk;
		this.byEnd[newChunk.end] = newChunk;
		if (chunk === this.lastChunk) this.lastChunk = newChunk;
		this.lastSearchedChunk = chunk;
		return true;
	}
	toString() {
		let str = this.intro;
		let chunk = this.firstChunk;
		while (chunk) {
			str += chunk.toString();
			chunk = chunk.next;
		}
		return str + this.outro;
	}
	isEmpty() {
		let chunk = this.firstChunk;
		do
			if (chunk.intro.length && chunk.intro.trim() || chunk.content.length && chunk.content.trim() || chunk.outro.length && chunk.outro.trim()) return false;
		while (chunk = chunk.next);
		return true;
	}
	length() {
		let chunk = this.firstChunk;
		let length = 0;
		do
			length += chunk.intro.length + chunk.content.length + chunk.outro.length;
		while (chunk = chunk.next);
		return length;
	}
	trimLines() {
		return this.trim("[\\r\\n]");
	}
	trim(charType) {
		return this.trimStart(charType).trimEnd(charType);
	}
	trimEndAborted(charType) {
		const rx = new RegExp((charType || "\\s") + "+$");
		this.outro = this.outro.replace(rx, "");
		if (this.outro.length) return true;
		let chunk = this.lastChunk;
		do {
			const end = chunk.end;
			const aborted = chunk.trimEnd(rx);
			if (chunk.end !== end) {
				if (this.lastChunk === chunk) this.lastChunk = chunk.next;
				this.byEnd[chunk.end] = chunk;
				this.byStart[chunk.next.start] = chunk.next;
				this.byEnd[chunk.next.end] = chunk.next;
			}
			if (aborted) return true;
			chunk = chunk.previous;
		} while (chunk);
		return false;
	}
	trimEnd(charType) {
		this.trimEndAborted(charType);
		return this;
	}
	trimStartAborted(charType) {
		const rx = new RegExp("^" + (charType || "\\s") + "+");
		this.intro = this.intro.replace(rx, "");
		if (this.intro.length) return true;
		let chunk = this.firstChunk;
		do {
			const end = chunk.end;
			const aborted = chunk.trimStart(rx);
			if (chunk.end !== end) {
				if (chunk === this.lastChunk) this.lastChunk = chunk.next;
				this.byEnd[chunk.end] = chunk;
				this.byStart[chunk.next.start] = chunk.next;
				this.byEnd[chunk.next.end] = chunk.next;
			}
			if (aborted) return true;
			chunk = chunk.next;
		} while (chunk);
		return false;
	}
	trimStart(charType) {
		this.trimStartAborted(charType);
		return this;
	}
	hasChanged() {
		return this.original !== this.toString();
	}
	_replaceRegexp(searchValue, replacement) {
		function getReplacement(match, str) {
			if (typeof replacement === "string") return replacement.replace(/\$(\$|&|\d+)/g, (_, i) => {
				if (i === "$") return "$";
				if (i === "&") return match[0];
				if (+i < match.length) return match[+i];
				return `$${i}`;
			});
			else return replacement(...match, match.index, str, match.groups);
		}
		function matchAll(re, str) {
			let match;
			const matches = [];
			while (match = re.exec(str)) matches.push(match);
			return matches;
		}
		if (searchValue.global) matchAll(searchValue, this.original).forEach((match) => {
			if (match.index != null) {
				const replacement = getReplacement(match, this.original);
				if (replacement !== match[0]) this.overwrite(match.index, match.index + match[0].length, replacement);
			}
		});
		else {
			const match = this.original.match(searchValue);
			if (match && match.index != null) {
				const replacement = getReplacement(match, this.original);
				if (replacement !== match[0]) this.overwrite(match.index, match.index + match[0].length, replacement);
			}
		}
		return this;
	}
	_replaceString(string, replacement) {
		const { original } = this;
		const index = original.indexOf(string);
		if (index !== -1) {
			if (typeof replacement === "function") replacement = replacement(string, index, original);
			if (string !== replacement) this.overwrite(index, index + string.length, replacement);
		}
		return this;
	}
	replace(searchValue, replacement) {
		if (typeof searchValue === "string") return this._replaceString(searchValue, replacement);
		return this._replaceRegexp(searchValue, replacement);
	}
	_replaceAllString(string, replacement) {
		const { original } = this;
		const stringLength = string.length;
		for (let index = original.indexOf(string); index !== -1; index = original.indexOf(string, index + stringLength)) {
			const previous = original.slice(index, index + stringLength);
			let _replacement = replacement;
			if (typeof replacement === "function") _replacement = replacement(previous, index, original);
			if (previous !== _replacement) this.overwrite(index, index + stringLength, _replacement);
		}
		return this;
	}
	replaceAll(searchValue, replacement) {
		if (typeof searchValue === "string") return this._replaceAllString(searchValue, replacement);
		if (!searchValue.global) throw new TypeError("MagicString.prototype.replaceAll called with a non-global RegExp argument");
		return this._replaceRegexp(searchValue, replacement);
	}
};

//#endregion
//#region src/cli/utils/migrate-source.ts
const STATIC_IMPORT_REGEX = /^[ \t]*(import|export)\s+([^;'"()]*?)\s+from\s*(['"])([^'"]+)\3/gm;
const DYNAMIC_IMPORT_REGEX = /\b(import|require)\s*\(\s*(['"])([^'"]+)\2\s*\)/g;
const SIDE_EFFECT_IMPORT_REGEX = /(^|\n)([ \t]*import\s+)(['"])([^'"]+)\3/g;
const isMigratableSource = (source) => MIGRATABLE_SOURCES.includes(source);
const rewriteImportClause = (rawClause, source) => {
	const clause = rawClause.trim();
	if (/^\*\s+as\s+/.test(clause)) return null;
	const bracesMatch = clause.match(/\{([\s\S]*)\}/);
	const defaultPart = (bracesMatch ? clause.slice(0, bracesMatch.index) : clause).replace(/,\s*$/, "").trim();
	if (defaultPart === "" || /\s/.test(defaultPart)) return null;
	const namedExport = DEFAULT_EXPORT_NAME[source];
	const namedSpecifier = defaultPart === namedExport ? namedExport : `${namedExport} as ${defaultPart}`;
	const namedBody = bracesMatch ? bracesMatch[1].trim() : "";
	return namedBody ? `{ ${namedSpecifier}, ${namedBody} }` : `{ ${namedSpecifier} }`;
};
const migrateSource = (code) => {
	const magic = new MagicString(code);
	let changeCount = 0;
	for (const match of code.matchAll(STATIC_IMPORT_REGEX)) {
		const [statement, keyword, clause, quote, source] = match;
		if (match.index === void 0 || !isMigratableSource(source)) continue;
		const statementStart = match.index;
		const sourceTokenStart = statementStart + statement.length - (source.length + 2);
		const newClause = keyword === "import" ? rewriteImportClause(clause, source) : null;
		if (newClause === null) magic.overwrite(sourceTokenStart, statementStart + statement.length, `${quote}${TARGET_PACKAGE}${quote}`);
		else magic.overwrite(statementStart, statementStart + statement.length, `${keyword} ${newClause} from ${quote}${TARGET_PACKAGE}${quote}`);
		changeCount++;
	}
	for (const match of code.matchAll(DYNAMIC_IMPORT_REGEX)) {
		const [, , quote, source] = match;
		if (match.index === void 0 || !isMigratableSource(source)) continue;
		const sourceTokenStart = match.index + match[0].indexOf(`${quote}${source}${quote}`);
		magic.overwrite(sourceTokenStart, sourceTokenStart + source.length + 2, `${quote}${TARGET_PACKAGE}${quote}`);
		changeCount++;
	}
	for (const match of code.matchAll(SIDE_EFFECT_IMPORT_REGEX)) {
		const [, leading, importKeyword, quote, source] = match;
		if (match.index === void 0 || !isMigratableSource(source)) continue;
		const sourceTokenStart = match.index + leading.length + importKeyword.length;
		magic.overwrite(sourceTokenStart, sourceTokenStart + source.length + 2, `${quote}${TARGET_PACKAGE}${quote}`);
		changeCount++;
	}
	return {
		code: magic.toString(),
		changeCount
	};
};

//#endregion
//#region ../../node_modules/.pnpm/chalk@5.6.2/node_modules/chalk/source/vendor/ansi-styles/index.js
const ANSI_BACKGROUND_OFFSET = 10;
const wrapAnsi16 = (offset = 0) => (code) => `\u001B[${code + offset}m`;
const wrapAnsi256 = (offset = 0) => (code) => `\u001B[${38 + offset};5;${code}m`;
const wrapAnsi16m = (offset = 0) => (red, green, blue) => `\u001B[${38 + offset};2;${red};${green};${blue}m`;
const styles$1 = {
	modifier: {
		reset: [0, 0],
		bold: [1, 22],
		dim: [2, 22],
		italic: [3, 23],
		underline: [4, 24],
		overline: [53, 55],
		inverse: [7, 27],
		hidden: [8, 28],
		strikethrough: [9, 29]
	},
	color: {
		black: [30, 39],
		red: [31, 39],
		green: [32, 39],
		yellow: [33, 39],
		blue: [34, 39],
		magenta: [35, 39],
		cyan: [36, 39],
		white: [37, 39],
		blackBright: [90, 39],
		gray: [90, 39],
		grey: [90, 39],
		redBright: [91, 39],
		greenBright: [92, 39],
		yellowBright: [93, 39],
		blueBright: [94, 39],
		magentaBright: [95, 39],
		cyanBright: [96, 39],
		whiteBright: [97, 39]
	},
	bgColor: {
		bgBlack: [40, 49],
		bgRed: [41, 49],
		bgGreen: [42, 49],
		bgYellow: [43, 49],
		bgBlue: [44, 49],
		bgMagenta: [45, 49],
		bgCyan: [46, 49],
		bgWhite: [47, 49],
		bgBlackBright: [100, 49],
		bgGray: [100, 49],
		bgGrey: [100, 49],
		bgRedBright: [101, 49],
		bgGreenBright: [102, 49],
		bgYellowBright: [103, 49],
		bgBlueBright: [104, 49],
		bgMagentaBright: [105, 49],
		bgCyanBright: [106, 49],
		bgWhiteBright: [107, 49]
	}
};
const modifierNames = Object.keys(styles$1.modifier);
const foregroundColorNames = Object.keys(styles$1.color);
const backgroundColorNames = Object.keys(styles$1.bgColor);
const colorNames = [...foregroundColorNames, ...backgroundColorNames];
function assembleStyles() {
	const codes = /* @__PURE__ */ new Map();
	for (const [groupName, group] of Object.entries(styles$1)) {
		for (const [styleName, style] of Object.entries(group)) {
			styles$1[styleName] = {
				open: `\u001B[${style[0]}m`,
				close: `\u001B[${style[1]}m`
			};
			group[styleName] = styles$1[styleName];
			codes.set(style[0], style[1]);
		}
		Object.defineProperty(styles$1, groupName, {
			value: group,
			enumerable: false
		});
	}
	Object.defineProperty(styles$1, "codes", {
		value: codes,
		enumerable: false
	});
	styles$1.color.close = "\x1B[39m";
	styles$1.bgColor.close = "\x1B[49m";
	styles$1.color.ansi = wrapAnsi16();
	styles$1.color.ansi256 = wrapAnsi256();
	styles$1.color.ansi16m = wrapAnsi16m();
	styles$1.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
	styles$1.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
	styles$1.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);
	Object.defineProperties(styles$1, {
		rgbToAnsi256: {
			value(red, green, blue) {
				if (red === green && green === blue) {
					if (red < 8) return 16;
					if (red > 248) return 231;
					return Math.round((red - 8) / 247 * 24) + 232;
				}
				return 16 + 36 * Math.round(red / 255 * 5) + 6 * Math.round(green / 255 * 5) + Math.round(blue / 255 * 5);
			},
			enumerable: false
		},
		hexToRgb: {
			value(hex) {
				const matches = /[a-f\d]{6}|[a-f\d]{3}/i.exec(hex.toString(16));
				if (!matches) return [
					0,
					0,
					0
				];
				let [colorString] = matches;
				if (colorString.length === 3) colorString = [...colorString].map((character) => character + character).join("");
				const integer = Number.parseInt(colorString, 16);
				return [
					integer >> 16 & 255,
					integer >> 8 & 255,
					integer & 255
				];
			},
			enumerable: false
		},
		hexToAnsi256: {
			value: (hex) => styles$1.rgbToAnsi256(...styles$1.hexToRgb(hex)),
			enumerable: false
		},
		ansi256ToAnsi: {
			value(code) {
				if (code < 8) return 30 + code;
				if (code < 16) return 90 + (code - 8);
				let red;
				let green;
				let blue;
				if (code >= 232) {
					red = ((code - 232) * 10 + 8) / 255;
					green = red;
					blue = red;
				} else {
					code -= 16;
					const remainder = code % 36;
					red = Math.floor(code / 36) / 5;
					green = Math.floor(remainder / 6) / 5;
					blue = remainder % 6 / 5;
				}
				const value = Math.max(red, green, blue) * 2;
				if (value === 0) return 30;
				let result = 30 + (Math.round(blue) << 2 | Math.round(green) << 1 | Math.round(red));
				if (value === 2) result += 60;
				return result;
			},
			enumerable: false
		},
		rgbToAnsi: {
			value: (red, green, blue) => styles$1.ansi256ToAnsi(styles$1.rgbToAnsi256(red, green, blue)),
			enumerable: false
		},
		hexToAnsi: {
			value: (hex) => styles$1.ansi256ToAnsi(styles$1.hexToAnsi256(hex)),
			enumerable: false
		}
	});
	return styles$1;
}
const ansiStyles = assembleStyles();

//#endregion
//#region ../../node_modules/.pnpm/chalk@5.6.2/node_modules/chalk/source/vendor/supports-color/index.js
function hasFlag(flag, argv = globalThis.Deno ? globalThis.Deno.args : process$1.argv) {
	const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
	const position = argv.indexOf(prefix + flag);
	const terminatorPosition = argv.indexOf("--");
	return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
}
const { env } = process$1;
let flagForceColor;
if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) flagForceColor = 0;
else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) flagForceColor = 1;
function envForceColor() {
	if ("FORCE_COLOR" in env) {
		if (env.FORCE_COLOR === "true") return 1;
		if (env.FORCE_COLOR === "false") return 0;
		return env.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
	}
}
function translateLevel(level) {
	if (level === 0) return false;
	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}
function _supportsColor(haveStream, { streamIsTTY, sniffFlags = true } = {}) {
	const noFlagForceColor = envForceColor();
	if (noFlagForceColor !== void 0) flagForceColor = noFlagForceColor;
	const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;
	if (forceColor === 0) return 0;
	if (sniffFlags) {
		if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) return 3;
		if (hasFlag("color=256")) return 2;
	}
	if ("TF_BUILD" in env && "AGENT_NAME" in env) return 1;
	if (haveStream && !streamIsTTY && forceColor === void 0) return 0;
	const min = forceColor || 0;
	if (env.TERM === "dumb") return min;
	if (process$1.platform === "win32") {
		const osRelease = os.release().split(".");
		if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) return Number(osRelease[2]) >= 14931 ? 3 : 2;
		return 1;
	}
	if ("CI" in env) {
		if ([
			"GITHUB_ACTIONS",
			"GITEA_ACTIONS",
			"CIRCLECI"
		].some((key) => key in env)) return 3;
		if ([
			"TRAVIS",
			"APPVEYOR",
			"GITLAB_CI",
			"BUILDKITE",
			"DRONE"
		].some((sign) => sign in env) || env.CI_NAME === "codeship") return 1;
		return min;
	}
	if ("TEAMCITY_VERSION" in env) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	if (env.COLORTERM === "truecolor") return 3;
	if (env.TERM === "xterm-kitty") return 3;
	if (env.TERM === "xterm-ghostty") return 3;
	if (env.TERM === "wezterm") return 3;
	if ("TERM_PROGRAM" in env) {
		const version = Number.parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
		switch (env.TERM_PROGRAM) {
			case "iTerm.app": return version >= 3 ? 3 : 2;
			case "Apple_Terminal": return 2;
		}
	}
	if (/-256(color)?$/i.test(env.TERM)) return 2;
	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) return 1;
	if ("COLORTERM" in env) return 1;
	return min;
}
function createSupportsColor(stream, options = {}) {
	return translateLevel(_supportsColor(stream, {
		streamIsTTY: stream && stream.isTTY,
		...options
	}));
}
const supportsColor = {
	stdout: createSupportsColor({ isTTY: tty.isatty(1) }),
	stderr: createSupportsColor({ isTTY: tty.isatty(2) })
};

//#endregion
//#region ../../node_modules/.pnpm/chalk@5.6.2/node_modules/chalk/source/utilities.js
function stringReplaceAll(string, substring, replacer) {
	let index = string.indexOf(substring);
	if (index === -1) return string;
	const substringLength = substring.length;
	let endIndex = 0;
	let returnValue = "";
	do {
		returnValue += string.slice(endIndex, index) + substring + replacer;
		endIndex = index + substringLength;
		index = string.indexOf(substring, endIndex);
	} while (index !== -1);
	returnValue += string.slice(endIndex);
	return returnValue;
}
function stringEncaseCRLFWithFirstIndex(string, prefix, postfix, index) {
	let endIndex = 0;
	let returnValue = "";
	do {
		const gotCR = string[index - 1] === "\r";
		returnValue += string.slice(endIndex, gotCR ? index - 1 : index) + prefix + (gotCR ? "\r\n" : "\n") + postfix;
		endIndex = index + 1;
		index = string.indexOf("\n", endIndex);
	} while (index !== -1);
	returnValue += string.slice(endIndex);
	return returnValue;
}

//#endregion
//#region ../../node_modules/.pnpm/chalk@5.6.2/node_modules/chalk/source/index.js
const { stdout: stdoutColor, stderr: stderrColor } = supportsColor;
const GENERATOR = Symbol("GENERATOR");
const STYLER = Symbol("STYLER");
const IS_EMPTY = Symbol("IS_EMPTY");
const levelMapping = [
	"ansi",
	"ansi",
	"ansi256",
	"ansi16m"
];
const styles = Object.create(null);
const applyOptions = (object, options = {}) => {
	if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) throw new Error("The `level` option should be an integer from 0 to 3");
	const colorLevel = stdoutColor ? stdoutColor.level : 0;
	object.level = options.level === void 0 ? colorLevel : options.level;
};
const chalkFactory = (options) => {
	const chalk = (...strings) => strings.join(" ");
	applyOptions(chalk, options);
	Object.setPrototypeOf(chalk, createChalk.prototype);
	return chalk;
};
function createChalk(options) {
	return chalkFactory(options);
}
Object.setPrototypeOf(createChalk.prototype, Function.prototype);
for (const [styleName, style] of Object.entries(ansiStyles)) styles[styleName] = { get() {
	const builder = createBuilder(this, createStyler(style.open, style.close, this[STYLER]), this[IS_EMPTY]);
	Object.defineProperty(this, styleName, { value: builder });
	return builder;
} };
styles.visible = { get() {
	const builder = createBuilder(this, this[STYLER], true);
	Object.defineProperty(this, "visible", { value: builder });
	return builder;
} };
const getModelAnsi = (model, level, type, ...arguments_) => {
	if (model === "rgb") {
		if (level === "ansi16m") return ansiStyles[type].ansi16m(...arguments_);
		if (level === "ansi256") return ansiStyles[type].ansi256(ansiStyles.rgbToAnsi256(...arguments_));
		return ansiStyles[type].ansi(ansiStyles.rgbToAnsi(...arguments_));
	}
	if (model === "hex") return getModelAnsi("rgb", level, type, ...ansiStyles.hexToRgb(...arguments_));
	return ansiStyles[type][model](...arguments_);
};
for (const model of [
	"rgb",
	"hex",
	"ansi256"
]) {
	styles[model] = { get() {
		const { level } = this;
		return function(...arguments_) {
			const styler = createStyler(getModelAnsi(model, levelMapping[level], "color", ...arguments_), ansiStyles.color.close, this[STYLER]);
			return createBuilder(this, styler, this[IS_EMPTY]);
		};
	} };
	const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
	styles[bgModel] = { get() {
		const { level } = this;
		return function(...arguments_) {
			const styler = createStyler(getModelAnsi(model, levelMapping[level], "bgColor", ...arguments_), ansiStyles.bgColor.close, this[STYLER]);
			return createBuilder(this, styler, this[IS_EMPTY]);
		};
	} };
}
const proto = Object.defineProperties(() => {}, {
	...styles,
	level: {
		enumerable: true,
		get() {
			return this[GENERATOR].level;
		},
		set(level) {
			this[GENERATOR].level = level;
		}
	}
});
const createStyler = (open, close, parent) => {
	let openAll;
	let closeAll;
	if (parent === void 0) {
		openAll = open;
		closeAll = close;
	} else {
		openAll = parent.openAll + open;
		closeAll = close + parent.closeAll;
	}
	return {
		open,
		close,
		openAll,
		closeAll,
		parent
	};
};
const createBuilder = (self, _styler, _isEmpty) => {
	const builder = (...arguments_) => applyStyle(builder, arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "));
	Object.setPrototypeOf(builder, proto);
	builder[GENERATOR] = self;
	builder[STYLER] = _styler;
	builder[IS_EMPTY] = _isEmpty;
	return builder;
};
const applyStyle = (self, string) => {
	if (self.level <= 0 || !string) return self[IS_EMPTY] ? "" : string;
	let styler = self[STYLER];
	if (styler === void 0) return string;
	const { openAll, closeAll } = styler;
	if (string.includes("\x1B")) while (styler !== void 0) {
		string = stringReplaceAll(string, styler.close, styler.open);
		styler = styler.parent;
	}
	const lfIndex = string.indexOf("\n");
	if (lfIndex !== -1) string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
	return openAll + string + closeAll;
};
Object.defineProperties(createChalk.prototype, styles);
const chalk = createChalk();
const chalkStderr = createChalk({ level: stderrColor ? stderrColor.level : 0 });

//#endregion
//#region ../../node_modules/.pnpm/mimic-function@5.0.1/node_modules/mimic-function/index.js
const copyProperty = (to, from, property, ignoreNonConfigurable) => {
	if (property === "length" || property === "prototype") return;
	if (property === "arguments" || property === "caller") return;
	const toDescriptor = Object.getOwnPropertyDescriptor(to, property);
	const fromDescriptor = Object.getOwnPropertyDescriptor(from, property);
	if (!canCopyProperty(toDescriptor, fromDescriptor) && ignoreNonConfigurable) return;
	Object.defineProperty(to, property, fromDescriptor);
};
const canCopyProperty = function(toDescriptor, fromDescriptor) {
	return toDescriptor === void 0 || toDescriptor.configurable || toDescriptor.writable === fromDescriptor.writable && toDescriptor.enumerable === fromDescriptor.enumerable && toDescriptor.configurable === fromDescriptor.configurable && (toDescriptor.writable || toDescriptor.value === fromDescriptor.value);
};
const changePrototype = (to, from) => {
	const fromPrototype = Object.getPrototypeOf(from);
	if (fromPrototype === Object.getPrototypeOf(to)) return;
	Object.setPrototypeOf(to, fromPrototype);
};
const wrappedToString = (withName, fromBody) => `/* Wrapped ${withName}*/\n${fromBody}`;
const toStringDescriptor = Object.getOwnPropertyDescriptor(Function.prototype, "toString");
const toStringName = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name");
const changeToString = (to, from, name) => {
	const withName = name === "" ? "" : `with ${name.trim()}() `;
	const newToString = wrappedToString.bind(null, withName, from.toString());
	Object.defineProperty(newToString, "name", toStringName);
	const { writable, enumerable, configurable } = toStringDescriptor;
	Object.defineProperty(to, "toString", {
		value: newToString,
		writable,
		enumerable,
		configurable
	});
};
function mimicFunction(to, from, { ignoreNonConfigurable = false } = {}) {
	const { name } = to;
	for (const property of Reflect.ownKeys(from)) copyProperty(to, from, property, ignoreNonConfigurable);
	changePrototype(to, from);
	changeToString(to, from, name);
	return to;
}

//#endregion
//#region ../../node_modules/.pnpm/onetime@7.0.0/node_modules/onetime/index.js
const calledFunctions = /* @__PURE__ */ new WeakMap();
const onetime = (function_, options = {}) => {
	if (typeof function_ !== "function") throw new TypeError("Expected a function");
	let returnValue;
	let callCount = 0;
	const functionName = function_.displayName || function_.name || "<anonymous>";
	const onetime = function(...arguments_) {
		calledFunctions.set(onetime, ++callCount);
		if (callCount === 1) {
			returnValue = function_.apply(this, arguments_);
			function_ = void 0;
		} else if (options.throw === true) throw new Error(`Function \`${functionName}\` can only be called once`);
		return returnValue;
	};
	mimicFunction(onetime, function_);
	calledFunctions.set(onetime, callCount);
	return onetime;
};
onetime.callCount = (function_) => {
	if (!calledFunctions.has(function_)) throw new Error(`The given function \`${function_.name}\` is not wrapped by the \`onetime\` package`);
	return calledFunctions.get(function_);
};

//#endregion
//#region ../../node_modules/.pnpm/signal-exit@4.1.0/node_modules/signal-exit/dist/mjs/signals.js
/**
* This is not the set of all possible signals.
*
* It IS, however, the set of all signals that trigger
* an exit on either Linux or BSD systems.  Linux is a
* superset of the signal names supported on BSD, and
* the unknown signals just fail to register, so we can
* catch that easily enough.
*
* Windows signals are a different set, since there are
* signals that terminate Windows processes, but don't
* terminate (or don't even exist) on Posix systems.
*
* Don't bother with SIGKILL.  It's uncatchable, which
* means that we can't fire any callbacks anyway.
*
* If a user does happen to register a handler on a non-
* fatal signal like SIGWINCH or something, and then
* exit, it'll end up firing `process.emit('exit')`, so
* the handler will be fired anyway.
*
* SIGBUS, SIGFPE, SIGSEGV and SIGILL, when not raised
* artificially, inherently leave the process in a
* state from which it is not safe to try and enter JS
* listeners.
*/
const signals = [];
signals.push("SIGHUP", "SIGINT", "SIGTERM");
if (process.platform !== "win32") signals.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
if (process.platform === "linux") signals.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");

//#endregion
//#region ../../node_modules/.pnpm/signal-exit@4.1.0/node_modules/signal-exit/dist/mjs/index.js
const processOk = (process) => !!process && typeof process === "object" && typeof process.removeListener === "function" && typeof process.emit === "function" && typeof process.reallyExit === "function" && typeof process.listeners === "function" && typeof process.kill === "function" && typeof process.pid === "number" && typeof process.on === "function";
const kExitEmitter = Symbol.for("signal-exit emitter");
const global = globalThis;
const ObjectDefineProperty = Object.defineProperty.bind(Object);
var Emitter = class {
	emitted = {
		afterExit: false,
		exit: false
	};
	listeners = {
		afterExit: [],
		exit: []
	};
	count = 0;
	id = Math.random();
	constructor() {
		if (global[kExitEmitter]) return global[kExitEmitter];
		ObjectDefineProperty(global, kExitEmitter, {
			value: this,
			writable: false,
			enumerable: false,
			configurable: false
		});
	}
	on(ev, fn) {
		this.listeners[ev].push(fn);
	}
	removeListener(ev, fn) {
		const list = this.listeners[ev];
		const i = list.indexOf(fn);
		/* c8 ignore start */
		if (i === -1) return;
		/* c8 ignore stop */
		if (i === 0 && list.length === 1) list.length = 0;
		else list.splice(i, 1);
	}
	emit(ev, code, signal) {
		if (this.emitted[ev]) return false;
		this.emitted[ev] = true;
		let ret = false;
		for (const fn of this.listeners[ev]) ret = fn(code, signal) === true || ret;
		if (ev === "exit") ret = this.emit("afterExit", code, signal) || ret;
		return ret;
	}
};
var SignalExitBase = class {};
const signalExitWrap = (handler) => {
	return {
		onExit(cb, opts) {
			return handler.onExit(cb, opts);
		},
		load() {
			return handler.load();
		},
		unload() {
			return handler.unload();
		}
	};
};
var SignalExitFallback = class extends SignalExitBase {
	onExit() {
		return () => {};
	}
	load() {}
	unload() {}
};
var SignalExit = class extends SignalExitBase {
	/* c8 ignore start */
	#hupSig = process$2.platform === "win32" ? "SIGINT" : "SIGHUP";
	/* c8 ignore stop */
	#emitter = new Emitter();
	#process;
	#originalProcessEmit;
	#originalProcessReallyExit;
	#sigListeners = {};
	#loaded = false;
	constructor(process) {
		super();
		this.#process = process;
		this.#sigListeners = {};
		for (const sig of signals) this.#sigListeners[sig] = () => {
			const listeners = this.#process.listeners(sig);
			let { count } = this.#emitter;
			/* c8 ignore start */
			const p = process;
			if (typeof p.__signal_exit_emitter__ === "object" && typeof p.__signal_exit_emitter__.count === "number") count += p.__signal_exit_emitter__.count;
			/* c8 ignore stop */
			if (listeners.length === count) {
				this.unload();
				const ret = this.#emitter.emit("exit", null, sig);
				/* c8 ignore start */
				const s = sig === "SIGHUP" ? this.#hupSig : sig;
				if (!ret) process.kill(process.pid, s);
			}
		};
		this.#originalProcessReallyExit = process.reallyExit;
		this.#originalProcessEmit = process.emit;
	}
	onExit(cb, opts) {
		/* c8 ignore start */
		if (!processOk(this.#process)) return () => {};
		/* c8 ignore stop */
		if (this.#loaded === false) this.load();
		const ev = opts?.alwaysLast ? "afterExit" : "exit";
		this.#emitter.on(ev, cb);
		return () => {
			this.#emitter.removeListener(ev, cb);
			if (this.#emitter.listeners["exit"].length === 0 && this.#emitter.listeners["afterExit"].length === 0) this.unload();
		};
	}
	load() {
		if (this.#loaded) return;
		this.#loaded = true;
		this.#emitter.count += 1;
		for (const sig of signals) try {
			const fn = this.#sigListeners[sig];
			if (fn) this.#process.on(sig, fn);
		} catch (_) {}
		this.#process.emit = (ev, ...a) => {
			return this.#processEmit(ev, ...a);
		};
		this.#process.reallyExit = (code) => {
			return this.#processReallyExit(code);
		};
	}
	unload() {
		if (!this.#loaded) return;
		this.#loaded = false;
		signals.forEach((sig) => {
			const listener = this.#sigListeners[sig];
			/* c8 ignore start */
			if (!listener) throw new Error("Listener not defined for signal: " + sig);
			/* c8 ignore stop */
			try {
				this.#process.removeListener(sig, listener);
			} catch (_) {}
			/* c8 ignore stop */
		});
		this.#process.emit = this.#originalProcessEmit;
		this.#process.reallyExit = this.#originalProcessReallyExit;
		this.#emitter.count -= 1;
	}
	#processReallyExit(code) {
		/* c8 ignore start */
		if (!processOk(this.#process)) return 0;
		this.#process.exitCode = code || 0;
		/* c8 ignore stop */
		this.#emitter.emit("exit", this.#process.exitCode, null);
		return this.#originalProcessReallyExit.call(this.#process, this.#process.exitCode);
	}
	#processEmit(ev, ...args) {
		const og = this.#originalProcessEmit;
		if (ev === "exit" && processOk(this.#process)) {
			if (typeof args[0] === "number") this.#process.exitCode = args[0];
			/* c8 ignore start */
			const ret = og.call(this.#process, ev, ...args);
			/* c8 ignore start */
			this.#emitter.emit("exit", this.#process.exitCode, null);
			/* c8 ignore stop */
			return ret;
		} else return og.call(this.#process, ev, ...args);
	}
};
const process$2 = globalThis.process;
const { onExit, load, unload } = signalExitWrap(processOk(process$2) ? new SignalExit(process$2) : new SignalExitFallback());

//#endregion
//#region ../../node_modules/.pnpm/restore-cursor@5.1.0/node_modules/restore-cursor/index.js
const terminal = process$1.stderr.isTTY ? process$1.stderr : process$1.stdout.isTTY ? process$1.stdout : void 0;
const restoreCursor = terminal ? onetime(() => {
	onExit(() => {
		terminal.write("\x1B[?25h");
	}, { alwaysLast: true });
}) : () => {};

//#endregion
//#region ../../node_modules/.pnpm/cli-cursor@5.0.0/node_modules/cli-cursor/index.js
let isHidden = false;
const cliCursor = {};
cliCursor.show = (writableStream = process$1.stderr) => {
	if (!writableStream.isTTY) return;
	isHidden = false;
	writableStream.write("\x1B[?25h");
};
cliCursor.hide = (writableStream = process$1.stderr) => {
	if (!writableStream.isTTY) return;
	restoreCursor();
	isHidden = true;
	writableStream.write("\x1B[?25l");
};
cliCursor.toggle = (force, writableStream) => {
	if (force !== void 0) isHidden = force;
	if (isHidden) cliCursor.show(writableStream);
	else cliCursor.hide(writableStream);
};

//#endregion
//#region ../../node_modules/.pnpm/cli-spinners@3.4.0/node_modules/cli-spinners/spinners.json
var spinners_default = {
	dots: {
		"interval": 80,
		"frames": [
			"⠋",
			"⠙",
			"⠹",
			"⠸",
			"⠼",
			"⠴",
			"⠦",
			"⠧",
			"⠇",
			"⠏"
		]
	},
	dots2: {
		"interval": 80,
		"frames": [
			"⣾",
			"⣽",
			"⣻",
			"⢿",
			"⡿",
			"⣟",
			"⣯",
			"⣷"
		]
	},
	dots3: {
		"interval": 80,
		"frames": [
			"⠋",
			"⠙",
			"⠚",
			"⠞",
			"⠖",
			"⠦",
			"⠴",
			"⠲",
			"⠳",
			"⠓"
		]
	},
	dots4: {
		"interval": 80,
		"frames": [
			"⠄",
			"⠆",
			"⠇",
			"⠋",
			"⠙",
			"⠸",
			"⠰",
			"⠠",
			"⠰",
			"⠸",
			"⠙",
			"⠋",
			"⠇",
			"⠆"
		]
	},
	dots5: {
		"interval": 80,
		"frames": [
			"⠋",
			"⠙",
			"⠚",
			"⠒",
			"⠂",
			"⠂",
			"⠒",
			"⠲",
			"⠴",
			"⠦",
			"⠖",
			"⠒",
			"⠐",
			"⠐",
			"⠒",
			"⠓",
			"⠋"
		]
	},
	dots6: {
		"interval": 80,
		"frames": [
			"⠁",
			"⠉",
			"⠙",
			"⠚",
			"⠒",
			"⠂",
			"⠂",
			"⠒",
			"⠲",
			"⠴",
			"⠤",
			"⠄",
			"⠄",
			"⠤",
			"⠴",
			"⠲",
			"⠒",
			"⠂",
			"⠂",
			"⠒",
			"⠚",
			"⠙",
			"⠉",
			"⠁"
		]
	},
	dots7: {
		"interval": 80,
		"frames": [
			"⠈",
			"⠉",
			"⠋",
			"⠓",
			"⠒",
			"⠐",
			"⠐",
			"⠒",
			"⠖",
			"⠦",
			"⠤",
			"⠠",
			"⠠",
			"⠤",
			"⠦",
			"⠖",
			"⠒",
			"⠐",
			"⠐",
			"⠒",
			"⠓",
			"⠋",
			"⠉",
			"⠈"
		]
	},
	dots8: {
		"interval": 80,
		"frames": [
			"⠁",
			"⠁",
			"⠉",
			"⠙",
			"⠚",
			"⠒",
			"⠂",
			"⠂",
			"⠒",
			"⠲",
			"⠴",
			"⠤",
			"⠄",
			"⠄",
			"⠤",
			"⠠",
			"⠠",
			"⠤",
			"⠦",
			"⠖",
			"⠒",
			"⠐",
			"⠐",
			"⠒",
			"⠓",
			"⠋",
			"⠉",
			"⠈",
			"⠈"
		]
	},
	dots9: {
		"interval": 80,
		"frames": [
			"⢹",
			"⢺",
			"⢼",
			"⣸",
			"⣇",
			"⡧",
			"⡗",
			"⡏"
		]
	},
	dots10: {
		"interval": 80,
		"frames": [
			"⢄",
			"⢂",
			"⢁",
			"⡁",
			"⡈",
			"⡐",
			"⡠"
		]
	},
	dots11: {
		"interval": 100,
		"frames": [
			"⠁",
			"⠂",
			"⠄",
			"⡀",
			"⢀",
			"⠠",
			"⠐",
			"⠈"
		]
	},
	dots12: {
		"interval": 80,
		"frames": [
			"⢀⠀",
			"⡀⠀",
			"⠄⠀",
			"⢂⠀",
			"⡂⠀",
			"⠅⠀",
			"⢃⠀",
			"⡃⠀",
			"⠍⠀",
			"⢋⠀",
			"⡋⠀",
			"⠍⠁",
			"⢋⠁",
			"⡋⠁",
			"⠍⠉",
			"⠋⠉",
			"⠋⠉",
			"⠉⠙",
			"⠉⠙",
			"⠉⠩",
			"⠈⢙",
			"⠈⡙",
			"⢈⠩",
			"⡀⢙",
			"⠄⡙",
			"⢂⠩",
			"⡂⢘",
			"⠅⡘",
			"⢃⠨",
			"⡃⢐",
			"⠍⡐",
			"⢋⠠",
			"⡋⢀",
			"⠍⡁",
			"⢋⠁",
			"⡋⠁",
			"⠍⠉",
			"⠋⠉",
			"⠋⠉",
			"⠉⠙",
			"⠉⠙",
			"⠉⠩",
			"⠈⢙",
			"⠈⡙",
			"⠈⠩",
			"⠀⢙",
			"⠀⡙",
			"⠀⠩",
			"⠀⢘",
			"⠀⡘",
			"⠀⠨",
			"⠀⢐",
			"⠀⡐",
			"⠀⠠",
			"⠀⢀",
			"⠀⡀"
		]
	},
	dots13: {
		"interval": 80,
		"frames": [
			"⣼",
			"⣹",
			"⢻",
			"⠿",
			"⡟",
			"⣏",
			"⣧",
			"⣶"
		]
	},
	dots14: {
		"interval": 80,
		"frames": [
			"⠉⠉",
			"⠈⠙",
			"⠀⠹",
			"⠀⢸",
			"⠀⣰",
			"⢀⣠",
			"⣀⣀",
			"⣄⡀",
			"⣆⠀",
			"⡇⠀",
			"⠏⠀",
			"⠋⠁"
		]
	},
	dots8Bit: {
		"interval": 80,
		"frames": [
			"⠀",
			"⠁",
			"⠂",
			"⠃",
			"⠄",
			"⠅",
			"⠆",
			"⠇",
			"⡀",
			"⡁",
			"⡂",
			"⡃",
			"⡄",
			"⡅",
			"⡆",
			"⡇",
			"⠈",
			"⠉",
			"⠊",
			"⠋",
			"⠌",
			"⠍",
			"⠎",
			"⠏",
			"⡈",
			"⡉",
			"⡊",
			"⡋",
			"⡌",
			"⡍",
			"⡎",
			"⡏",
			"⠐",
			"⠑",
			"⠒",
			"⠓",
			"⠔",
			"⠕",
			"⠖",
			"⠗",
			"⡐",
			"⡑",
			"⡒",
			"⡓",
			"⡔",
			"⡕",
			"⡖",
			"⡗",
			"⠘",
			"⠙",
			"⠚",
			"⠛",
			"⠜",
			"⠝",
			"⠞",
			"⠟",
			"⡘",
			"⡙",
			"⡚",
			"⡛",
			"⡜",
			"⡝",
			"⡞",
			"⡟",
			"⠠",
			"⠡",
			"⠢",
			"⠣",
			"⠤",
			"⠥",
			"⠦",
			"⠧",
			"⡠",
			"⡡",
			"⡢",
			"⡣",
			"⡤",
			"⡥",
			"⡦",
			"⡧",
			"⠨",
			"⠩",
			"⠪",
			"⠫",
			"⠬",
			"⠭",
			"⠮",
			"⠯",
			"⡨",
			"⡩",
			"⡪",
			"⡫",
			"⡬",
			"⡭",
			"⡮",
			"⡯",
			"⠰",
			"⠱",
			"⠲",
			"⠳",
			"⠴",
			"⠵",
			"⠶",
			"⠷",
			"⡰",
			"⡱",
			"⡲",
			"⡳",
			"⡴",
			"⡵",
			"⡶",
			"⡷",
			"⠸",
			"⠹",
			"⠺",
			"⠻",
			"⠼",
			"⠽",
			"⠾",
			"⠿",
			"⡸",
			"⡹",
			"⡺",
			"⡻",
			"⡼",
			"⡽",
			"⡾",
			"⡿",
			"⢀",
			"⢁",
			"⢂",
			"⢃",
			"⢄",
			"⢅",
			"⢆",
			"⢇",
			"⣀",
			"⣁",
			"⣂",
			"⣃",
			"⣄",
			"⣅",
			"⣆",
			"⣇",
			"⢈",
			"⢉",
			"⢊",
			"⢋",
			"⢌",
			"⢍",
			"⢎",
			"⢏",
			"⣈",
			"⣉",
			"⣊",
			"⣋",
			"⣌",
			"⣍",
			"⣎",
			"⣏",
			"⢐",
			"⢑",
			"⢒",
			"⢓",
			"⢔",
			"⢕",
			"⢖",
			"⢗",
			"⣐",
			"⣑",
			"⣒",
			"⣓",
			"⣔",
			"⣕",
			"⣖",
			"⣗",
			"⢘",
			"⢙",
			"⢚",
			"⢛",
			"⢜",
			"⢝",
			"⢞",
			"⢟",
			"⣘",
			"⣙",
			"⣚",
			"⣛",
			"⣜",
			"⣝",
			"⣞",
			"⣟",
			"⢠",
			"⢡",
			"⢢",
			"⢣",
			"⢤",
			"⢥",
			"⢦",
			"⢧",
			"⣠",
			"⣡",
			"⣢",
			"⣣",
			"⣤",
			"⣥",
			"⣦",
			"⣧",
			"⢨",
			"⢩",
			"⢪",
			"⢫",
			"⢬",
			"⢭",
			"⢮",
			"⢯",
			"⣨",
			"⣩",
			"⣪",
			"⣫",
			"⣬",
			"⣭",
			"⣮",
			"⣯",
			"⢰",
			"⢱",
			"⢲",
			"⢳",
			"⢴",
			"⢵",
			"⢶",
			"⢷",
			"⣰",
			"⣱",
			"⣲",
			"⣳",
			"⣴",
			"⣵",
			"⣶",
			"⣷",
			"⢸",
			"⢹",
			"⢺",
			"⢻",
			"⢼",
			"⢽",
			"⢾",
			"⢿",
			"⣸",
			"⣹",
			"⣺",
			"⣻",
			"⣼",
			"⣽",
			"⣾",
			"⣿"
		]
	},
	dotsCircle: {
		"interval": 80,
		"frames": [
			"⢎ ",
			"⠎⠁",
			"⠊⠑",
			"⠈⠱",
			" ⡱",
			"⢀⡰",
			"⢄⡠",
			"⢆⡀"
		]
	},
	sand: {
		"interval": 80,
		"frames": [
			"⠁",
			"⠂",
			"⠄",
			"⡀",
			"⡈",
			"⡐",
			"⡠",
			"⣀",
			"⣁",
			"⣂",
			"⣄",
			"⣌",
			"⣔",
			"⣤",
			"⣥",
			"⣦",
			"⣮",
			"⣶",
			"⣷",
			"⣿",
			"⡿",
			"⠿",
			"⢟",
			"⠟",
			"⡛",
			"⠛",
			"⠫",
			"⢋",
			"⠋",
			"⠍",
			"⡉",
			"⠉",
			"⠑",
			"⠡",
			"⢁"
		]
	},
	line: {
		"interval": 130,
		"frames": [
			"-",
			"\\",
			"|",
			"/"
		]
	},
	line2: {
		"interval": 100,
		"frames": [
			"⠂",
			"-",
			"–",
			"—",
			"–",
			"-"
		]
	},
	rollingLine: {
		"interval": 80,
		"frames": [
			"/  ",
			" - ",
			" \\ ",
			"  |",
			"  |",
			" \\ ",
			" - ",
			"/  "
		]
	},
	pipe: {
		"interval": 100,
		"frames": [
			"┤",
			"┘",
			"┴",
			"└",
			"├",
			"┌",
			"┬",
			"┐"
		]
	},
	simpleDots: {
		"interval": 400,
		"frames": [
			".  ",
			".. ",
			"...",
			"   "
		]
	},
	simpleDotsScrolling: {
		"interval": 200,
		"frames": [
			".  ",
			".. ",
			"...",
			" ..",
			"  .",
			"   "
		]
	},
	star: {
		"interval": 70,
		"frames": [
			"✶",
			"✸",
			"✹",
			"✺",
			"✹",
			"✷"
		]
	},
	star2: {
		"interval": 80,
		"frames": [
			"+",
			"x",
			"*"
		]
	},
	flip: {
		"interval": 70,
		"frames": [
			"_",
			"_",
			"_",
			"-",
			"`",
			"`",
			"'",
			"´",
			"-",
			"_",
			"_",
			"_"
		]
	},
	hamburger: {
		"interval": 100,
		"frames": [
			"☱",
			"☲",
			"☴"
		]
	},
	growVertical: {
		"interval": 120,
		"frames": [
			"▁",
			"▃",
			"▄",
			"▅",
			"▆",
			"▇",
			"▆",
			"▅",
			"▄",
			"▃"
		]
	},
	growHorizontal: {
		"interval": 120,
		"frames": [
			"▏",
			"▎",
			"▍",
			"▌",
			"▋",
			"▊",
			"▉",
			"▊",
			"▋",
			"▌",
			"▍",
			"▎"
		]
	},
	balloon: {
		"interval": 140,
		"frames": [
			" ",
			".",
			"o",
			"O",
			"@",
			"*",
			" "
		]
	},
	balloon2: {
		"interval": 120,
		"frames": [
			".",
			"o",
			"O",
			"°",
			"O",
			"o",
			"."
		]
	},
	noise: {
		"interval": 100,
		"frames": [
			"▓",
			"▒",
			"░"
		]
	},
	bounce: {
		"interval": 120,
		"frames": [
			"⠁",
			"⠂",
			"⠄",
			"⠂"
		]
	},
	boxBounce: {
		"interval": 120,
		"frames": [
			"▖",
			"▘",
			"▝",
			"▗"
		]
	},
	boxBounce2: {
		"interval": 100,
		"frames": [
			"▌",
			"▀",
			"▐",
			"▄"
		]
	},
	triangle: {
		"interval": 50,
		"frames": [
			"◢",
			"◣",
			"◤",
			"◥"
		]
	},
	binary: {
		"interval": 80,
		"frames": [
			"010010",
			"001100",
			"100101",
			"111010",
			"111101",
			"010111",
			"101011",
			"111000",
			"110011",
			"110101"
		]
	},
	arc: {
		"interval": 100,
		"frames": [
			"◜",
			"◠",
			"◝",
			"◞",
			"◡",
			"◟"
		]
	},
	circle: {
		"interval": 120,
		"frames": [
			"◡",
			"⊙",
			"◠"
		]
	},
	squareCorners: {
		"interval": 180,
		"frames": [
			"◰",
			"◳",
			"◲",
			"◱"
		]
	},
	circleQuarters: {
		"interval": 120,
		"frames": [
			"◴",
			"◷",
			"◶",
			"◵"
		]
	},
	circleHalves: {
		"interval": 50,
		"frames": [
			"◐",
			"◓",
			"◑",
			"◒"
		]
	},
	squish: {
		"interval": 100,
		"frames": ["╫", "╪"]
	},
	toggle: {
		"interval": 250,
		"frames": ["⊶", "⊷"]
	},
	toggle2: {
		"interval": 80,
		"frames": ["▫", "▪"]
	},
	toggle3: {
		"interval": 120,
		"frames": ["□", "■"]
	},
	toggle4: {
		"interval": 100,
		"frames": [
			"■",
			"□",
			"▪",
			"▫"
		]
	},
	toggle5: {
		"interval": 100,
		"frames": ["▮", "▯"]
	},
	toggle6: {
		"interval": 300,
		"frames": ["ဝ", "၀"]
	},
	toggle7: {
		"interval": 80,
		"frames": ["⦾", "⦿"]
	},
	toggle8: {
		"interval": 100,
		"frames": ["◍", "◌"]
	},
	toggle9: {
		"interval": 100,
		"frames": ["◉", "◎"]
	},
	toggle10: {
		"interval": 100,
		"frames": [
			"㊂",
			"㊀",
			"㊁"
		]
	},
	toggle11: {
		"interval": 50,
		"frames": ["⧇", "⧆"]
	},
	toggle12: {
		"interval": 120,
		"frames": ["☗", "☖"]
	},
	toggle13: {
		"interval": 80,
		"frames": [
			"=",
			"*",
			"-"
		]
	},
	arrow: {
		"interval": 100,
		"frames": [
			"←",
			"↖",
			"↑",
			"↗",
			"→",
			"↘",
			"↓",
			"↙"
		]
	},
	arrow2: {
		"interval": 80,
		"frames": [
			"⬆️ ",
			"↗️ ",
			"➡️ ",
			"↘️ ",
			"⬇️ ",
			"↙️ ",
			"⬅️ ",
			"↖️ "
		]
	},
	arrow3: {
		"interval": 120,
		"frames": [
			"▹▹▹▹▹",
			"▸▹▹▹▹",
			"▹▸▹▹▹",
			"▹▹▸▹▹",
			"▹▹▹▸▹",
			"▹▹▹▹▸"
		]
	},
	bouncingBar: {
		"interval": 80,
		"frames": [
			"[    ]",
			"[=   ]",
			"[==  ]",
			"[=== ]",
			"[====]",
			"[ ===]",
			"[  ==]",
			"[   =]",
			"[    ]",
			"[   =]",
			"[  ==]",
			"[ ===]",
			"[====]",
			"[=== ]",
			"[==  ]",
			"[=   ]"
		]
	},
	bouncingBall: {
		"interval": 80,
		"frames": [
			"( ●    )",
			"(  ●   )",
			"(   ●  )",
			"(    ● )",
			"(     ●)",
			"(    ● )",
			"(   ●  )",
			"(  ●   )",
			"( ●    )",
			"(●     )"
		]
	},
	smiley: {
		"interval": 200,
		"frames": ["😄 ", "😝 "]
	},
	monkey: {
		"interval": 300,
		"frames": [
			"🙈 ",
			"🙈 ",
			"🙉 ",
			"🙊 "
		]
	},
	hearts: {
		"interval": 100,
		"frames": [
			"💛 ",
			"💙 ",
			"💜 ",
			"💚 ",
			"💗 "
		]
	},
	clock: {
		"interval": 100,
		"frames": [
			"🕛 ",
			"🕐 ",
			"🕑 ",
			"🕒 ",
			"🕓 ",
			"🕔 ",
			"🕕 ",
			"🕖 ",
			"🕗 ",
			"🕘 ",
			"🕙 ",
			"🕚 "
		]
	},
	earth: {
		"interval": 180,
		"frames": [
			"🌍 ",
			"🌎 ",
			"🌏 "
		]
	},
	material: {
		"interval": 17,
		"frames": [
			"█▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
			"██▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
			"███▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
			"████▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
			"██████▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
			"██████▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
			"███████▁▁▁▁▁▁▁▁▁▁▁▁▁",
			"████████▁▁▁▁▁▁▁▁▁▁▁▁",
			"█████████▁▁▁▁▁▁▁▁▁▁▁",
			"█████████▁▁▁▁▁▁▁▁▁▁▁",
			"██████████▁▁▁▁▁▁▁▁▁▁",
			"███████████▁▁▁▁▁▁▁▁▁",
			"█████████████▁▁▁▁▁▁▁",
			"██████████████▁▁▁▁▁▁",
			"██████████████▁▁▁▁▁▁",
			"▁██████████████▁▁▁▁▁",
			"▁██████████████▁▁▁▁▁",
			"▁██████████████▁▁▁▁▁",
			"▁▁██████████████▁▁▁▁",
			"▁▁▁██████████████▁▁▁",
			"▁▁▁▁█████████████▁▁▁",
			"▁▁▁▁██████████████▁▁",
			"▁▁▁▁██████████████▁▁",
			"▁▁▁▁▁██████████████▁",
			"▁▁▁▁▁██████████████▁",
			"▁▁▁▁▁██████████████▁",
			"▁▁▁▁▁▁██████████████",
			"▁▁▁▁▁▁██████████████",
			"▁▁▁▁▁▁▁█████████████",
			"▁▁▁▁▁▁▁█████████████",
			"▁▁▁▁▁▁▁▁████████████",
			"▁▁▁▁▁▁▁▁████████████",
			"▁▁▁▁▁▁▁▁▁███████████",
			"▁▁▁▁▁▁▁▁▁███████████",
			"▁▁▁▁▁▁▁▁▁▁██████████",
			"▁▁▁▁▁▁▁▁▁▁██████████",
			"▁▁▁▁▁▁▁▁▁▁▁▁████████",
			"▁▁▁▁▁▁▁▁▁▁▁▁▁███████",
			"▁▁▁▁▁▁▁▁▁▁▁▁▁▁██████",
			"▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█████",
			"▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█████",
			"█▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████",
			"██▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁███",
			"██▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁███",
			"███▁▁▁▁▁▁▁▁▁▁▁▁▁▁███",
			"████▁▁▁▁▁▁▁▁▁▁▁▁▁▁██",
			"█████▁▁▁▁▁▁▁▁▁▁▁▁▁▁█",
			"█████▁▁▁▁▁▁▁▁▁▁▁▁▁▁█",
			"██████▁▁▁▁▁▁▁▁▁▁▁▁▁█",
			"████████▁▁▁▁▁▁▁▁▁▁▁▁",
			"█████████▁▁▁▁▁▁▁▁▁▁▁",
			"█████████▁▁▁▁▁▁▁▁▁▁▁",
			"█████████▁▁▁▁▁▁▁▁▁▁▁",
			"█████████▁▁▁▁▁▁▁▁▁▁▁",
			"███████████▁▁▁▁▁▁▁▁▁",
			"████████████▁▁▁▁▁▁▁▁",
			"████████████▁▁▁▁▁▁▁▁",
			"██████████████▁▁▁▁▁▁",
			"██████████████▁▁▁▁▁▁",
			"▁██████████████▁▁▁▁▁",
			"▁██████████████▁▁▁▁▁",
			"▁▁▁█████████████▁▁▁▁",
			"▁▁▁▁▁████████████▁▁▁",
			"▁▁▁▁▁████████████▁▁▁",
			"▁▁▁▁▁▁███████████▁▁▁",
			"▁▁▁▁▁▁▁▁█████████▁▁▁",
			"▁▁▁▁▁▁▁▁█████████▁▁▁",
			"▁▁▁▁▁▁▁▁▁█████████▁▁",
			"▁▁▁▁▁▁▁▁▁█████████▁▁",
			"▁▁▁▁▁▁▁▁▁▁█████████▁",
			"▁▁▁▁▁▁▁▁▁▁▁████████▁",
			"▁▁▁▁▁▁▁▁▁▁▁████████▁",
			"▁▁▁▁▁▁▁▁▁▁▁▁███████▁",
			"▁▁▁▁▁▁▁▁▁▁▁▁███████▁",
			"▁▁▁▁▁▁▁▁▁▁▁▁▁███████",
			"▁▁▁▁▁▁▁▁▁▁▁▁▁███████",
			"▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█████",
			"▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████",
			"▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████",
			"▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████",
			"▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁███",
			"▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁███",
			"▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁██",
			"▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁██",
			"▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁██",
			"▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█",
			"▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█",
			"▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█",
			"▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
			"▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
			"▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
			"▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁"
		]
	},
	moon: {
		"interval": 80,
		"frames": [
			"🌑 ",
			"🌒 ",
			"🌓 ",
			"🌔 ",
			"🌕 ",
			"🌖 ",
			"🌗 ",
			"🌘 "
		]
	},
	runner: {
		"interval": 140,
		"frames": ["🚶 ", "🏃 "]
	},
	pong: {
		"interval": 80,
		"frames": [
			"▐⠂       ▌",
			"▐⠈       ▌",
			"▐ ⠂      ▌",
			"▐ ⠠      ▌",
			"▐  ⡀     ▌",
			"▐  ⠠     ▌",
			"▐   ⠂    ▌",
			"▐   ⠈    ▌",
			"▐    ⠂   ▌",
			"▐    ⠠   ▌",
			"▐     ⡀  ▌",
			"▐     ⠠  ▌",
			"▐      ⠂ ▌",
			"▐      ⠈ ▌",
			"▐       ⠂▌",
			"▐       ⠠▌",
			"▐       ⡀▌",
			"▐      ⠠ ▌",
			"▐      ⠂ ▌",
			"▐     ⠈  ▌",
			"▐     ⠂  ▌",
			"▐    ⠠   ▌",
			"▐    ⡀   ▌",
			"▐   ⠠    ▌",
			"▐   ⠂    ▌",
			"▐  ⠈     ▌",
			"▐  ⠂     ▌",
			"▐ ⠠      ▌",
			"▐ ⡀      ▌",
			"▐⠠       ▌"
		]
	},
	shark: {
		"interval": 120,
		"frames": [
			"▐|\\____________▌",
			"▐_|\\___________▌",
			"▐__|\\__________▌",
			"▐___|\\_________▌",
			"▐____|\\________▌",
			"▐_____|\\_______▌",
			"▐______|\\______▌",
			"▐_______|\\_____▌",
			"▐________|\\____▌",
			"▐_________|\\___▌",
			"▐__________|\\__▌",
			"▐___________|\\_▌",
			"▐____________|\\▌",
			"▐____________/|▌",
			"▐___________/|_▌",
			"▐__________/|__▌",
			"▐_________/|___▌",
			"▐________/|____▌",
			"▐_______/|_____▌",
			"▐______/|______▌",
			"▐_____/|_______▌",
			"▐____/|________▌",
			"▐___/|_________▌",
			"▐__/|__________▌",
			"▐_/|___________▌",
			"▐/|____________▌"
		]
	},
	dqpb: {
		"interval": 100,
		"frames": [
			"d",
			"q",
			"p",
			"b"
		]
	},
	weather: {
		"interval": 100,
		"frames": [
			"☀️ ",
			"☀️ ",
			"☀️ ",
			"🌤 ",
			"⛅️ ",
			"🌥 ",
			"☁️ ",
			"🌧 ",
			"🌨 ",
			"🌧 ",
			"🌨 ",
			"🌧 ",
			"🌨 ",
			"⛈ ",
			"🌨 ",
			"🌧 ",
			"🌨 ",
			"☁️ ",
			"🌥 ",
			"⛅️ ",
			"🌤 ",
			"☀️ ",
			"☀️ "
		]
	},
	christmas: {
		"interval": 400,
		"frames": ["🌲", "🎄"]
	},
	grenade: {
		"interval": 80,
		"frames": [
			"،  ",
			"′  ",
			" ´ ",
			" ‾ ",
			"  ⸌",
			"  ⸊",
			"  |",
			"  ⁎",
			"  ⁕",
			" ෴ ",
			"  ⁓",
			"   ",
			"   ",
			"   "
		]
	},
	point: {
		"interval": 125,
		"frames": [
			"∙∙∙",
			"●∙∙",
			"∙●∙",
			"∙∙●",
			"∙∙∙"
		]
	},
	layer: {
		"interval": 150,
		"frames": [
			"-",
			"=",
			"≡"
		]
	},
	betaWave: {
		"interval": 80,
		"frames": [
			"ρββββββ",
			"βρβββββ",
			"ββρββββ",
			"βββρβββ",
			"ββββρββ",
			"βββββρβ",
			"ββββββρ"
		]
	},
	fingerDance: {
		"interval": 160,
		"frames": [
			"🤘 ",
			"🤟 ",
			"🖖 ",
			"✋ ",
			"🤚 ",
			"👆 "
		]
	},
	fistBump: {
		"interval": 80,
		"frames": [
			"🤜　　　　🤛 ",
			"🤜　　　　🤛 ",
			"🤜　　　　🤛 ",
			"　🤜　　🤛　 ",
			"　　🤜🤛　　 ",
			"　🤜✨🤛　　 ",
			"🤜　✨　🤛　 "
		]
	},
	soccerHeader: {
		"interval": 80,
		"frames": [
			" 🧑⚽️       🧑 ",
			"🧑  ⚽️      🧑 ",
			"🧑   ⚽️     🧑 ",
			"🧑    ⚽️    🧑 ",
			"🧑     ⚽️   🧑 ",
			"🧑      ⚽️  🧑 ",
			"🧑       ⚽️🧑  ",
			"🧑      ⚽️  🧑 ",
			"🧑     ⚽️   🧑 ",
			"🧑    ⚽️    🧑 ",
			"🧑   ⚽️     🧑 ",
			"🧑  ⚽️      🧑 "
		]
	},
	mindblown: {
		"interval": 160,
		"frames": [
			"😐 ",
			"😐 ",
			"😮 ",
			"😮 ",
			"😦 ",
			"😦 ",
			"😧 ",
			"😧 ",
			"🤯 ",
			"💥 ",
			"✨ ",
			"　 ",
			"　 ",
			"　 "
		]
	},
	speaker: {
		"interval": 160,
		"frames": [
			"🔈 ",
			"🔉 ",
			"🔊 ",
			"🔉 "
		]
	},
	orangePulse: {
		"interval": 100,
		"frames": [
			"🔸 ",
			"🔶 ",
			"🟠 ",
			"🟠 ",
			"🔶 "
		]
	},
	bluePulse: {
		"interval": 100,
		"frames": [
			"🔹 ",
			"🔷 ",
			"🔵 ",
			"🔵 ",
			"🔷 "
		]
	},
	orangeBluePulse: {
		"interval": 100,
		"frames": [
			"🔸 ",
			"🔶 ",
			"🟠 ",
			"🟠 ",
			"🔶 ",
			"🔹 ",
			"🔷 ",
			"🔵 ",
			"🔵 ",
			"🔷 "
		]
	},
	timeTravel: {
		"interval": 100,
		"frames": [
			"🕛 ",
			"🕚 ",
			"🕙 ",
			"🕘 ",
			"🕗 ",
			"🕖 ",
			"🕕 ",
			"🕔 ",
			"🕓 ",
			"🕒 ",
			"🕑 ",
			"🕐 "
		]
	},
	aesthetic: {
		"interval": 80,
		"frames": [
			"▰▱▱▱▱▱▱",
			"▰▰▱▱▱▱▱",
			"▰▰▰▱▱▱▱",
			"▰▰▰▰▱▱▱",
			"▰▰▰▰▰▱▱",
			"▰▰▰▰▰▰▱",
			"▰▰▰▰▰▰▰",
			"▰▱▱▱▱▱▱"
		]
	},
	dwarfFortress: {
		"interval": 80,
		"frames": [
			" ██████£££  ",
			"☺██████£££  ",
			"☺██████£££  ",
			"☺▓█████£££  ",
			"☺▓█████£££  ",
			"☺▒█████£££  ",
			"☺▒█████£££  ",
			"☺░█████£££  ",
			"☺░█████£££  ",
			"☺ █████£££  ",
			" ☺█████£££  ",
			" ☺█████£££  ",
			" ☺▓████£££  ",
			" ☺▓████£££  ",
			" ☺▒████£££  ",
			" ☺▒████£££  ",
			" ☺░████£££  ",
			" ☺░████£££  ",
			" ☺ ████£££  ",
			"  ☺████£££  ",
			"  ☺████£££  ",
			"  ☺▓███£££  ",
			"  ☺▓███£££  ",
			"  ☺▒███£££  ",
			"  ☺▒███£££  ",
			"  ☺░███£££  ",
			"  ☺░███£££  ",
			"  ☺ ███£££  ",
			"   ☺███£££  ",
			"   ☺███£££  ",
			"   ☺▓██£££  ",
			"   ☺▓██£££  ",
			"   ☺▒██£££  ",
			"   ☺▒██£££  ",
			"   ☺░██£££  ",
			"   ☺░██£££  ",
			"   ☺ ██£££  ",
			"    ☺██£££  ",
			"    ☺██£££  ",
			"    ☺▓█£££  ",
			"    ☺▓█£££  ",
			"    ☺▒█£££  ",
			"    ☺▒█£££  ",
			"    ☺░█£££  ",
			"    ☺░█£££  ",
			"    ☺ █£££  ",
			"     ☺█£££  ",
			"     ☺█£££  ",
			"     ☺▓£££  ",
			"     ☺▓£££  ",
			"     ☺▒£££  ",
			"     ☺▒£££  ",
			"     ☺░£££  ",
			"     ☺░£££  ",
			"     ☺ £££  ",
			"      ☺£££  ",
			"      ☺£££  ",
			"      ☺▓££  ",
			"      ☺▓££  ",
			"      ☺▒££  ",
			"      ☺▒££  ",
			"      ☺░££  ",
			"      ☺░££  ",
			"      ☺ ££  ",
			"       ☺££  ",
			"       ☺££  ",
			"       ☺▓£  ",
			"       ☺▓£  ",
			"       ☺▒£  ",
			"       ☺▒£  ",
			"       ☺░£  ",
			"       ☺░£  ",
			"       ☺ £  ",
			"        ☺£  ",
			"        ☺£  ",
			"        ☺▓  ",
			"        ☺▓  ",
			"        ☺▒  ",
			"        ☺▒  ",
			"        ☺░  ",
			"        ☺░  ",
			"        ☺   ",
			"        ☺  &",
			"        ☺ ☼&",
			"       ☺ ☼ &",
			"       ☺☼  &",
			"      ☺☼  & ",
			"      ‼   & ",
			"     ☺   &  ",
			"    ‼    &  ",
			"   ☺    &   ",
			"  ‼     &   ",
			" ☺     &    ",
			"‼      &    ",
			"      &     ",
			"      &     ",
			"     &   ░  ",
			"     &   ▒  ",
			"    &    ▓  ",
			"    &    £  ",
			"   &    ░£  ",
			"   &    ▒£  ",
			"  &     ▓£  ",
			"  &     ££  ",
			" &     ░££  ",
			" &     ▒££  ",
			"&      ▓££  ",
			"&      £££  ",
			"      ░£££  ",
			"      ▒£££  ",
			"      ▓£££  ",
			"      █£££  ",
			"     ░█£££  ",
			"     ▒█£££  ",
			"     ▓█£££  ",
			"     ██£££  ",
			"    ░██£££  ",
			"    ▒██£££  ",
			"    ▓██£££  ",
			"    ███£££  ",
			"   ░███£££  ",
			"   ▒███£££  ",
			"   ▓███£££  ",
			"   ████£££  ",
			"  ░████£££  ",
			"  ▒████£££  ",
			"  ▓████£££  ",
			"  █████£££  ",
			" ░█████£££  ",
			" ▒█████£££  ",
			" ▓█████£££  ",
			" ██████£££  ",
			" ██████£££  "
		]
	},
	fish: {
		"interval": 80,
		"frames": [
			"~~~~~~~~~~~~~~~~~~~~",
			"> ~~~~~~~~~~~~~~~~~~",
			"º> ~~~~~~~~~~~~~~~~~",
			"(º> ~~~~~~~~~~~~~~~~",
			"((º> ~~~~~~~~~~~~~~~",
			"<((º> ~~~~~~~~~~~~~~",
			"><((º> ~~~~~~~~~~~~~",
			" ><((º> ~~~~~~~~~~~~",
			"~ ><((º> ~~~~~~~~~~~",
			"~~ <>((º> ~~~~~~~~~~",
			"~~~ ><((º> ~~~~~~~~~",
			"~~~~ <>((º> ~~~~~~~~",
			"~~~~~ ><((º> ~~~~~~~",
			"~~~~~~ <>((º> ~~~~~~",
			"~~~~~~~ ><((º> ~~~~~",
			"~~~~~~~~ <>((º> ~~~~",
			"~~~~~~~~~ ><((º> ~~~",
			"~~~~~~~~~~ <>((º> ~~",
			"~~~~~~~~~~~ ><((º> ~",
			"~~~~~~~~~~~~ <>((º> ",
			"~~~~~~~~~~~~~ ><((º>",
			"~~~~~~~~~~~~~~ <>((º",
			"~~~~~~~~~~~~~~~ ><((",
			"~~~~~~~~~~~~~~~~ <>(",
			"~~~~~~~~~~~~~~~~~ ><",
			"~~~~~~~~~~~~~~~~~~ <",
			"~~~~~~~~~~~~~~~~~~~~"
		]
	}
};

//#endregion
//#region ../../node_modules/.pnpm/cli-spinners@3.4.0/node_modules/cli-spinners/index.js
var cli_spinners_default = spinners_default;

//#endregion
//#region ../../node_modules/.pnpm/yoctocolors@2.1.2/node_modules/yoctocolors/base.js
const hasColors = tty?.WriteStream?.prototype?.hasColors?.() ?? false;
const format = (open, close) => {
	if (!hasColors) return (input) => input;
	const openCode = `\u001B[${open}m`;
	const closeCode = `\u001B[${close}m`;
	return (input) => {
		const string = input + "";
		let index = string.indexOf(closeCode);
		if (index === -1) return openCode + string + closeCode;
		let result = openCode;
		let lastIndex = 0;
		const replaceCode = (close === 22 ? closeCode : "") + openCode;
		while (index !== -1) {
			result += string.slice(lastIndex, index) + replaceCode;
			lastIndex = index + closeCode.length;
			index = string.indexOf(closeCode, lastIndex);
		}
		result += string.slice(lastIndex) + closeCode;
		return result;
	};
};
const reset = format(0, 0);
const bold = format(1, 22);
const dim = format(2, 22);
const italic = format(3, 23);
const underline = format(4, 24);
const overline = format(53, 55);
const inverse = format(7, 27);
const hidden = format(8, 28);
const strikethrough = format(9, 29);
const black = format(30, 39);
const red = format(31, 39);
const green = format(32, 39);
const yellow = format(33, 39);
const blue = format(34, 39);
const magenta = format(35, 39);
const cyan = format(36, 39);
const white = format(37, 39);
const gray = format(90, 39);
const bgBlack = format(40, 49);
const bgRed = format(41, 49);
const bgGreen = format(42, 49);
const bgYellow = format(43, 49);
const bgBlue = format(44, 49);
const bgMagenta = format(45, 49);
const bgCyan = format(46, 49);
const bgWhite = format(47, 49);
const bgGray = format(100, 49);
const redBright = format(91, 39);
const greenBright = format(92, 39);
const yellowBright = format(93, 39);
const blueBright = format(94, 39);
const magentaBright = format(95, 39);
const cyanBright = format(96, 39);
const whiteBright = format(97, 39);
const bgRedBright = format(101, 49);
const bgGreenBright = format(102, 49);
const bgYellowBright = format(103, 49);
const bgBlueBright = format(104, 49);
const bgMagentaBright = format(105, 49);
const bgCyanBright = format(106, 49);
const bgWhiteBright = format(107, 49);

//#endregion
//#region ../../node_modules/.pnpm/is-unicode-supported@2.1.0/node_modules/is-unicode-supported/index.js
function isUnicodeSupported() {
	const { env } = process$1;
	const { TERM, TERM_PROGRAM } = env;
	if (process$1.platform !== "win32") return TERM !== "linux";
	return Boolean(env.WT_SESSION) || Boolean(env.TERMINUS_SUBLIME) || env.ConEmuTask === "{cmd::Cmder}" || TERM_PROGRAM === "Terminus-Sublime" || TERM_PROGRAM === "vscode" || TERM === "xterm-256color" || TERM === "alacritty" || TERM === "rxvt-unicode" || TERM === "rxvt-unicode-256color" || env.TERMINAL_EMULATOR === "JetBrains-JediTerm";
}

//#endregion
//#region ../../node_modules/.pnpm/log-symbols@7.0.1/node_modules/log-symbols/symbols.js
const _isUnicodeSupported = isUnicodeSupported();
const info = blue(_isUnicodeSupported ? "ℹ" : "i");
const success = green(_isUnicodeSupported ? "✔" : "√");
const warning = yellow(_isUnicodeSupported ? "⚠" : "‼");
const error = red(_isUnicodeSupported ? "✖" : "×");

//#endregion
//#region ../../node_modules/.pnpm/ansi-regex@6.2.2/node_modules/ansi-regex/index.js
function ansiRegex({ onlyFirst = false } = {}) {
	return new RegExp(`(?:\\u001B\\][\\s\\S]*?(?:\\u0007|\\u001B\\u005C|\\u009C))|[\\u001B\\u009B][[\\]()#;?]*(?:\\d{1,4}(?:[;:]\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]`, onlyFirst ? void 0 : "g");
}

//#endregion
//#region ../../node_modules/.pnpm/strip-ansi@7.2.0/node_modules/strip-ansi/index.js
const regex = ansiRegex();
function stripAnsi(string) {
	if (typeof string !== "string") throw new TypeError(`Expected a \`string\`, got \`${typeof string}\``);
	if (!string.includes("\x1B") && !string.includes("")) return string;
	return string.replace(regex, "");
}

//#endregion
//#region ../../node_modules/.pnpm/get-east-asian-width@1.6.0/node_modules/get-east-asian-width/lookup-data.js
const ambiguousMaximumCodePoint = 1114109;
const ambiguousRanges = [
	161,
	161,
	164,
	164,
	167,
	168,
	170,
	170,
	173,
	174,
	176,
	180,
	182,
	186,
	188,
	191,
	198,
	198,
	208,
	208,
	215,
	216,
	222,
	225,
	230,
	230,
	232,
	234,
	236,
	237,
	240,
	240,
	242,
	243,
	247,
	250,
	252,
	252,
	254,
	254,
	257,
	257,
	273,
	273,
	275,
	275,
	283,
	283,
	294,
	295,
	299,
	299,
	305,
	307,
	312,
	312,
	319,
	322,
	324,
	324,
	328,
	331,
	333,
	333,
	338,
	339,
	358,
	359,
	363,
	363,
	462,
	462,
	464,
	464,
	466,
	466,
	468,
	468,
	470,
	470,
	472,
	472,
	474,
	474,
	476,
	476,
	593,
	593,
	609,
	609,
	708,
	708,
	711,
	711,
	713,
	715,
	717,
	717,
	720,
	720,
	728,
	731,
	733,
	733,
	735,
	735,
	768,
	879,
	913,
	929,
	931,
	937,
	945,
	961,
	963,
	969,
	1025,
	1025,
	1040,
	1103,
	1105,
	1105,
	8208,
	8208,
	8211,
	8214,
	8216,
	8217,
	8220,
	8221,
	8224,
	8226,
	8228,
	8231,
	8240,
	8240,
	8242,
	8243,
	8245,
	8245,
	8251,
	8251,
	8254,
	8254,
	8308,
	8308,
	8319,
	8319,
	8321,
	8324,
	8364,
	8364,
	8451,
	8451,
	8453,
	8453,
	8457,
	8457,
	8467,
	8467,
	8470,
	8470,
	8481,
	8482,
	8486,
	8486,
	8491,
	8491,
	8531,
	8532,
	8539,
	8542,
	8544,
	8555,
	8560,
	8569,
	8585,
	8585,
	8592,
	8601,
	8632,
	8633,
	8658,
	8658,
	8660,
	8660,
	8679,
	8679,
	8704,
	8704,
	8706,
	8707,
	8711,
	8712,
	8715,
	8715,
	8719,
	8719,
	8721,
	8721,
	8725,
	8725,
	8730,
	8730,
	8733,
	8736,
	8739,
	8739,
	8741,
	8741,
	8743,
	8748,
	8750,
	8750,
	8756,
	8759,
	8764,
	8765,
	8776,
	8776,
	8780,
	8780,
	8786,
	8786,
	8800,
	8801,
	8804,
	8807,
	8810,
	8811,
	8814,
	8815,
	8834,
	8835,
	8838,
	8839,
	8853,
	8853,
	8857,
	8857,
	8869,
	8869,
	8895,
	8895,
	8978,
	8978,
	9312,
	9449,
	9451,
	9547,
	9552,
	9587,
	9600,
	9615,
	9618,
	9621,
	9632,
	9633,
	9635,
	9641,
	9650,
	9651,
	9654,
	9655,
	9660,
	9661,
	9664,
	9665,
	9670,
	9672,
	9675,
	9675,
	9678,
	9681,
	9698,
	9701,
	9711,
	9711,
	9733,
	9734,
	9737,
	9737,
	9742,
	9743,
	9756,
	9756,
	9758,
	9758,
	9792,
	9792,
	9794,
	9794,
	9824,
	9825,
	9827,
	9829,
	9831,
	9834,
	9836,
	9837,
	9839,
	9839,
	9886,
	9887,
	9919,
	9919,
	9926,
	9933,
	9935,
	9939,
	9941,
	9953,
	9955,
	9955,
	9960,
	9961,
	9963,
	9969,
	9972,
	9972,
	9974,
	9977,
	9979,
	9980,
	9982,
	9983,
	10045,
	10045,
	10102,
	10111,
	11094,
	11097,
	12872,
	12879,
	57344,
	63743,
	65024,
	65039,
	65533,
	65533,
	127232,
	127242,
	127248,
	127277,
	127280,
	127337,
	127344,
	127373,
	127375,
	127376,
	127387,
	127404,
	917760,
	917999,
	983040,
	1048573,
	1048576,
	1114109
];
const fullwidthMinimalCodePoint = 12288;
const fullwidthMaximumCodePoint = 65510;
const fullwidthRanges = [
	12288,
	12288,
	65281,
	65376,
	65504,
	65510
];
const wideMinimalCodePoint = 4352;
const wideMaximumCodePoint = 262141;
const wideRanges = [
	4352,
	4447,
	8986,
	8987,
	9001,
	9002,
	9193,
	9196,
	9200,
	9200,
	9203,
	9203,
	9725,
	9726,
	9748,
	9749,
	9776,
	9783,
	9800,
	9811,
	9855,
	9855,
	9866,
	9871,
	9875,
	9875,
	9889,
	9889,
	9898,
	9899,
	9917,
	9918,
	9924,
	9925,
	9934,
	9934,
	9940,
	9940,
	9962,
	9962,
	9970,
	9971,
	9973,
	9973,
	9978,
	9978,
	9981,
	9981,
	9989,
	9989,
	9994,
	9995,
	10024,
	10024,
	10060,
	10060,
	10062,
	10062,
	10067,
	10069,
	10071,
	10071,
	10133,
	10135,
	10160,
	10160,
	10175,
	10175,
	11035,
	11036,
	11088,
	11088,
	11093,
	11093,
	11904,
	11929,
	11931,
	12019,
	12032,
	12245,
	12272,
	12287,
	12289,
	12350,
	12353,
	12438,
	12441,
	12543,
	12549,
	12591,
	12593,
	12686,
	12688,
	12773,
	12783,
	12830,
	12832,
	12871,
	12880,
	42124,
	42128,
	42182,
	43360,
	43388,
	44032,
	55203,
	63744,
	64255,
	65040,
	65049,
	65072,
	65106,
	65108,
	65126,
	65128,
	65131,
	94176,
	94180,
	94192,
	94198,
	94208,
	101589,
	101631,
	101662,
	101760,
	101874,
	110576,
	110579,
	110581,
	110587,
	110589,
	110590,
	110592,
	110882,
	110898,
	110898,
	110928,
	110930,
	110933,
	110933,
	110948,
	110951,
	110960,
	111355,
	119552,
	119638,
	119648,
	119670,
	126980,
	126980,
	127183,
	127183,
	127374,
	127374,
	127377,
	127386,
	127488,
	127490,
	127504,
	127547,
	127552,
	127560,
	127568,
	127569,
	127584,
	127589,
	127744,
	127776,
	127789,
	127797,
	127799,
	127868,
	127870,
	127891,
	127904,
	127946,
	127951,
	127955,
	127968,
	127984,
	127988,
	127988,
	127992,
	128062,
	128064,
	128064,
	128066,
	128252,
	128255,
	128317,
	128331,
	128334,
	128336,
	128359,
	128378,
	128378,
	128405,
	128406,
	128420,
	128420,
	128507,
	128591,
	128640,
	128709,
	128716,
	128716,
	128720,
	128722,
	128725,
	128728,
	128732,
	128735,
	128747,
	128748,
	128756,
	128764,
	128992,
	129003,
	129008,
	129008,
	129292,
	129338,
	129340,
	129349,
	129351,
	129535,
	129648,
	129660,
	129664,
	129674,
	129678,
	129734,
	129736,
	129736,
	129741,
	129756,
	129759,
	129770,
	129775,
	129784,
	131072,
	196605,
	196608,
	262141
];

//#endregion
//#region ../../node_modules/.pnpm/get-east-asian-width@1.6.0/node_modules/get-east-asian-width/utilities.js
/**
Binary search on a sorted flat array of [start, end] pairs.

@param {number[]} ranges - Flat array of inclusive [start, end] range pairs, e.g. [0, 5, 10, 20].
@param {number} codePoint - The value to search for.
@returns {boolean} Whether the value falls within any of the ranges.
*/
const isInRange = (ranges, codePoint) => {
	let low = 0;
	let high = Math.floor(ranges.length / 2) - 1;
	while (low <= high) {
		const mid = Math.floor((low + high) / 2);
		const i = mid * 2;
		if (codePoint < ranges[i]) high = mid - 1;
		else if (codePoint > ranges[i + 1]) low = mid + 1;
		else return true;
	}
	return false;
};

//#endregion
//#region ../../node_modules/.pnpm/get-east-asian-width@1.6.0/node_modules/get-east-asian-width/lookup.js
const commonCjkCodePoint = 19968;
const [wideFastPathStart, wideFastPathEnd] = /* #__PURE__ */ findWideFastPathRange(wideRanges);
function findWideFastPathRange(ranges) {
	let fastPathStart = ranges[0];
	let fastPathEnd = ranges[1];
	for (let index = 0; index < ranges.length; index += 2) {
		const start = ranges[index];
		const end = ranges[index + 1];
		if (commonCjkCodePoint >= start && commonCjkCodePoint <= end) return [start, end];
		if (end - start > fastPathEnd - fastPathStart) {
			fastPathStart = start;
			fastPathEnd = end;
		}
	}
	return [fastPathStart, fastPathEnd];
}
const isAmbiguous = (codePoint) => {
	if (codePoint < 161 || codePoint > 1114109) return false;
	return isInRange(ambiguousRanges, codePoint);
};
const isFullWidth = (codePoint) => {
	if (codePoint < 12288 || codePoint > 65510) return false;
	return isInRange(fullwidthRanges, codePoint);
};
const isWide = (codePoint) => {
	if (codePoint >= wideFastPathStart && codePoint <= wideFastPathEnd) return true;
	if (codePoint < 4352 || codePoint > 262141) return false;
	return isInRange(wideRanges, codePoint);
};

//#endregion
//#region ../../node_modules/.pnpm/get-east-asian-width@1.6.0/node_modules/get-east-asian-width/index.js
function validate(codePoint) {
	if (!Number.isSafeInteger(codePoint)) throw new TypeError(`Expected a code point, got \`${typeof codePoint}\`.`);
}
function eastAsianWidth(codePoint, { ambiguousAsWide = false } = {}) {
	validate(codePoint);
	if (isFullWidth(codePoint) || isWide(codePoint) || ambiguousAsWide && isAmbiguous(codePoint)) return 2;
	return 1;
}

//#endregion
//#region ../../node_modules/.pnpm/string-width@8.2.1/node_modules/string-width/index.js
/**
Logic:
- Segment graphemes to match how terminals render clusters.
- Width rules:
1. Skip non-printing clusters (Default_Ignorable, Control, pure Mark, lone Surrogates). Tabs are ignored by design.
2. RGI emoji clusters (\p{RGI_Emoji}) are double-width.
3. Minimally-qualified/unqualified emoji clusters (ZWJ sequences with 2+ Extended_Pictographic, or keycap sequences) are double-width.
4. Hangul jamo collapse each standard modern Hangul L+V or L+V+T syllable piece to width 2.
Unmatched repeated leading/vowel/trailing jamo stay additive because that matches how the terminals we target render them.
5. Otherwise use East Asian Width of the cluster's first visible code point, and add widths for trailing Halfwidth/Fullwidth Forms within the same cluster (e.g., dakuten/handakuten/prolonged sound mark).
*/
const segmenter = new Intl.Segmenter();
const zeroWidthClusterRegex = /^(?:\p{Default_Ignorable_Code_Point}|\p{Control}|\p{Format}|\p{Mark}|\p{Surrogate})+$/v;
const leadingNonPrintingRegex = /^[\p{Default_Ignorable_Code_Point}\p{Control}\p{Format}\p{Mark}\p{Surrogate}]+/v;
const rgiEmojiRegex = /^\p{RGI_Emoji}$/v;
const unqualifiedKeycapRegex = /^[\d#*]\u20E3$/;
const extendedPictographicRegex = /\p{Extended_Pictographic}/gu;
function isDoubleWidthNonRgiEmojiSequence(segment) {
	if (segment.length > 50) return false;
	if (unqualifiedKeycapRegex.test(segment)) return true;
	if (segment.includes("‍")) {
		const pictographics = segment.match(extendedPictographicRegex);
		return pictographics !== null && pictographics.length >= 2;
	}
	return false;
}
function baseVisible(segment) {
	return segment.replace(leadingNonPrintingRegex, "");
}
function isZeroWidthCluster(segment) {
	return zeroWidthClusterRegex.test(segment);
}
function isHangulLeadingJamo(codePoint) {
	return codePoint >= 4352 && codePoint <= 4447 || codePoint >= 43360 && codePoint <= 43388;
}
function isHangulVowelJamo(codePoint) {
	return codePoint >= 4448 && codePoint <= 4519 || codePoint >= 55216 && codePoint <= 55238;
}
function isHangulTrailingJamo(codePoint) {
	return codePoint >= 4520 && codePoint <= 4607 || codePoint >= 55243 && codePoint <= 55291;
}
function isHangulJamo(codePoint) {
	return isHangulLeadingJamo(codePoint) || isHangulVowelJamo(codePoint) || isHangulTrailingJamo(codePoint);
}
function hangulClusterWidth(visibleSegment, eastAsianWidthOptions) {
	const codePoints = [];
	for (const character of visibleSegment) {
		if (zeroWidthClusterRegex.test(character)) continue;
		codePoints.push(character.codePointAt(0));
	}
	if (codePoints.length === 0) return;
	let width = 0;
	for (let index = 0; index < codePoints.length; index++) {
		const codePoint = codePoints[index];
		if (!isHangulJamo(codePoint)) {
			if (width === 0) return;
			for (let remaining = index; remaining < codePoints.length; remaining++) width += eastAsianWidth(codePoints[remaining], eastAsianWidthOptions);
			return width;
		}
		if (isHangulLeadingJamo(codePoint) && isHangulVowelJamo(codePoints[index + 1])) {
			width += 2;
			index += isHangulTrailingJamo(codePoints[index + 2]) ? 2 : 1;
			continue;
		}
		width += eastAsianWidth(codePoint, eastAsianWidthOptions);
	}
	return width;
}
function trailingHalfwidthWidth(visibleSegment, eastAsianWidthOptions) {
	let extra = 0;
	let first = true;
	for (const character of visibleSegment) {
		if (first) {
			first = false;
			continue;
		}
		if (character >= "＀" && character <= "￯") extra += eastAsianWidth(character.codePointAt(0), eastAsianWidthOptions);
	}
	return extra;
}
function stringWidth(input, options = {}) {
	if (typeof input !== "string" || input.length === 0) return 0;
	const { ambiguousIsNarrow = true, countAnsiEscapeCodes = false } = options;
	let string = input;
	if (!countAnsiEscapeCodes && (string.includes("\x1B") || string.includes(""))) string = stripAnsi(string);
	if (string.length === 0) return 0;
	if (/^[\u0020-\u007E]*$/.test(string)) return string.length;
	let width = 0;
	const eastAsianWidthOptions = { ambiguousAsWide: !ambiguousIsNarrow };
	for (const { segment } of segmenter.segment(string)) {
		if (isZeroWidthCluster(segment)) continue;
		if (rgiEmojiRegex.test(segment) || isDoubleWidthNonRgiEmojiSequence(segment)) {
			width += 2;
			continue;
		}
		const visibleSegment = baseVisible(segment);
		const hangulWidth = hangulClusterWidth(visibleSegment, eastAsianWidthOptions);
		if (hangulWidth !== void 0) {
			width += hangulWidth;
			continue;
		}
		const codePoint = visibleSegment.codePointAt(0);
		width += eastAsianWidth(codePoint, eastAsianWidthOptions);
		width += trailingHalfwidthWidth(visibleSegment, eastAsianWidthOptions);
	}
	return width;
}

//#endregion
//#region ../../node_modules/.pnpm/is-interactive@2.0.0/node_modules/is-interactive/index.js
function isInteractive({ stream = process.stdout } = {}) {
	return Boolean(stream && stream.isTTY && process.env.TERM !== "dumb" && !("CI" in process.env));
}

//#endregion
//#region ../../node_modules/.pnpm/stdin-discarder@0.3.2/node_modules/stdin-discarder/index.js
const ASCII_ETX_CODE = 3;
var StdinDiscarder = class {
	#activeCount = 0;
	#stdin;
	#stdinWasPaused = false;
	#stdinWasRaw = false;
	#handleInputBound = (chunk) => {
		if (!chunk?.length) return;
		if ((typeof chunk === "string" ? chunk.codePointAt(0) : chunk[0]) === ASCII_ETX_CODE) process$1.kill(process$1.pid, "SIGINT");
	};
	start() {
		this.#activeCount++;
		if (this.#activeCount === 1) this.#realStart();
	}
	stop() {
		if (this.#activeCount === 0) return;
		if (--this.#activeCount === 0) this.#realStop();
	}
	#realStart() {
		const { stdin } = process$1;
		if (process$1.platform === "win32" || !stdin?.isTTY || typeof stdin.setRawMode !== "function") {
			this.#stdin = void 0;
			return;
		}
		this.#stdin = stdin;
		this.#stdinWasPaused = stdin.isPaused();
		this.#stdinWasRaw = Boolean(stdin.isRaw);
		stdin.setRawMode(true);
		stdin.prependListener("data", this.#handleInputBound);
		if (this.#stdinWasPaused) stdin.resume();
	}
	#realStop() {
		if (!this.#stdin) return;
		const stdin = this.#stdin;
		stdin.off("data", this.#handleInputBound);
		if (stdin.isTTY) stdin.setRawMode?.(this.#stdinWasRaw);
		if (this.#stdinWasPaused) stdin.pause();
		this.#stdin = void 0;
		this.#stdinWasPaused = false;
		this.#stdinWasRaw = false;
	}
};
const stdinDiscarder = new StdinDiscarder();
var stdin_discarder_default = Object.freeze(stdinDiscarder);

//#endregion
//#region ../../node_modules/.pnpm/ora@9.4.0/node_modules/ora/index.js
const RENDER_DEFERRAL_TIMEOUT = 200;
const SYNCHRONIZED_OUTPUT_ENABLE = "\x1B[?2026h";
const SYNCHRONIZED_OUTPUT_DISABLE = "\x1B[?2026l";
const activeHooksPerStream = /* @__PURE__ */ new Map();
const validColors = new Set([
	"black",
	"red",
	"green",
	"yellow",
	"blue",
	"magenta",
	"cyan",
	"white",
	"gray"
]);
var Ora = class {
	#linesToClear = 0;
	#frameIndex = -1;
	#lastFrameTime = 0;
	#options;
	#spinner;
	#stream;
	#id;
	#hookedStreams = /* @__PURE__ */ new Map();
	#isInternalWrite = false;
	#drainHandler;
	#deferRenderTimer;
	#isDiscardingStdin = false;
	#color;
	#internalWrite(fn) {
		this.#isInternalWrite = true;
		try {
			return fn();
		} finally {
			this.#isInternalWrite = false;
		}
	}
	#tryRender() {
		if (this.isSpinning) this.render();
	}
	#stringifyChunk(chunk, encoding) {
		if (chunk === void 0 || chunk === null) return "";
		if (typeof chunk === "string") return chunk;
		if (Buffer.isBuffer(chunk) || ArrayBuffer.isView(chunk)) {
			const normalizedEncoding = typeof encoding === "string" && encoding && encoding !== "buffer" ? encoding : "utf8";
			return Buffer.from(chunk).toString(normalizedEncoding);
		}
		return String(chunk);
	}
	#chunkTerminatesLine(chunkString) {
		if (!chunkString) return false;
		const lastCharacter = chunkString.at(-1);
		return lastCharacter === "\n" || lastCharacter === "\r";
	}
	#scheduleRenderDeferral() {
		if (this.#deferRenderTimer) return;
		this.#deferRenderTimer = setTimeout(() => {
			this.#deferRenderTimer = void 0;
			if (this.isSpinning) this.#tryRender();
		}, RENDER_DEFERRAL_TIMEOUT);
		if (typeof this.#deferRenderTimer?.unref === "function") this.#deferRenderTimer.unref();
	}
	#clearRenderDeferral() {
		if (this.#deferRenderTimer) {
			clearTimeout(this.#deferRenderTimer);
			this.#deferRenderTimer = void 0;
		}
	}
	#buildOutputLine(symbol, text, prefixText, suffixText) {
		const fullPrefixText = this.#getFullPrefixText(prefixText, " ");
		const fullText = typeof text === "string" ? (symbol ? " " : "") + text : "";
		const fullSuffixText = this.#getFullSuffixText(suffixText, " ");
		return fullPrefixText + symbol + fullText + fullSuffixText;
	}
	constructor(options) {
		if (typeof options === "string") options = { text: options };
		this.#options = {
			color: "cyan",
			stream: process$1.stderr,
			discardStdin: true,
			hideCursor: true,
			...options
		};
		this.color = this.#options.color;
		this.#stream = this.#options.stream;
		if (typeof this.#options.isEnabled !== "boolean") this.#options.isEnabled = isInteractive({ stream: this.#stream });
		if (typeof this.#options.isSilent !== "boolean") this.#options.isSilent = false;
		if (this.#options.interval !== void 0 && !(Number.isInteger(this.#options.interval) && this.#options.interval > 0)) throw new Error("The `interval` option must be a positive integer");
		const userInterval = this.#options.interval;
		this.spinner = this.#options.spinner;
		this.#options.interval = userInterval;
		this.text = this.#options.text;
		this.prefixText = this.#options.prefixText;
		this.suffixText = this.#options.suffixText;
		this.indent = this.#options.indent;
		if (process$1.env.NODE_ENV === "test") {
			this._stream = this.#stream;
			this._isEnabled = this.#options.isEnabled;
			Object.defineProperty(this, "_linesToClear", {
				get() {
					return this.#linesToClear;
				},
				set(newValue) {
					this.#linesToClear = newValue;
				}
			});
			Object.defineProperty(this, "_frameIndex", { get() {
				return this.#frameIndex;
			} });
			Object.defineProperty(this, "_lineCount", { get() {
				const columns = this.#stream.columns ?? 80;
				const prefixText = typeof this.#options.prefixText === "function" ? "" : this.#options.prefixText;
				const suffixText = typeof this.#options.suffixText === "function" ? "" : this.#options.suffixText;
				const fullPrefixText = typeof prefixText === "string" && prefixText !== "" ? prefixText + " " : "";
				const fullSuffixText = typeof suffixText === "string" && suffixText !== "" ? " " + suffixText : "";
				const fullText = " ".repeat(this.#options.indent) + fullPrefixText + "-" + (typeof this.#options.text === "string" ? " " + this.#options.text : "") + fullSuffixText;
				return this.#computeLineCountFrom(fullText, columns);
			} });
		}
	}
	get indent() {
		return this.#options.indent;
	}
	set indent(indent = 0) {
		if (!(indent >= 0 && Number.isInteger(indent))) throw new Error("The `indent` option must be an integer from 0 and up");
		this.#options.indent = indent;
	}
	get interval() {
		return this.#options.interval ?? this.#spinner.interval ?? 100;
	}
	get spinner() {
		return this.#spinner;
	}
	set spinner(spinner) {
		this.#frameIndex = -1;
		this.#options.interval = void 0;
		if (typeof spinner === "object") {
			if (!Array.isArray(spinner.frames) || spinner.frames.length === 0 || spinner.frames.some((frame) => typeof frame !== "string")) throw new Error("The given spinner must have a non-empty `frames` array of strings");
			if (spinner.interval !== void 0 && !(Number.isInteger(spinner.interval) && spinner.interval > 0)) throw new Error("`spinner.interval` must be a positive integer if provided");
			this.#spinner = spinner;
		} else if (!isUnicodeSupported()) this.#spinner = cli_spinners_default.line;
		else if (spinner === void 0) this.#spinner = cli_spinners_default.dots;
		else if (spinner !== "default" && cli_spinners_default[spinner]) this.#spinner = cli_spinners_default[spinner];
		else throw new Error(`There is no built-in spinner named '${spinner}'. See https://github.com/sindresorhus/cli-spinners/blob/main/spinners.json for a full list.`);
	}
	get text() {
		return this.#options.text;
	}
	set text(value = "") {
		this.#options.text = value;
	}
	get prefixText() {
		return this.#options.prefixText;
	}
	set prefixText(value = "") {
		this.#options.prefixText = value;
	}
	get suffixText() {
		return this.#options.suffixText;
	}
	set suffixText(value = "") {
		this.#options.suffixText = value;
	}
	get isSpinning() {
		return this.#id !== void 0;
	}
	#formatAffix(value, separator, placeBefore = false) {
		const resolved = typeof value === "function" ? value() : value;
		if (typeof resolved === "string" && resolved !== "") return placeBefore ? separator + resolved : resolved + separator;
		return "";
	}
	#getFullPrefixText(prefixText = this.#options.prefixText, postfix = " ") {
		return this.#formatAffix(prefixText, postfix, false);
	}
	#getFullSuffixText(suffixText = this.#options.suffixText, prefix = " ") {
		return this.#formatAffix(suffixText, prefix, true);
	}
	#computeLineCountFrom(text, columns) {
		let count = 0;
		for (const line of stripVTControlCharacters(text).split("\n")) count += Math.max(1, Math.ceil(stringWidth(line) / columns));
		return count;
	}
	get color() {
		return this.#color;
	}
	set color(value) {
		if (value !== void 0 && value !== false && !validColors.has(value)) throw new Error("The `color` option must be a valid color or `false` to disable");
		this.#color = value;
	}
	get isEnabled() {
		return this.#options.isEnabled && !this.#options.isSilent;
	}
	set isEnabled(value) {
		if (typeof value !== "boolean") throw new TypeError("The `isEnabled` option must be a boolean");
		this.#options.isEnabled = value;
	}
	get isSilent() {
		return this.#options.isSilent;
	}
	set isSilent(value) {
		if (typeof value !== "boolean") throw new TypeError("The `isSilent` option must be a boolean");
		this.#options.isSilent = value;
	}
	frame() {
		const now = Date.now();
		if (this.#frameIndex === -1 || now - this.#lastFrameTime >= this.interval) {
			this.#frameIndex = (this.#frameIndex + 1) % this.#spinner.frames.length;
			this.#lastFrameTime = now;
		}
		const { frames } = this.#spinner;
		let frame = frames[this.#frameIndex];
		if (this.#color) frame = chalk[this.#color](frame);
		const fullPrefixText = this.#getFullPrefixText(this.#options.prefixText, " ");
		const fullText = typeof this.text === "string" ? " " + this.text : "";
		const fullSuffixText = this.#getFullSuffixText(this.#options.suffixText, " ");
		return fullPrefixText + frame + fullText + fullSuffixText;
	}
	clear() {
		if (!this.isEnabled || !this.#stream.isTTY) return this;
		this.#internalWrite(() => {
			this.#stream.cursorTo(0);
			for (let index = 0; index < this.#linesToClear; index++) {
				if (index > 0) this.#stream.moveCursor(0, -1);
				this.#stream.clearLine(1);
			}
			if (this.#options.indent) this.#stream.cursorTo(this.#options.indent);
		});
		this.#linesToClear = 0;
		return this;
	}
	#hookStream(stream) {
		if (!stream || this.#hookedStreams.has(stream) || !stream.isTTY || typeof stream.write !== "function") return;
		if (activeHooksPerStream.has(stream)) console.warn("[ora] Multiple concurrent spinners detected. This may cause visual corruption. Use one spinner at a time.");
		const originalWrite = stream.write;
		this.#hookedStreams.set(stream, originalWrite);
		activeHooksPerStream.set(stream, this);
		stream.write = (chunk, encoding, callback) => this.#hookedWrite(stream, originalWrite, chunk, encoding, callback);
	}
	/**
	Intercept stream writes while spinner is active to handle external writes cleanly without visual corruption.
	Hooks process stdio streams and the active spinner stream so console.log(), console.error(), and direct writes stay tidy.
	*/
	#installHook() {
		if (!this.isEnabled || this.#hookedStreams.size > 0) return;
		const streamsToHook = new Set([
			this.#stream,
			process$1.stdout,
			process$1.stderr
		]);
		for (const stream of streamsToHook) this.#hookStream(stream);
	}
	#uninstallHook() {
		for (const [stream, originalWrite] of this.#hookedStreams) {
			stream.write = originalWrite;
			if (activeHooksPerStream.get(stream) === this) activeHooksPerStream.delete(stream);
		}
		this.#hookedStreams.clear();
	}
	#hookedWrite(stream, originalWrite, chunk, encoding, callback) {
		if (typeof encoding === "function") {
			callback = encoding;
			encoding = void 0;
		}
		if (this.#isInternalWrite) return originalWrite.call(stream, chunk, encoding, callback);
		this.clear();
		const chunkString = this.#stringifyChunk(chunk, encoding);
		const chunkTerminatesLine = this.#chunkTerminatesLine(chunkString);
		const writeResult = originalWrite.call(stream, chunk, encoding, callback);
		if (chunkTerminatesLine) this.#clearRenderDeferral();
		else if (chunkString.length > 0) this.#scheduleRenderDeferral();
		if (this.isSpinning && !this.#deferRenderTimer) this.render();
		return writeResult;
	}
	render() {
		if (!this.isEnabled || this.#drainHandler || this.#deferRenderTimer) return this;
		const useSynchronizedOutput = this.#stream.isTTY;
		let shouldDisableSynchronizedOutput = false;
		try {
			if (useSynchronizedOutput) {
				this.#internalWrite(() => this.#stream.write(SYNCHRONIZED_OUTPUT_ENABLE));
				shouldDisableSynchronizedOutput = true;
			}
			this.clear();
			let frameContent = this.frame();
			const columns = this.#stream.columns ?? 80;
			const actualLineCount = this.#computeLineCountFrom(frameContent, columns);
			const consoleHeight = this.#stream.rows;
			if (consoleHeight && consoleHeight > 1 && actualLineCount > consoleHeight) {
				const lines = frameContent.split("\n");
				const maxLines = consoleHeight - 1;
				frameContent = [...lines.slice(0, maxLines), "... (content truncated to fit terminal)"].join("\n");
			}
			if (this.#internalWrite(() => this.#stream.write(frameContent)) === false && this.#stream.isTTY) {
				this.#drainHandler = () => {
					this.#drainHandler = void 0;
					this.#tryRender();
				};
				this.#stream.once("drain", this.#drainHandler);
			}
			this.#linesToClear = this.#computeLineCountFrom(frameContent, columns);
		} finally {
			if (shouldDisableSynchronizedOutput) this.#internalWrite(() => this.#stream.write(SYNCHRONIZED_OUTPUT_DISABLE));
		}
		return this;
	}
	start(text) {
		if (text) this.text = text;
		if (this.isSilent) return this;
		if (!this.isEnabled) {
			const symbol = this.text ? "-" : "";
			const line = " ".repeat(this.#options.indent) + this.#buildOutputLine(symbol, this.text, this.#options.prefixText, this.#options.suffixText);
			if (line.trim() !== "") this.#internalWrite(() => this.#stream.write(line + "\n"));
			return this;
		}
		if (this.isSpinning) return this;
		if (this.#options.hideCursor) cliCursor.hide(this.#stream);
		if (this.#options.discardStdin && process$1.stdin.isTTY) {
			stdin_discarder_default.start();
			this.#isDiscardingStdin = true;
		}
		this.#installHook();
		this.render();
		this.#id = setInterval(this.render.bind(this), this.interval);
		return this;
	}
	stop() {
		clearInterval(this.#id);
		this.#id = void 0;
		this.#frameIndex = -1;
		this.#lastFrameTime = 0;
		this.#clearRenderDeferral();
		this.#uninstallHook();
		if (this.#drainHandler) {
			this.#stream.removeListener("drain", this.#drainHandler);
			this.#drainHandler = void 0;
		}
		if (this.isEnabled) {
			this.clear();
			if (this.#options.hideCursor) cliCursor.show(this.#stream);
		}
		if (this.#isDiscardingStdin) {
			this.#isDiscardingStdin = false;
			stdin_discarder_default.stop();
		}
		return this;
	}
	succeed(text) {
		return this.stopAndPersist({
			symbol: success,
			text
		});
	}
	fail(text) {
		return this.stopAndPersist({
			symbol: error,
			text
		});
	}
	warn(text) {
		return this.stopAndPersist({
			symbol: warning,
			text
		});
	}
	info(text) {
		return this.stopAndPersist({
			symbol: info,
			text
		});
	}
	stopAndPersist(options = {}) {
		if (this.isSilent) return this;
		const symbol = options.symbol ?? " ";
		const text = options.text ?? this.text;
		const prefixText = options.prefixText ?? this.#options.prefixText;
		const suffixText = options.suffixText ?? this.#options.suffixText;
		const textToWrite = this.#buildOutputLine(symbol, text, prefixText, suffixText) + "\n";
		this.stop();
		this.#internalWrite(() => this.#stream.write(textToWrite));
		return this;
	}
};
function ora(options) {
	return new Ora(options);
}

//#endregion
//#region src/cli/utils/spinner.ts
const spinner = (text) => ora({ text });

//#endregion
//#region src/cli/commands/migrate.ts
const VERSION$1 = "0.0.8";
const migrate = new Command().name("migrate").description("rewrite clsx / classnames / tailwind-merge imports to cnfast").option("-c, --cwd <cwd>", "working directory (defaults to current directory)", process.cwd()).option("-d, --dry-run", "preview changes without writing files", false).option("-y, --yes", "apply changes without confirmation", false).action(async (opts) => {
	console.log(`${import_picocolors.default.magenta("✿")} ${import_picocolors.default.bold("cnfast")} ${import_picocolors.default.gray(VERSION$1)}`);
	console.log();
	try {
		const cwd = resolve(opts.cwd);
		const scanSpinner = spinner("Scanning files.").start();
		const files = await findSourceFiles(cwd);
		const pending = [];
		for (const filePath of files) {
			const originalContent = readFileSync(filePath, "utf-8");
			const { code, changeCount } = migrateSource(originalContent);
			if (changeCount > 0 && code !== originalContent) pending.push({
				filePath,
				originalContent,
				newContent: code,
				changeCount
			});
		}
		if (pending.length === 0) {
			scanSpinner.succeed("No clsx / classnames / tailwind-merge imports found.");
			return;
		}
		const totalChanges = pending.reduce((sum, item) => sum + item.changeCount, 0);
		scanSpinner.succeed(`Found ${highlighter.info(String(totalChanges))} import(s) across ${highlighter.info(String(pending.length))} file(s).`);
		logger.break();
		for (const item of pending) printDiff(relative(cwd, item.filePath), item.originalContent, item.newContent);
		if (opts.dryRun) {
			logger.info("Dry run — no files were changed.");
			return;
		}
		if (!opts.yes) {
			const { confirm } = await (0, import_prompts.default)({
				type: "confirm",
				name: "confirm",
				message: `Migrate ${pending.length} file(s) to cnfast?`,
				initial: true
			});
			if (!confirm) {
				logger.break();
				logger.warn("Aborted. No files were changed.");
				return;
			}
			logger.break();
		}
		const writeSpinner = spinner("Writing files.").start();
		for (const item of pending) writeFileSync(item.filePath, item.newContent);
		writeSpinner.succeed(`Migrated ${pending.length} file(s) to cnfast.`);
		logger.break();
		logger.log(`Next: install cnfast and remove unused deps with ${highlighter.info("npm i cnfast")}.`);
	} catch (error) {
		handleError(error);
	}
});

//#endregion
//#region src/cli/index.ts
const VERSION = "0.0.8";
process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));
const program = new Command().name("cnfast").description("CLI for cnfast").version(VERSION, "-v, --version", "display the version number");
program.addCommand(migrate);
const main = async () => {
	await program.parseAsync();
};
main();

//#endregion
export {  };