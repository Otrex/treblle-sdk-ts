# Treblle Hapi Integration Documentation 

This documentation guides you on how to integrate Treblle with your Hapi.js application using the **TreblleHapi** class, which is designed to provide monitoring and error tracking capabilities.

![Hapi.js](https://img.shields.io/badge/hapi.js-%23404d59.svg?style=for-the-badge&logo=hapi&logoColor=%2361DAFB) ![ts](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

## Introduction

Treblle is a powerful tool for monitoring and enhancing the observability of your web applications. By integrating Treblle with your **Hapi.js** project, you can gain valuable insights into your application's performance and diagnose errors effectively.

The **TreblleHapi** class is a simple yet powerful way to add Treblle's monitoring and error tracking features to your Hapi application.

## Prerequisites

Before implementing Treblle Hapi integration, ensure the following prerequisites are met:

- You have an existing Hapi.js application.
- Node.js and npm are installed on your system.
- You have the Treblle API key and project ID, which you can obtain from the Treblle website.
#### Integration Steps
- To integrate Treblle with your Hapi.js application, follow these steps:

#### Install the Treblle Package

Make sure you have the Treblle package installed. You can install it via npm:

```bash
npm install treblle-sdk-ts
```

or

```bash
yarn add treblle-sdk-ts
```

#### Import Necessary Dependencies

In your Hapi application, import the required dependencies, including the TreblleHapi class and Hapi-specific components:

```ts
import Hapi from "@hapi/hapi"
import {TreblleHapi} from "treblle-sdk-ts/plugins"; 

 const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  });
```

#### Set Up Treblle Configuration

Create a configuration object that includes your Treblle API key and project ID. You can store these sensitive values in a separate configuration file, like env.js. Ensure you have the required configurations in place before proceeding.

```ts
import env from "path/to/env"; // Update the path

const treblleConfig: TreblleConfig = {
  apiKey: env.apiKey,
  projectId: env.projectId,
};
```

#### Implement Treblle Middleware

Utilize the TreblleHapi.plugin method to create a Hapi middleware that acts as a Treblle plugin. This middleware captures and logs request and response data.

```ts
await server.register({
  plugin: TreblleHapi.plugin,
  options: {
    ...env
  }
});
```

The treblleMiddleware should be added to your Hapi application using the app.use method. This middleware will automatically collect and log relevant data for each incoming request and response.

#### Start the Hapi Application

Start your Hapi application as usual. For example:

```ts
await server.start();
console.log('Server running on %s', server.info.uri);
```

Your Hapi application is now integrated with Treblle. It will capture and log valuable data, including request and response details, errors, and performance metrics.

## Conclusion

By integrating Treblle with your Hapi.js application using the TreblleHapi class, you gain enhanced monitoring and error tracking capabilities. You can access your application's data and error reports through the Treblle dashboard, helping you identify and resolve issues to improve your application's reliability and performance.