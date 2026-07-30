import { collectLanguageRedirects } from './scripts/language-redirects.mjs';

const redirects = [...collectLanguageRedirects()].map(([source, rule]) => {
  const separator = rule.lastIndexOf(' ');
  const destination = rule.slice(0, separator);
  const statusCode = Number(rule.slice(separator + 1));

  return {
    source: source.replace('*', ':path*'),
    destination: destination.replace(':splat', ':path*'),
    statusCode,
  };
});

export const config = { redirects };
