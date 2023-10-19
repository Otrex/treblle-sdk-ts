import * as hapi from "hapi";
import { version as treblleVersion } from "../../package.json";
import TreblleCore, { TrebllePluginPayload, TreblleConfig } from "../../core";

/**
 * A class to integrate Treblle with a Hapi.js application.
 */
export default class TreblleHapi {
  /**
   * The TreblleCore instance used for monitoring and logging.
   * @type {TreblleCore}
   * @private
   */
  private static treblleCore: TreblleCore;

  /**
   * Set up the TreblleCore instance with the provided configuration.
   * @param {TreblleConfig} config - The Treblle configuration object.
   */
  static setup(config: TreblleConfig) {
    TreblleHapi.treblleCore = new TreblleCore({
      ...config,
    });
  }

  /**
   * Create a Hapi.js plugin that acts as a Treblle integration.
   * This plugin collects and logs request and response data.
   * @param {TreblleConfig} config - The Treblle configuration object.
   * @returns {hapi.Plugin<TreblleConfig>} - Hapi.js plugin object.
   */
  static plugin(config: TreblleConfig): hapi.Plugin<TreblleConfig> {
    if (!(TreblleHapi.treblleCore instanceof TreblleCore)) {
      TreblleHapi.setup(config);
    }

    return {
      name: "TreblleHapi",
      version: treblleVersion,
      register(server, options) {
        if (!(TreblleHapi.treblleCore instanceof TreblleCore)) {
          TreblleHapi.setup(options);
        }
        server.ext("onPreResponse", function (request, h) {
          const response = request.response as any;
          const Handler = TreblleHapi.treblleCore;

          let responseData = '';
          response.events.on('peek', (chunk: string) => {
            responseData += chunk.toString()
          });

          response.events.once('finish', () => {
            const $request = Object.assign(request, {
              getIp() {
                const xFF = request.headers['x-forwarded-for']
                return xFF ? xFF.split(',')[0] : request.info.remoteAddress
              }
            })
            const $response = Object.assign(response, {
              body: responseData,
            });

            Handler.start<TrebllePluginPayload>({
              request: TreblleHapi.extractRequestData($request),
              response: TreblleHapi.extractResponseData($response),
              server: TreblleHapi.extractServerData($request),
              language: {},
              errors: [],
            });
          });

          return h.continue
        })
      },
    }
  };

  /**
   * Extract relevant data from a Hapi.js Request object for the request.
   * @param {hapi.Request & { getIp(): string }} req - The Hapi Request object with the `getIp` method.
   * @returns {TrebllePluginPayload['request']} - The request data as a TrebllePluginPayload object.
   * @private
   */
  static extractRequestData(req: hapi.Request & { getIp(): string }): TrebllePluginPayload['request'] {
    return {
      ip: req.getIp(),
      body: {...req.payload as any, ...req.query, ...req.params},
      method: req.method as any,
      headers: req.headers,
      user_agent: req.headers['user-agent'] || 'no-agent',
      url: req.url.toString(),
    }
  }

  /**
   * Extract relevant data from a Hapi.js Request object for the response.
   * @param {hapi.Request["response"]} res - The Hapi Request's response object.
   * @returns {TrebllePluginPayload['response']} - The response data as a TrebllePluginPayload object.
   * @private
   */
  private static extractResponseData(res: hapi.Request["response"]): TrebllePluginPayload['response'] {
    console.log(res);

    return {
      headers: {},
      code: 200,
      size: 300,
      body: res.message
    }
  }

  /**
   * Extract server-related data from a Hapi.js Request object.
   * @param {hapi.Request & { getIp(): string }} req - The Hapi Request object with the `getIp` method.
   * @returns {Object} - Server data with IP and protocol information.
   * @private
   */
  private static extractServerData(req: hapi.Request & { getIp(): string }) {
    return {
      ip: req.getIp(),
      protocol: req.url.protocol,
    }
  }
}
