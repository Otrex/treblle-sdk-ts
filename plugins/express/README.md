# Treblle Express Integration Documentation 

This documentation guides you on how to integrate Treblle with your Express.js application using the **TreblleExpress** class, which is designed to provide monitoring and error tracking capabilities.

![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![ts](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
## Introduction

Treblle is a powerful tool for monitoring and enhancing the observability of your web applications. By integrating Treblle with your **Express.js** project, you can gain valuable insights into your application's performance and diagnose errors effectively.

The **TreblleExpress** class is a simple yet powerful way to add Treblle's monitoring and error tracking features to your Express application.

## Prerequisites

Before implementing Treblle Express integration, ensure the following prerequisites are met:

- You have an existing Express.js application.
- Node.js and npm are installed on your system.
- You have the Treblle API key and project ID, which you can obtain from the Treblle website.
Integration Steps
- To integrate Treblle with your Express.js application, follow these steps:

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

In your Express application, import the required dependencies, including the TreblleExpress class and Express-specific components:

```ts
import express from "express";
import {TreblleExpress} from "treblle-sdk-ts/plugins"; 

const app = express();
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

Utilize the TreblleExpress.plugin method to create an Express middleware that acts as a Treblle plugin. This middleware captures and logs request and response data.

```ts
const treblleMiddleware = TreblleExpress.plugin(treblleConfig);
app.use(treblleMiddleware);
```

The treblleMiddleware should be added to your Express application using the app.use method. This middleware will automatically collect and log relevant data for each incoming request and response.

#### Start the Express Application

Start your Express application as usual. For example:

```ts
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}`);
});
```

Your Express application is now integrated with Treblle. It will capture and log valuable data, including request and response details, errors, and performance metrics.

## Customization

The `TreblleExpress` class offers customization options by providing methods to extract request and response data. You can adapt these methods to your specific requirements if needed.

### Customizing `extractRequestData(req: Request)`

To adapt the `extractRequestData(req: Request)` method to your specific requirements, make sure that the data you return follows the structure defined in [TrebllePluginRequest](docs/types.md#TrebllePluginRequest):


You can customize the `extractRequestData` method to capture additional data or manipulate the existing data as needed to provide a more comprehensive request payload for Treblle.

### Customizing `extractResponseData(res: Response & { body: any })`

To adapt the `extractResponseData(res: Response & { body: any })` method, ensure that the data returned conforms to the following structure defined in [TrebllePluginResponse](docs/types.md#TrebllePluginResponse)

You have the flexibility to customize this method to extract additional information from the response or modify the existing response data to better suit your monitoring and tracking requirements.

Customizing these methods allows you to tailor the data captured by Treblle to meet your specific needs and gain deeper insights into your application's behavior and performance.

## Conclusion

By integrating Treblle with your Express.js application using the TreblleExpress class, you gain enhanced monitoring and error tracking capabilities. You can access your application's data and error reports through the Treblle dashboard, helping you identify and resolve issues to improve your application's reliability and performance.
