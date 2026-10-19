import type { AppContext, AppShape, PressPlugin } from "fumapress";
import { oramaSearchPlugin } from "fumapress/plugins/orama-search";

/** Keep native indexing, but export one static asset per locale. */
export function localSearchPlugin<C extends AppShape = AppShape>(
  languages: readonly string[],
): PressPlugin<C> {
  const native = oramaSearchPlugin<C>();

  return {
    ...native,
    async createPages(routes) {
      for (const locale of languages) {
        const getLoader = this.getLoader;
        type Loader = Awaited<ReturnType<typeof getLoader>>;
        const cache = new WeakMap<Loader, Loader>();
        // Do not mutate the shared loader: other plugins still need every page.
        const context: AppContext<C> = Object.create(this, {
          getLoader: {
            value: async () => {
              const loader = await getLoader();
              let localized = cache.get(loader);
              if (!localized) {
                localized = {
                  ...loader,
                  getPages: () => loader.getPages(locale),
                };
                cache.set(loader, localized);
              }
              return localized;
            },
          },
        });

        await native.createPages?.call(context, {
          ...routes,
          createApiIsomorphic(options) {
            return routes.createApiIsomorphic({
              ...options,
              path: `/api/search/${locale}.json`,
            });
          },
        });
      }
    },
  };
}
