"use client";

import {
  Tab,
  Tabs as FumadocsTabs,
  type TabsProps,
} from "fumadocs-ui/components/tabs";

export { Tab };

/**
 * Documentation tabs with shareable anchors enabled by default.
 *
 * Give every Tab a page-unique `id`; selecting it updates the URL hash, and
 * opening that hash activates the matching panel.
 */
export function Tabs({
  className,
  updateAnchor = true,
  ...props
}: TabsProps) {
  return (
    <FumadocsTabs
      {...props}
      updateAnchor={updateAnchor}
      className={(state) =>
        [
          "rustfs-tabs",
          typeof className === "function" ? className(state) : className,
        ]
          .filter(Boolean)
          .join(" ")
      }
    />
  );
}
