import { Request, RequestHandler, Response } from "express";
import TreblleCore, { TrebllePluginPayload, TreblleConfig } from "../../core";
import TrebllePlugin from "../base";

/**
 * A class to integrate Treblle with an Express.js application.
 */
export default class TreblleExpress extends TrebllePlugin {
  /**
   * Create an Express.js middleware that acts as a Treblle plugin.
   * This middleware collects and logs request and response data.
   * @param {TreblleConfig} config - The Treblle configuration object.
   * @returns {RequestHandler} - Express.js RequestHandler middleware.
   */
  static plugin(config: TreblleConfig): RequestHandler {
    const treblleCore = TreblleExpress.getInstance(config);

    return async (req, res, next) => {
      let responseData = '';
      const originalSend = res.send;

      res.send = function (body?: any) {
        responseData = body;
        return originalSend.call(res, body);
      }


      res.on("finish", function () {
        const $res = Object.assign(res, {
          ...(responseData
            ? JSON.parse(`{"body":${responseData} }`)
            : {}),
        })

        treblleCore.start({
          request: TreblleExpress.extractRequestData(req),
          response: TreblleExpress.extractResponseData($res),
          server: TreblleExpress.extractServerData(req),
          errors: [],
        });
      });

      next();
    };
  };

  private static getResponse(res: Response) {
    return Object.create({
      body: "",

      instance() {

      }
    })
  }

  /**
   * Extract relevant data from an Express.js Request object.
   * @param {Request} req - The Express Request object.
   * @returns {TrebllePluginPayload['request']} - The request data as a TrebllePluginPayload object.
   * @private
   */
  private static extractRequestData(req: Request): TrebllePluginPayload['request'] {
    const reqBody = req.body || {};
    const reqQuery = req.query || {};
    const reqParams = req.params || {};

    return {
      ip: req.ip,
      body: { ...reqBody, ...reqQuery, ...reqParams },
      method: req.method,
      headers: {
        host: req.headers.host || "localhost",
        "user-agent": req.headers['user-agent'] || 'no-agent',
        ...req.headers,
      },
      user_agent: req.headers['user-agent'] || 'no-agent',
      url: `${req.protocol}://${req.headers['host']}${req.originalUrl}`,
    }
  }

  /**
   * Extract relevant data from an Express.js Response object.
   * @param {Response & { body: any }} res - The Express Response object.
   * @returns {TrebllePluginPayload['response']} - The response data as a TrebllePluginPayload object.
   * @private
   */
  private static extractResponseData(res: Response & { body: any }): TrebllePluginPayload['response'] {
    return {
      headers: res.getHeaders(),
      code: res.statusCode,
      size: +(res.get('content-length') || 0),
      body: res.body || {}
    }
  }

  /**
   * Extract server-related data from an Express Request object.
   * @param {any} req - The Express Request object.
   * @returns {Object} - Server data with IP and protocol information.
   * @private
   */
  private static extractServerData(req: any) {
    return {
      ip: req.ip,
      protocol: `${req.protocol}/${req.httpVersion}`,
    }
  }
}
