//#region src/types/index.d.ts
interface ImportManifestEntry {
  id: string;
  name: string;
  chunks: string[];
  async?: boolean;
}
interface BundlerConfig {
  [bundlerId: string]: ImportManifestEntry;
}
type ModuleMap = {
  [id: string]: {
    [exportName: string]: ImportManifestEntry;
  };
};
interface ServerConsumerManifest {
  moduleMap?: ModuleMap;
  serverModuleMap?: BundlerConfig;
  moduleLoading?: {
    prefix: string;
    crossOriign?: string;
  };
}
type CallServerCallback = (id: string, args: unknown[]) => Promise<unknown>;
interface RenderToReadableStreamOptions {
  debugChannel?: DebugChannel;
  environmentName?: string | (() => string);
  filterStackFrame?: (url: string, functionName: string) => boolean;
  identifierPrefix?: string;
  signal?: AbortSignal;
  startTime?: number;
  temporaryReferences?: ServerTemporaryReferenceSet;
  onError?: (error: unknown) => void;
}
interface CreateFromReadableStreamBrowserOptions {
  callServer?: CallServerCallback;
  debugChannel?: DebugChannel;
  endTime?: number;
  environmentName?: string;
  replayConsoleLogs?: boolean;
  startTime?: number;
  temporaryReferences?: ClientTemporaryReferenceSet;
}
interface CreateFromReadableStreamEdgeOptions {
  debugChannel?: DebugChannel;
  endTime?: number;
  environmentName?: string;
  nonce?: string;
  replayConsoleLogs?: boolean;
  startTime?: number;
  temporaryReferences?: ClientTemporaryReferenceSet;
}
interface DecodeReplyOptions {
  temporaryReferences?: ServerTemporaryReferenceSet;
  arraySizeLimit?: number;
}
interface EncodeReplyOptions {
  temporaryReferences?: ClientTemporaryReferenceSet;
  signal?: AbortSignal;
}
type EncodeReplyFunction = (value: unknown[], options?: EncodeReplyOptions) => Promise<string | FormData>;
type DecodeReplyFunction = (body: string | FormData, options?: DecodeReplyOptions) => Promise<unknown[]>;
type DebugChannel = {
  readable?: ReadableStream<Uint8Array>;
  writable?: WritableStream<Uint8Array>;
};
type ServerTemporaryReferenceSet = unknown;
type ClientTemporaryReferenceSet = unknown;
//#endregion
export { CreateFromReadableStreamEdgeOptions as a, ModuleMap as c, ServerTemporaryReferenceSet as d, CreateFromReadableStreamBrowserOptions as i, RenderToReadableStreamOptions as l, CallServerCallback as n, DecodeReplyFunction as o, ClientTemporaryReferenceSet as r, EncodeReplyFunction as s, BundlerConfig as t, ServerConsumerManifest as u };