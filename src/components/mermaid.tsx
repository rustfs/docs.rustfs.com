"use client";

import { useEffect, useId, useRef, useState } from "react";
import { DeploymentDiagram, getDeploymentModel } from "./deployment-diagram";

/**
 * Client-side Mermaid renderer.
 *
 * The `remark-mdx-mermaid` plugin turns ```mermaid code fences into
 * `<Mermaid chart="..." />` elements, which are rendered here in the browser.
 */
export function Mermaid({ chart, locale }: { chart: string; locale?: string }) {
  const deployment = getDeploymentModel(chart);
  return deployment ? <DeploymentDiagram model={deployment} locale={locale} /> : <MermaidChart chart={chart} />;
}

function MermaidChart({ chart }: { chart: string }) {
  const rawId = useId();
  const container = useRef<HTMLDivElement>(null);
  const revision = useRef(0);
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function render() {
      const current = ++revision.current;
      const { default: mermaid } = await import("mermaid");
      if (!active || current !== revision.current || !container.current) return;
      const palette = getComputedStyle(container.current);
      const color = (name: string) => palette.getPropertyValue(`--diagram-${name}`).trim();

      mermaid.initialize({
        startOnLoad: false,
        theme: "base",
        securityLevel: "loose",
        fontFamily: palette.fontFamily,
        themeVariables: {
          fontSize: "14px",
          primaryColor: color("surface"),
          primaryTextColor: color("ink"),
          primaryBorderColor: color("border"),
          lineColor: color("line"),
          secondaryColor: color("surface"),
          tertiaryColor: color("zone"),
          edgeLabelBackground: color("zone"),
        },
        flowchart: { curve: "stepAfter", nodeSpacing: 40, rankSpacing: 56, padding: 20 },
      });

      // Mermaid removes an existing SVG with this ID before rendering. Each
      // revision needs its own ID, including repeated updates to the same theme.
      const id = `mermaid-${rawId.replace(/[^a-zA-Z0-9-]/g, "")}-${current}`;
      try {
        const { svg } = await mermaid.render(id, chart);
        if (active && current === revision.current) {
          const drawing = new DOMParser().parseFromString(svg, "image/svg+xml").documentElement;
          const width = Number(drawing.getAttribute("viewBox")?.split(" ")[2]);
          if (width > 0) drawing.setAttribute("style", `${drawing.getAttribute("style") ?? ""};min-width:${Math.ceil(width * 12 / 14)}px`);
          drawing.querySelectorAll(".node").forEach((node) => {
            if (node.querySelector(".nodeLabel")?.textContent?.includes("RustFS")) node.classList.add("rustfs-diagram-focal");
          });
          setSvg(drawing.outerHTML);
          setError("");
        }
      } catch (error) {
        if (active && current === revision.current) {
          setError(String(error));
        }
      }
    }

    void render();
    const observer = new MutationObserver(() => void render());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => {
      active = false;
      observer.disconnect();
    };
  }, [chart, rawId]);

  return (
    <div ref={container} className="rustfs-diagram rustfs-diagram--mermaid">
      {error ? <pre className="text-fd-muted-foreground">{error}</pre> : (
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}
    </div>
  );
}
