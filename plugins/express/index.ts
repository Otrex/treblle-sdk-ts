import { Request, RequestHandler } from "express";
import TreblleCore, { TrebllePluginPayload, TreblleConfig } from "../../core";

export default class TreblleExpress {
  private static treblleCore: TreblleCore;

  private static setup(config: TreblleConfig) {
    TreblleExpress.treblleCore = new TreblleCore({
      ...config,
    });
  }

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

  private static extractRequestData(req: Request): TrebllePluginPayload['request'] {
    const reqBody = req.body || {}; 
    const reqQuery = req.query || {}; 
    const reqParams = req.params || {}; 

    return {
      ip: req.ip,
      body: { ...reqBody, ...reqQuery, ...reqParams },
      method: req.method as any,
      headers: req.headers,
      user_agent: req.headers['user-agent'] || 'no-agent',
      url: `${req.protocol}://${req.headers['host']}${req.originalUrl}`,
    }
  }

  private static extractResponseData(res: any): TrebllePluginPayload['response'] {
    return {
      headers: res.getHeaders(),
      code: res.statusCode,
      size: res.get('content-length'),
      load_time: process.hrtime(),
      body: res.body || {}
    }
  }

  private static extractServerData(req: any) {
    return {
      ip: req.ip,
      software: null,
      signature: null,
      protocol: `${req.protocol}/${req.httpVersion}`,
      encoding: null
    }
  }
}