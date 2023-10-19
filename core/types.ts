import { IncomingHttpHeaders } from "http2";

/**
 * Represents Treblle Config.
 * @param {string} apiKey - API Key from Treblle
 * @param {string} projectId: ProjectId fro Treblle
 * @param {string} additionalFieldsToMask: fields to mask from treblle
 */
export type TreblleConfig = {
  apiKey: string;
  projectId: string;
  additionalFieldsToMask?: string[];
};

/**
 * Represents a request within a Treblle plugin payload.
 * @interface TreblleRequest
 */
export interface TrebllePluginRequest {
  body: Record<string, any>;
  ip?: string;
  url: string;
  method: string | "post" | "put" | "delete" | "patch" | "head" | "get";
  headers: {
    "host": string;
    "user-agent": string;
    "content-type"?: string;
    "content-length"?: string;
  } & IncomingHttpHeaders;
  user_agent: string;
}

/**
 * Represents a response within a Treblle plugin payload.
 * @interface TrebllePluginResponse
 */
export interface TrebllePluginResponse {
  headers: Record<string, any>;
  code: number;
  size: number | string;
  load_time?: number;
  body: string | Buffer | Record<string, any>;
}

/**
 * Represents server information within a Treblle plugin payload.
 * @interface TrebllePluginServer
 */
export interface TrebllePluginServer {
  ip: string;
  software?: string;
  signature?: string;
  protocol?: string;
  encoding?: string;
}

/**
 * Represents language information within a Treblle plugin payload.
 * @interface TrebllePluginLanguage
 */
export interface TrebllePluginLanguage {
  display_errors?: string | null;
  expose_php?: string | null;
}

/**
 * Represents an error within a Treblle plugin payload.
 * @interface TrebllePluginError
 */
export interface TrebllePluginError {
  source?: string;
  type?: string;
  message?: string;
  file?: string;
  line?: number;
}
/**
 * Represents a Treblle plugin payload, containing request, response, server, language, and error information.
 * @interface TrebllePluginPayload
 */
export interface TrebllePluginPayload {
  request: TrebllePluginRequest;
  response: TrebllePluginResponse;
  server: TrebllePluginServer;
  language?: TrebllePluginLanguage;
  errors?: TrebllePluginError[];
}