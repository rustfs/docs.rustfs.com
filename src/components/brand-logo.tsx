"use client";

import { FaApple, FaLinux, FaWindows } from "react-icons/fa6";
import { SiDocker, SiHelm, SiKubernetes, SiPodman } from "react-icons/si";

const logos = {
  apple: FaApple,
  docker: SiDocker,
  helm: SiHelm,
  kubernetes: SiKubernetes,
  linux: FaLinux,
  podman: SiPodman,
  windows: FaWindows,
} as const;

export function BrandLogo({ name }: { name: keyof typeof logos }) {
  const Logo = logos[name];

  return <Logo aria-hidden="true" focusable="false" />;
}