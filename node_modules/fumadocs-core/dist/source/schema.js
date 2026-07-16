import { z } from "zod";
//#region src/source/schema.ts
/**
* Zod 4 schema
*/
const metaSchema = z.object({
	title: z.string().optional(),
	pages: z.array(z.string()).optional(),
	/** specify a index page for folder */
	pagesIndex: z.string().optional(),
	description: z.string().optional(),
	root: z.boolean().optional(),
	defaultOpen: z.boolean().optional(),
	collapsible: z.boolean().optional(),
	icon: z.string().optional()
});
/**
* Zod 4 schema
*/
const pageSchema = z.object({
	title: z.string(),
	description: z.string().optional(),
	icon: z.string().optional(),
	full: z.boolean().optional(),
	_openapi: z.record(z.string(), z.custom()).optional()
});
//#endregion
export { metaSchema, pageSchema };
