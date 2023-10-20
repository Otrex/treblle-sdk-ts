import Koa from 'koa';
import TreblleCore, { TrebllePluginPayload, TreblleConfig } from "../../core";

/**
 * A class to integrate Treblle with a Koa application.
 */
export default class TreblleKoa {
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
    TreblleKoa.treblleCore = new TreblleCore({
      ...config,
    });
  }

  /**
   * Create a Koa middleware that acts as a Treblle plugin.
   * This middleware collects and logs request and response data.
   * @param {TreblleConfig} config - The Treblle configuration object.
   * @returns {Function} - Koa middleware function.
   */
  static plugin = (config: TreblleConfig) => {
    if (!(TreblleKoa.treblleCore instanceof TreblleCore)) {
      TreblleKoa.setup(config);
    }

    return async (ctx: Koa.ParameterizedContext, next: any) => {
      await next();

      TreblleKoa.treblleCore.start<TrebllePluginPayload>({
        request: TreblleKoa.extractRequestData(ctx),
        response: TreblleKoa.extractResponseData(ctx),
        language: {},
        errors: [],
        server: TreblleKoa.extractServerData(ctx),
      });
    };
  };

  /**
   * Extract relevant data from a Koa context for the request.
   * @param {Koa.ParameterizedContext} ctx - The Koa ParameterizedContext object.
   * @returns {TrebllePluginPayload['request']} - The request data as a TrebllePluginPayload object.
   * @private
   */
  private static extractRequestData(ctx: Koa.Context): TrebllePluginPayload['request'] {
    return {
      ip: ctx.ip,
      url: ctx.href,
      user_agent: ctx.headers['user-agent'] || 'no-agent',
      method: ctx.method,
      headers: {
        host: ctx.headers['host'] || "localhost",
        "user-agent": ctx.headers['user-agent'] || 'no-agent',
        ...ctx.headers,
      },
      body: {
        ...(ctx.request as (Koa.Context['request'] & { body: any })).body,
        ...ctx.request.query
      } || {},
    };
  }

  /**
   * Extract relevant data from a Koa context for the response.
   * @param {Koa.ParameterizedContext} ctx - The Koa ParameterizedContext object.
   * @returns {TrebllePluginPayload['response']} - The response data as a TrebllePluginPayload object.
   * @private
   */
  private static extractResponseData(ctx: Koa.ParameterizedContext): TrebllePluginPayload['response'] {
    return {
      headers: ctx.response.headers,
      code: ctx.status,
      size: ctx.length,
      body: ctx.body || {},
    };
  }

  /**
   * Extract server-related data from a Koa context.
   * @param {Koa.ParameterizedContext} ctx - The Koa ParameterizedContext object.
   * @returns {Object} - Server data with IP and protocol information.
   * @private
   */
  private static extractServerData(ctx: Koa.ParameterizedContext) {
    return {
      ip: ctx.ip,
      protocol: `${ctx.request.protocol}/${ctx.req.httpVersion}`,
    };
  }
}
