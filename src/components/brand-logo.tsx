"use client";

import { FaApple, FaLinux, FaWindows } from "react-icons/fa6";
import { LuTerminal } from "react-icons/lu";
import { SiDocker, SiHelm, SiKubernetes, SiPodman } from "react-icons/si";

const logos = {
  apple: FaApple,
  docker: SiDocker,
  helm: SiHelm,
  kubernetes: SiKubernetes,
  linux: FaLinux,
  podman: SiPodman,
  swarmcli: LuTerminal,
  windows: FaWindows,
} as const;

export function BrandLogo({ name }: { name: keyof typeof logos }) {
  const Logo = logos[name];

  return <Logo aria-hidden="true" focusable="false" />;
}