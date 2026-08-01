(() => {
  const supportedLanguages = new Set(["en", "zh", "de", "fr", "ja"]);
  const storageKey = "rustfs-docs-language";
  const getPathLanguage = () =>
    window.location.pathname.match(/^\/(en|zh|de|fr|ja)(?:\/|$)/)?.[1];
  const savePathLanguage = () => {
    const language = getPathLanguage();
    if (!language) return;

    try {
      window.localStorage.setItem(storageKey, language);
    } catch {
      // Language detection still works when storage is unavailable.
    }
  };

  if (getPathLanguage()) {
    savePathLanguage();

    if (window.history) {
      const pushState = window.history.pushState;
      window.history.pushState = function (...args) {
        const result = pushState.apply(this, args);
        window.queueMicrotask(savePathLanguage);
        return result;
      };

      const replaceState = window.history.replaceState;
      window.history.replaceState = function (...args) {
        const result = replaceState.apply(this, args);
        window.queueMicrotask(savePathLanguage);
        return result;
      };
      window.addEventListener("popstate", savePathLanguage);
    }

    return;
  }

  if (window.location.pathname !== "/" && window.location.pathname !== "/index.html") {
    return;
  }

  let savedLanguage;
  try {
    savedLanguage = window.localStorage.getItem(storageKey);
  } catch {
    // Fall back to the browser language when storage is unavailable.
  }

  const browserLanguages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  const detectedLanguage = browserLanguages
    .map((language) => language?.toLowerCase().split("-")[0])
    .find((language) => language && supportedLanguages.has(language));
  const language =
    savedLanguage && supportedLanguages.has(savedLanguage)
      ? savedLanguage
      : (detectedLanguage ?? "en");

  window.location.replace(
    `/${language}${window.location.search}${window.location.hash}`,
  );
})();
