"use client";

import { useId, type CSSProperties } from "react";
import diagrams from "./deployment-diagrams.json";

type Model = {
  kind: string;
  labels: Record<string, string>;
  edges: { source: string; target: string }[];
};
type Box = { x: number; y: number; width: number; height: number };
type Point = [number, number];

const models: Record<string, Model> = diagrams;
const captions = {
  en: { title: "Deployment architecture", compute: "Access and compute", storage: "Storage", connection: "Connection" },
  zh: { title: "部署架构", compute: "访问与计算", storage: "存储", connection: "连接" },
  de: { title: "Bereitstellungsarchitektur", compute: "Zugriff und Verarbeitung", storage: "Speicher", connection: "Verbindung" },
  fr: { title: "Architecture de déploiement", compute: "Accès et traitement", storage: "Stockage", connection: "Connexion" },
  ja: { title: "デプロイ構成", compute: "アクセスと処理", storage: "ストレージ", connection: "接続" },
};

// The original Mermaid sources remain the keys, so an edited graph falls back
// to Mermaid instead of silently displaying an outdated deployment drawing.
export function getDeploymentModel(chart: string) {
  return models[chart.trim()];
}

function roundedPath(points: Point[]) {
  const first = points[0]!;
  let path = `M ${first[0]} ${first[1]}`;
  for (let i = 1; i < points.length - 1; i++) {
    const previous = points[i - 1]!;
    const point = points[i]!;
    const next = points[i + 1]!;
    const incoming = Math.hypot(point[0] - previous[0], point[1] - previous[1]);
    const outgoing = Math.hypot(next[0] - point[0], next[1] - point[1]);
    const radius = Math.min(8, incoming / 2, outgoing / 2);
    const before: Point = [point[0] + (previous[0] - point[0]) * radius / incoming, point[1] + (previous[1] - point[1]) * radius / incoming];
    const after: Point = [point[0] + (next[0] - point[0]) * radius / outgoing, point[1] + (next[1] - point[1]) * radius / outgoing];
    path += ` L ${before[0]} ${before[1]} Q ${point[0]} ${point[1]} ${after[0]} ${after[1]}`;
  }
  const last = points[points.length - 1]!;
  return `${path} L ${last[0]} ${last[1]}`;
}

function layout(model: Model) {
  const boxes: Record<string, Box> = {};
  const routes: Record<string, Point[]> = {};
  if (model.kind === "single") {
    boxes.S = { x: 40, y: 88, width: 184, height: 64 };
    boxes.D1 = { x: 336, y: 88, width: 184, height: 64 };
    routes["S:D1"] = [[224, 120], [332, 120]];
    return { width: 560, height: 240, boxes, routes };
  }
  if (model.kind === "multi-disk") {
    boxes.S = { x: 280, y: 40, width: 160, height: 64 };
    for (let disk = 1; disk <= 4; disk++) {
      const center = 96 + (disk - 1) * 176;
      boxes[`D${disk}`] = { x: center - 56, y: 216, width: 112, height: 56 };
      const port = 312 + (disk - 1) * 32;
      const lane = disk === 1 || disk === 4 ? 136 : 168;
      routes[`S:D${disk}`] = [[port, 104], [port, lane], [center, lane], [center, 212]];
    }
    return { width: 720, height: 360, boxes, routes };
  }
  boxes.LB = { x: 352, y: 64, width: 256, height: 56 };
  for (let server = 1; server <= 4; server++) {
    const base = 40 + (server - 1) * 224;
    boxes[`S${server}`] = { x: base + 32, y: 184, width: 144, height: 56 };
    const center = base + 104;
    const port = 408 + (server - 1) * 48;
    const lane = server === 1 || server === 4 ? 144 : 160;
    routes[`LB:S${server}`] = [[port, 120], [port, lane], [center, lane], [center, 180]];
    for (let disk = 1; disk <= 4; disk++) {
      const left = disk === 1 || disk === 3;
      const diskCenter = base + (left ? 52 : 156);
      const y = disk <= 2 ? 328 : 424;
      boxes[`N${server}D${disk}`] = { x: diskCenter - 44, y, width: 88, height: 48 };
      const source = base + [88, 120, 64, 144][disk - 1]!;
      routes[`S${server}:N${server}D${disk}`] = disk <= 2
        ? [[source, 240], [source, 288], [diskCenter, 288], [diskCenter, y - 4]]
        : [[source, 240], [source, 264], [base + (left ? 0 : 208), 264], [base + (left ? 0 : 208), 400], [diskCenter, 400], [diskCenter, y - 4]];
    }
  }
  return { width: 960, height: 600, boxes, routes };
}

export function DeploymentDiagram({ model, locale = "en" }: { model: Model; locale?: string }) {
  const id = `deployment-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const copy = captions[locale as keyof typeof captions] ?? captions.en;
  const { width, height, boxes, routes } = layout(model);
  const cluster = model.kind === "cluster";
  return (
    <div className="rustfs-diagram rustfs-diagram--deployment" style={{ "--diagram-width": `${width}px`, "--diagram-min-width": `${Math.ceil(width * 12 / 14)}px` } as CSSProperties} role="region" aria-label={copy.title} tabIndex={0}>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={`${id}-title ${id}-desc`} data-deployment={model.kind}>
        <title id={`${id}-title`}>{copy.title}</title>
        <desc id={`${id}-desc`}>{model.edges.map(({ source, target }) => `${model.labels[source]} → ${model.labels[target]}`).join("; ")}</desc>
        <defs>
          <marker id={`${id}-arrow`} viewBox="0 0 8 8" refX="8" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1 L 7 4 L 0 7" className="rustfs-diagram-arrow" /></marker>
        </defs>
        {cluster && <g className="rustfs-diagram-zones">
          <rect x="24" y="24" width="912" height="232" rx="6" className="rustfs-diagram-zone rustfs-diagram-zone--compute" />
          <text x="40" y="48">{copy.compute}</text>
          <rect x="24" y="312" width="912" height="200" rx="6" className="rustfs-diagram-zone" />
          <text x="40" y="500">{copy.storage}</text>
        </g>}
        <g className="rustfs-diagram-edges">
          {model.edges.map(({ source, target }) => <path key={`${source}:${target}`} data-source={source} data-target={target} d={roundedPath(routes[`${source}:${target}`]!)} markerEnd={`url(#${id}-arrow)`} />)}
        </g>
        <g className="rustfs-diagram-nodes">
          {Object.entries(model.labels).map(([node, label]) => {
            const box = boxes[node]!;
            return <g key={node} data-node-id={node} className={!cluster && node === "S" ? "rustfs-diagram-node rustfs-diagram-node--accent" : "rustfs-diagram-node"}>
              <rect {...box} rx="6" />
              <text x={box.x + box.width / 2} y={box.y + box.height / 2} dominantBaseline="middle" textAnchor="middle">{label}</text>
            </g>;
          })}
        </g>
        <g className="rustfs-diagram-legend" transform={`translate(40 ${height - 40})`}>
          <path d="M 0 0 H 28" markerEnd={`url(#${id}-arrow)`} />
          <text x="40" y="0" dominantBaseline="middle">{copy.connection}</text>
        </g>
      </svg>
    </div>
  );
}
