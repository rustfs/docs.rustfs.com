import type { DocumentRecord } from "fumadocs-core/search/algolia";
import type { ServerPlugin } from "fumapress";

export function algoliaIndexPlugin(): ServerPlugin<any> {
  return {
    name: "rustfs:algolia-index",
    createPages({ createApiIsomorphic }) {
      const context = this;

      createApiIsomorphic({
        render: "static",
        path: "/algolia-index.json",
        async handler() {
          const documents: DocumentRecord[] = [];

          const loader = await context.getLoader();

          for (const page of loader.getPages()) {
            let structured;

            for (const adapter of context.adapters) {
              structured = await adapter["core:get-structured-data"]?.call(context, page);
              if (structured) break;
            }

            if (!structured) {
              throw new Error(`Unable to generate Algolia data for ${page.url}`);
            }

            documents.push({
              _id: page.url,
              title: page.data.title ?? page.path,
              description: page.data.description,
              url: page.url,
              structured,
              tag: page.locale,
            });
          }

          return Response.json(documents);
        },
      });
    },
  };
}
