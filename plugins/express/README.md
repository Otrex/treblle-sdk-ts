# Treblle Express Integration Documentation

This documentation guides you on how to integrate `Treblle-SDK-TS` with your Express.js application using the **TreblleExpress** class, which is designed to provide monitoring and error tracking capabilities.

![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![ts](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

## Prerequisites

Before implementing Treblle Express integration, ensure the following prerequisites are met:

- Node.js and npm are installed on your system.
- You have the Treblle API key and project ID, which you can obtain from the Treblle website.
Integration Steps

<br/>
To integrate Treblle with your Express.js application, follow these steps:

1. **Installing the Treblle Package**: Make sure you have the Treblle package installed. You can install it with either of the following commands below.

Using NPM:

```bash
npm install treblle-sdk-ts
```

using YARN:

```bash
yarn add treblle-sdk-ts
```

2. **Importing the necessary dependencies**: In your Express application, import the required dependencies, including the TreblleExpress class and Express-specific components:

```ts
import express from "express";
import {TreblleExpress} from "treblle-sdk-ts/plugins"; 

const app = express();
```

3. **Setting up the Treblle configuration:** Create a configuration object that includes your Treblle API key and project ID. You can store these sensitive values in a separate configuration file, like env.js. Ensure you have the required configurations in place before proceeding.

```ts
import env from "path/to/env"; // Update the path

const treblleConfig: TreblleConfig = {
  apiKey: env.apiKey,
  projectId: env.projectId,
};
```

4. **Implementing the Treblle middleware:** Utilize the `TreblleExpress.plugin` method to create an Express middleware that acts as a Treblle plugin. This middleware captures and logs request and response data.

```ts
const treblleMiddleware = TreblleExpress.plugin(treblleConfig);
app.use(treblleMiddleware);
```

The `treblleMiddleware` should be added to your Express application using the app.use method. This middleware will automatically collect and log relevant data for each incoming request and response.

<b>N/B</b>: For post requests, you should have your body parser middleware available. 

5. **Starting the Express application:** Start your Express application with the following:

```ts
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}`);
});
```

Your Express application is now integrated with Treblle. It will capture and log valuable data, including request and response details, errors, and performance metrics.

[Here](../../examples/express/index.ts) is an example file that shows how to configure the Treblle-SDK.
