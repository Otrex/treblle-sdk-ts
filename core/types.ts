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
  request: {};
  response: {};
  server: {
    ip: string;
    software?: string;
    signature?: string;
    protocol?: string;
    encoding?: string;
  };
  language: {},
  errors: [] | {}[]
}
