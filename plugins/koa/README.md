# TreblleKoa

`TreblleKoa` is a node typescript plugin (SDK) that provides methods to integrate to [treblle](https://www.treblle.com/) API Monitoring. It is dependent on the `Treblle-SDK-TS` SDK. 




## Usage
To use `TreblleKoa` in your Node.js project, you chave to perform the following steps:

1 - importing `TreblleKoa`:

```typescript
//import trebllecore
import TreblleKoa from 'treblle-koa';
```

3 - call `TrebbleExpress` <b>plugin</b> method:

```typescript
// Use the SDK's start method

treblleCore.start(TrebllePluginPayload)
```
The <b>plugin</b> method creates a `Koa` middleware which collects the request and response data and sends it to treblle.


The <b>plugin</b> methods accepts a `TrebllePluginPayload` which is an interface containing `request`, `response`, `server`, `language`, and `error` information that will be sent to treblle.


More information about the interface will be shared in the documentation.



## Contributing

We welcome contributions from the community. To contribute to ``TreblleKoa``plugin, follow these steps:

* Fork the repository on GitHub.
* Clone your fork locally.
* Create a new branch with a descriptive name.
* Make your changes and commit them.
* Push your branch to your fork on GitHub.
* Create a pull request from your fork to the main repository.