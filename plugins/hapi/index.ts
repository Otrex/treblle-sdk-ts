import * as hapi from "@hapi/hapi";
import { version as treblleVersion } from "../../package.json";
import TreblleCore, { TrebllePluginPayload, TreblleConfig } from "../../core";

export default class TreblleHapi {
  private static handler: TreblleCore;

  static setup(cfg: TreblleConfig) {
    TreblleHapi.handler = new TreblleCore({
      ...cfg,
    });
  }

  static plugin: hapi.Plugin<TreblleConfig> = {
    name: "TreblleHapi",
    version: treblleVersion,
    register(server, options) {
      if (!(TreblleHapi.handler instanceof TreblleCore)) {
        TreblleHapi.setup(options);
      }
      server.ext("onPreResponse", function (request, h) {
        const response = request.response as any;
        const Handler = TreblleHapi.handler;

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

  private static extractServerData(req: hapi.Request & { getIp(): string }) {
    return {
      ip: req.getIp(),
      protocol: req.url.protocol,
    }
  }
}
