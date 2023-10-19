/**
 * Represents Treblle Config.
 * @param {string} apiKey - API Key from Treblle
 * @param {string} projectId: ProjectId fro Treblle
 * @param {string} additionalFieldsToMask: fields to mask from treblle
 *
 */
export type TreblleConfig = {
  apiKey: string;
  projectId: string;
  additionalFieldsToMask: string[];
};


export interface TrebllePluginPayload {
  request: {
    body: Record<string, any>;
    ip?: string;
    url: string;
    method: string | "post" | "put" | "delete" | "patch" | "head";
    headers: {
      "host": string;
      "user-agent": string;
      "content-type"?: string;
      "content-length"?: string;
    },
    user_agent: string;
  };
  response: {
    headers: Record<string, any>;
    code: number;
    size: number | string;
    load_time: number;
    body: string | Buffer | Record<string, any>;
  };
  server: {
    ip: string;
    software?: string;
    signature?: string;
    protocol?: string;
    encoding?: string;
  };
  language?: {
    display_errors?: string | null;
    expose_php?: string | null;
  },
  errors?: {
    source?: string;
    type?: string;
    message?: string;
    file?: string;
    line?: number;
  }[]
}
