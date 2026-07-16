//#region src/utils/encryption-runtime.d.ts
declare function encryptActionBoundArgs(originalValue: unknown): Promise<string>;
declare function decryptActionBoundArgs(encrypted: ReturnType<typeof encryptActionBoundArgs>): Promise<unknown>;
//#endregion
export { decryptActionBoundArgs, encryptActionBoundArgs };