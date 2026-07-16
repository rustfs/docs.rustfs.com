import { n as I18nConfig } from "../index-DydiXvgS.js";
import { NextProxy } from "next/server.js";
import { NextURL } from "next/dist/server/web/next-url.js";
//#region src/i18n/middleware.d.ts
interface MiddlewareOptions extends I18nConfig {
  /**
   * Either:
   * - A formatter object
   * - A function that adds the locale prefix to pathname
   */
  format?: URLFormatter | ((locale: string, pathname: string) => string);
  /**
   * the cookie to store locale code when `hideLocale` is set to `always`.
   */
  cookieName?: string;
}
interface URLFormatter {
  /**
   * get locale code from request URL
   */
  get: (url: NextURL) => string | undefined;
  /**
   * add locale code to request URL (which is missing the locale).
   */
  add: (url: NextURL, locale: string) => URL;
  /**
   * remove locale code from request URL
   */
  remove: (url: NextURL) => URL;
}
declare const DefaultFormatter: URLFormatter;
declare function createI18nMiddleware({ languages, defaultLanguage, format, cookieName, hideLocale }: MiddlewareOptions): NextProxy;
//#endregion
export { DefaultFormatter, URLFormatter, createI18nMiddleware };