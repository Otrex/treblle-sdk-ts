import { Request, RequestHandler } from "express";
import TreblleCore, { TrebllePluginPayload, TreblleConfig } from "../../core";

/**
 * A class to integrate Treblle with an Express.js application.
 */
export default class TreblleExpress {
  /**
   * The TreblleCore instance used for monitoring and logging.
   * @type {TreblleCore}
   * @private
   */
  private static treblleCore: TreblleCore;

  /**
   * Set up the TreblleCore instance with the provided configuration.
   * @param {TreblleConfig} config - The Treblle configuration object.
   * @private
   */
  private static setup(config: TreblleConfig) {
    TreblleExpress.treblleCore = new TreblleCore({
      ...config,
    });
  }

  /**
   * Create an Express.js middleware that acts as a Treblle plugin.
   * This middleware collects and logs request and response data.
   * @param {TreblleConfig} config - The Treblle configuration object.
   * @returns {RequestHandler} - Express.js RequestHandler middleware.
   */
  static plugin(config: TreblleConfig): RequestHandler {
    if (!(TreblleExpress.treblleCore instanceof TreblleCore)) {
      TreblleExpress.setup(config);
    }

    return async (req, res, next) => {
      let responseData = '';
      const Handler = TreblleExpress.treblleCore;
      const originalSend = res.send;

      res.send = function (body?: any) {
        responseData = body;
        return originalSend.call(res, body);
      }


      res.on("finish", () => {
        const $res = Object.assign(res, {
          ...(responseData ? JSON.parse(`{"body":${responseData} }`) : {}),
        })

        Handler.start<TrebllePluginPayload>({
          request: TreblleExpress.extractRequestData(req),
          response: TreblleExpress.extractResponseData($res),
          server: TreblleExpress.extractServerData(req),
          language: {},
          errors: [],
        });
      });

      next();
    };
  };

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
   * @param {any} res - The Express Response object.
   * @returns {TrebllePluginPayload['response']} - The response data as a TrebllePluginPayload object.
   * @private
   */
  private static extractResponseData(res: any): TrebllePluginPayload['response'] {
    return {
      headers: res.getHeaders(),
      code: res.statusCode,
      size: res.get('content-length'),
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
