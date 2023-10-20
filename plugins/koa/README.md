# Treblle Koa Integration Documentation 

This documentation guides you on how to integrate Treblle with your Koa application using the **TreblleKoa** class, which is designed to provide monitoring and error tracking capabilities.

![Koa](https://img.shields.io/badge/Koa-%23404d59.svg?style=for-the-badge&logo=Koa&logoColor=%2361DAFB) ![ts](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

## Introduction

Treblle is a powerful tool for monitoring and enhancing the observability of your web applications. By integrating Treblle with your **Koa** project, you can gain valuable insights into your application's performance and diagnose errors effectively.

The **TreblleKoa** class is a simple yet powerful way to add Treblle's monitoring and error tracking features to your Koa application.

## Prerequisites

Before implementing Treblle Koa integration, ensure the following prerequisites are met:

- You have an existing Koa application.
- Node.js and npm are installed on your system.
- You have the Treblle API key and project ID, which you can obtain from the Treblle website.
Integration Steps
- To integrate Treblle with your Koa application, follow these steps:

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

In your Koa application, import the required dependencies, including the TreblleKoa class and Koa-specific components:

```ts
import Koa from 'koa';
import {TreblleKoa} from "treblle-sdk-ts/plugins"; 

const app = new Koa();
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

Utilize the TreblleKoa.plugin method to create an Koa middleware that acts as a Treblle plugin. This middleware captures and logs request and response data.

```ts
const treblleMiddleware = TreblleKoa.plugin(treblleConfig);
app.use(treblleMiddleware);
```

The treblleMiddleware should be added to your Koa application using the app.use method. This middleware will automatically collect and log relevant data for each incoming request and response.

#### Start the Koa Application

Start your Koa application as usual. For example:

```ts
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Koa app listening on port ${PORT}`);
});
```

Your Koa application is now integrated with Treblle. It will capture and log valuable data, including request and response details, errors, and performance metrics.

## Conclusion

By integrating Treblle with your Koa application using the TreblleKoa class, you gain enhanced monitoring and error tracking capabilities. You can access your application's data and error reports through the Treblle dashboard, helping you identify and resolve issues to improve your application's reliability and performance.
