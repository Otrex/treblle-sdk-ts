import * as hapi from "@hapi/hapi";
import { version as treblleVersion } from "../../package.json";
import TreblleCore, { TrebllePluginPayload, TreblleConfig } from "../../core";
import TrebllePlugin from "../base";

/**
 * A class to integrate Treblle with a Hapi.js application.
 */
export default class TreblleHapi extends TrebllePlugin {
  static plugin: hapi.Plugin<TreblleConfig> = {
    name: "TreblleHapi",
    version: treblleVersion,
    register(server, options) {
      const treblleCore = TreblleHapi.getInstance(options);
      server.ext("onPreResponse", function (request, h) {
        const response = request.response as any;

        let responseData = '';
        response.events?.on('peek', (chunk: string) => {
          responseData += chunk.toString()
        });

        response.events?.once('finish', () => {
          const $request = Object.assign(request, {
            getIp() {
              const xFF = request.headers['x-forwarded-for']
              return xFF ? xFF.split(',')[0] : request.info.remoteAddress
            }
          })
          const $response = Object.assign(response, {
            body: responseData,
          });

          treblleCore.start({
            request: TreblleHapi.extractRequestData($request),
            response: TreblleHapi.extractResponseData($response),
            server: TreblleHapi.extractServerData($request),
            errors: [],
          });
        });

        return h.continue
      })
    },
  };

  static extractRequestData(req: hapi.Request & { getIp(): string }) {
    return {
      ip: req.getIp(),
      body: { ...req.payload as any, ...req.query, ...req.params },
      method: req.method as any,
      headers: {
        "user-agent": req.headers["user-agent"],
        "host": req.headers["host"],
        ...req.headers
      },
      user_agent: req.headers['user-agent'] || 'no-agent',
      url: req.url.toString(),
    }
  }

  private static extractResponseData(res: hapi.ResponseObject & { body: string }) {
    return {
      headers: {},
      code: res.statusCode,
      size: 300,
      body: res.body
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
