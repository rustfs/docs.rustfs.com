import { unstable_redirect } from "waku/router/server";

export function getConfig() {
  return {
    render: "dynamic" as const,
    autoI18n: false,
  };
}

export default function RootPage() {
  unstable_redirect("/en", 307);
}