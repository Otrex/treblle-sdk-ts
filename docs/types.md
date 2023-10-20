# Treblle Plugin Documentation

## Introduction

The Treblle Plugin provides a way to integrate Treblle's monitoring and debugging tools into your application. This documentation outlines the key interfaces and types used in the Treblle Plugin for Node.js. Treblle helps you monitor, analyze, and troubleshoot issues in your Node.js applications.

To use the Treblle Plugin effectively, you'll need to understand the following configurations and data structures.

## Treblle Config

The `TreblleConfig` type represents the configuration settings required to initialize the Treblle Plugin.

```typescript
import { IncomingHttpHeaders } from "http2";

/**
 * Represents Treblle Config.
 * @param {string} apiKey - API Key from Treblle
 * @param {string} projectId: ProjectId for Treblle
 * @param {string} additionalFieldsToMask: Fields to mask from Treblle
 */
export type TreblleConfig = {
  apiKey: string;
  projectId: string;
  additionalFieldsToMask?: string[];
};
```

- `apiKey` (string): Your Treblle API key.
- `projectId` (string): The ID of the Treblle project.
- `additionalFieldsToMask` (optional): An array of field names to be masked in the request data. Use this to hide sensitive information.

## TrebllePluginRequest

The `TrebllePluginRequest` interface represents a request within a Treblle plugin payload.

```typescript
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
```

- `body` (Record<string, any>): The request body data.
- `ip` (optional): The IP address of the client making the request.
- `url` (string): The URL of the request.
- `method` (string): The HTTP request method (e.g., "post," "get," etc.).
- `headers` (object): The request headers, including common HTTP headers and those from the `http2` module.
- `user_agent` (string): The User-Agent header of the request.

## TrebllePluginResponse

The `TrebllePluginResponse` interface represents a response within a Treblle plugin payload.

```typescript
export interface TrebllePluginResponse {
  headers: Record<string, any>;
  code: number;
  size: number | string;
  load_time?: number;
  body: string | Buffer | Record<string, any>;
}
```

- `headers` (Record<string, any>): The response headers.
- `code` (number): The HTTP status code of the response.
- `size` (number | string): The size of the response in bytes or as a string.
- `load_time` (optional): The response load time in milliseconds.
- `body` (string | Buffer | Record<string, any>): The response body, which can be a string, a Buffer, or other structured data.

## TrebllePluginServer

The `TrebllePluginServer` interface represents server information within a Treblle plugin payload.

```typescript
export interface TrebllePluginServer {
  ip: string;
  software?: string;
  signature?: string;
  protocol?: string;
  encoding?: string;
}
```

- `ip` (string): The IP address of the server.
- `software` (optional): The server software information.
- `signature` (optional): The server's signature or identification.
- `protocol` (optional): The server's protocol.
- `encoding` (optional): The content encoding used by the server.

## TrebllePluginLanguage

The `TrebllePluginLanguage` interface represents language information within a Treblle plugin payload.

```typescript
export interface TrebllePluginLanguage {
  display_errors?: string | null;
  expose_php?: string | null;
}
```

- `display_errors` (optional): Information about displaying errors in the application.
- `expose_php` (optional): Information about exposing PHP in the application.

## TrebllePluginError

The `TrebllePluginError` interface represents an error within a Treblle plugin payload.

```typescript
export interface TrebllePluginError {
  source?: string;
  type?: string;
  message?: string;
  file?: string;
  line?: number;
}
```

- `source` (optional): The source of the error.
- `type` (optional): The type or category of the error.
- `message` (optional): The error message.
- `file` (optional): The file where the error occurred.
- `line` (optional): The line number in the file where the error occurred.

## TrebllePluginPayload

The `TrebllePluginPayload` interface represents a complete Treblle plugin payload, containing request, response, server, language, and error information.

```typescript
export interface TrebllePluginPayload {
  request: TrebllePluginRequest;
  response: TrebllePluginResponse;
  server: TrebllePluginServer;
  language?: TrebllePluginLanguage;
  errors?: TrebllePluginError[];
}
```

- `request` (TrebllePluginRequest): The request information.
- `response` (TrebllePluginResponse): The response information.
- `server` (TrebllePluginServer): The server information.
- `language` (optional, TrebllePluginLanguage): The language information.
- `errors` (optional, TrebllePluginError[]): An array of error objects.

This documentation provides a comprehensive overview of the Treblle Plugin for Node.js and the data structures used to collect and transmit information to Treblle's monitoring platform.

To use this plugin, make sure to configure the `TreblleConfig` and populate the `TrebllePluginPayload` with relevant data during your application's execution. This enables you to gain insights into your application's behavior and troubleshoot issues effectively with Treblle.