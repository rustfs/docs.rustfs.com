"use client";

import { useEffect, useId, useState } from "react";

/**
 * Client-side Mermaid renderer.
 *
 * The `remark-mdx-mermaid` plugin turns ```mermaid code fences into
 * `<Mermaid chart="..." />` elements, which are rendered here in the browser.
 */
export function Mermaid({ chart }: { chart: string }) {
  const rawId = useId();
  const [svg, setSvg] = useState("");

  useEffect(() => {
    let active = true;

    async function render() {
      const { default: mermaid } = await import("mermaid");
      const isDark = document.documentElement.classList.contains("dark");

      mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? "dark" : "default",
        securityLevel: "loose",
        fontFamily: "inherit",
      });

      const id = `mermaid-${rawId.replace(/[^a-zA-Z0-9-]/g, "")}`;
      try {
        const { svg } = await mermaid.render(id, chart);
        if (active) setSvg(svg);
      } catch (error) {
        if (active) {
          setSvg(
            `<pre class="text-fd-muted-foreground">${String(error)}</pre>`,
          );
        }
      }
    }

    void render();
    return () => {
      active = false;
    };
  }, [chart, rawId]);

  return (
    <div
      className="my-4 flex justify-center [&_svg]:max-w-full"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
