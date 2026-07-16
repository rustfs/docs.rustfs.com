"use client";
import { usePathname, useRouter } from "fumadocs-core/framework";
import { jsx } from "react/jsx-runtime";
import { createContext, use, useMemo, useRef } from "react";
import { TranslationProvider } from "@fuma-translate/react";
//#region src/contexts/i18n.tsx
const LocaleContext = createContext({});
function useI18n() {
	return use(LocaleContext);
}
const Empty = {};
function I18nProvider({ locales = [], locale, onLocaleChange, children, translations = Empty }) {
	const router = useRouter();
	const pathname = usePathname();
	const onChange = (value) => {
		if (onLocaleChange) return onLocaleChange(value);
		const segments = pathname.split("/").filter((v) => v.length > 0);
		if (segments.length === 0 || segments[0] !== locale) segments.unshift(value);
		else segments[0] = value;
		router.push(`/${segments.join("/")}`);
	};
	const onChangeRef = useRef(onChange);
	onChangeRef.current = onChange;
	return /* @__PURE__ */ jsx(LocaleContext, {
		value: useMemo(() => ({
			locale,
			locales,
			onChange: (v) => onChangeRef.current(v)
		}), [locale, locales]),
		children: /* @__PURE__ */ jsx(TranslationProvider, {
			translations,
			children
		})
	});
}
//#endregion
export { I18nProvider, useI18n };
