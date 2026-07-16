import { z } from "zod";
//#region src/source/schema.d.ts
/**
 * Zod 4 schema
 */
declare const metaSchema: z.ZodObject<{
  title: z.ZodOptional<z.ZodString>;
  pages: z.ZodOptional<z.ZodArray<z.ZodString>>;
  pagesIndex: z.ZodOptional<z.ZodString>;
  description: z.ZodOptional<z.ZodString>;
  root: z.ZodOptional<z.ZodBoolean>;
  defaultOpen: z.ZodOptional<z.ZodBoolean>;
  collapsible: z.ZodOptional<z.ZodBoolean>;
  icon: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type _JSONType = number | boolean | string | null | _JSONType[] | {
  [key: string]: _JSONType;
};
/**
 * Zod 4 schema
 */
declare const pageSchema: z.ZodObject<{
  title: z.ZodString;
  description: z.ZodOptional<z.ZodString>;
  icon: z.ZodOptional<z.ZodString>;
  full: z.ZodOptional<z.ZodBoolean>;
  _openapi: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodCustom<_JSONType, _JSONType>>>;
}, z.core.$strip>;
//#endregion
export { _JSONType, metaSchema, pageSchema };