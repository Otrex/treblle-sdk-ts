# Treblle-SDK-TS

`Treblle-SDK-TS` is a node typescript SDK that provides methods to integrate to [treblle](https://www.treblle.com/) API Monitoring. It can be used to build <b>plugins</b> for various node frameworks. 

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md)

## Table of Contents

- [Description](#description)
<!-- - [Installation](#installation) -->
- [Usage](#usage)
- [Plugin development](#plugin-development)
- [Examples](#examples)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)


## Description

This SDK is intended for use in a Node.js environment.
If you are unfamiliar with Treblle, please visit [treblle](https://www.treblle.com/) website for more info on the product, features and SDK options.



## Prerequisites

It goes without saying that should have an active [Treblle](https://www.treblle.com) project in order for this SDK to be of any use to you. This is because you would require treblle's `api_key` and `project_id` values in order to run the sdk.

<!-- ## Installation

You can install `Treblle-SDK-TS` using npm or yarn:

```bash
npm install your-sdk-name

# OR

yarn add your-sdk-name
``` -->

## Usage
To use `Treblle-SDK-TS` in your Node.js project, you chave to perform the following steps:

1 - importing `TrebbleCore`:

```typescript
//import trebllecore
import TreblleCore from 'treblle-sdk-ts';
```


2 - Create an instance of `TrebbleCore`:

```typescript
// Create an instance of the SDK

const treblleCore = new TreblleCore(config);
```

3 - call `TrebbleCore` <b>start</b> method:

```typescript
// Use the SDK's start method

treblleCore.start(TrebllePluginPayload)
```


The <b>start</b> methods accepts a `TrebllePluginPayload` which is an interface containing `request`, `response`, `server`, `language`, and `error` information that will be sent to treblle.


More information about the interface will be shared in the documentation.


## Plugin Development

`Treblle-SDK-TS` can be used to create plugins for any node.js framework of choice. These plugins can be added to the middleware of these frameworks.


In this project, we illustrated plugin development using three node frameworks



* [Express](plugins/express/README.md)
* [Koa](plugins/koa/README.md)
* [Hapi](plugins/hapi/README.md)

We  also have example files for the usage of these plugins in the project.

## Examples
We've provided some example code in the examples directory to help you get started quickly. You can find examples for various use cases there.

To run the examples, follow these steps:


1 - <b>cd</b> into the example directory from the root directory:


```bash
cd examples
```

Once you access the examples directory, you will see the list of the sample projects in the order of `express`,   `hapi` and `koa`

2 - Run the example script we have provided for the individual sample to start their respective servers:


* <b>Express</b>

```bash
npm example:express

# OR

yarn example:express

```

* <b>Hapi</b>

```bash
npm example:hapi

# OR

yarn example:hapi
```

* <b>Koa</b>

```bash
npm example:koa

# OR

yarn example:koa
```

3 - Access the routes present in the respective examples with a client (<b>Postman</b> or <b>ThunderClient</b>):


## Documentation
For detailed information on how to use `Treblle-SDK-TS` and its available methods, please refer to the official documentation.

## Contributing

We welcome contributions from the community. To contribute to ``Treblle-SDK-TS``, follow these steps:

* Fork the repository on GitHub.
* Clone your fork locally.
* Create a new branch with a descriptive name.
* Make your changes and commit them.
* Push your branch to your fork on GitHub.
* Create a pull request from your fork to the main repository.

## License

`Treblle-SDK-TS` is released under the <b>MIT License</b>.
