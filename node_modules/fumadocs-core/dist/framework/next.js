"use client";
import { FrameworkProvider } from "./index.js";
import { jsx } from "react/jsx-runtime";
import { useParams, usePathname, useRouter } from "next/navigation.js";
import Link from "next/link.js";
import Image from "next/image.js";
//#region src/framework/next.tsx
function NextProvider({ children, Link: CustomLink, Image: CustomImage }) {
	return /* @__PURE__ */ jsx(FrameworkProvider, {
		usePathname,
		useRouter,
		useParams,
		Link: CustomLink ?? Link,
		Image: CustomImage ?? Image,
		children
	});
}
//#endregion
export { NextProvider };
