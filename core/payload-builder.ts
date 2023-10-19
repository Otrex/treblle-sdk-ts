import { TrebllePluginPayload, TreblleConfig } from "./types";
import os from "node:os";

import {
  name as sdkName, //
  version as sdkVersion
} from "../package.json";

export default class PayloadBuilder {
  private maskedFields = [
    "password",
    "pwd",
    "secret",
    "password_confirmation",
    "passwordConfirmation",
    "cc",
    "card_number",
    "cardNumber",
    "ccv",
    "ssn",
    "credit_score",
    "creditScore",
  ];

  constructor(private config: TreblleConfig) {
    this.maskedFields = [
      ...this.maskedFields, //
      ...config.additionalFieldsToMask
    ];
  }

  public prepare<T extends TrebllePluginPayload>(data: T) {
    const payload = this.injectDefaultPayload(data);
    return this.maskedSensitiveFields(payload);
  }

  private injectDefaultPayload<T extends TrebllePluginPayload>(data: T) {
    return {
      api_key: this.config.apiKey,
      project_id: this.config.projectId,
      version: sdkVersion,
      sdk: sdkName,
      data: {
        server: {
          software: null,
          signature: null,
          protocol: null,
          os: {
            name: os.platform(),
            release: os.release(),
            architecture: os.arch(),
          },
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          ...data.server,
        },
        language: {
          ...GeneratePayload.languageData(),
          ...data.language
        },
        request: {
          ...GeneratePayload.requestData(),
          ...data.request
        },
        response: {
          ...data.response,
          ...GeneratePayload.responseData(data.response)
        },
        errors: data.errors,
      }
    };;
  }

  private maskedSensitiveFields(obj: trebllePayloadDataBody) {
    return maskFields(obj, this.maskedFields);
  }
}