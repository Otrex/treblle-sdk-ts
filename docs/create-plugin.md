# Creating A Treblle Plugin

Here we'll demonstrate how you can create a Treblle plugin for your specific framework or application.


## Customization

The `TreblleExpress` class offers customization options by providing methods to extract request and response data. You can adapt these methods to your specific requirements if needed.

### Customizing `extractRequestData(req: Request)`

To adapt the `extractRequestData(req: Request)` method to your specific requirements, make sure that the data you return follows the structure defined in [TrebllePluginRequest](docs/types.md#TrebllePluginRequest):


You can customize the `extractRequestData` method to capture additional data or manipulate the existing data as needed to provide a more comprehensive request payload for Treblle.

### Customizing `extractResponseData(res: Response & { body: any })`

To adapt the `extractResponseData(res: Response & { body: any })` method, ensure that the data returned conforms to the following structure defined in [TrebllePluginResponse](docs/types.md#TrebllePluginResponse)

You have the flexibility to customize this method to extract additional information from the response or modify the existing response data to better suit your monitoring and tracking requirements.

Customizing these methods allows you to tailor the data captured by Treblle to meet your specific needs and gain deeper insights into your application's behavior and performance.
