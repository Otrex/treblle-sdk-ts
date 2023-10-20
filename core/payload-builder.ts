import { TrebllePluginPayload, TreblleConfig } from "./types";
import os from "node:os";

import {
  name as sdkName, //
  version as sdkVersion
} from "../package.json";

const NS_PER_SEC = 1e9
const NS_TO_MS = 1e6
const MASK = "***"

/**
 * The PayloadBuilder class for building Treblle payloads.
 */
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

  /**
   * Create a new PayloadBuilder instance.
   * @param {TreblleConfig} config - The Treblle configuration.
   */
  constructor(private config: TreblleConfig) {
    this.maskedFields = [
      ...this.maskedFields, //
      ...(config.additionalFieldsToMask || [])
    ];
  }

  /**
   * Prepare the payload data.
   * @template T
   * @param {T} data - The payload data.
   * @returns {T} - The prepared payload data.
   */
  public prepare(data: TrebllePluginPayload) {
    return this.maskedSensitiveFields(
      this.injectDefaultPayload(data)
    );
  }

  /**
   * Inject default payload data.
   * @template T
   * @param {T} data - The payload data.
   * @returns {T} - The payload data with default values injected.
   */
  private injectDefaultPayload(data: TrebllePluginPayload) {
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
          name: "Node",
          version: process.version,
          ...(data.language || {})
        },
        request: {
          timestamp: new Date().toISOString()
            .replace('T', ' ').substring(0, 19),
          ...data.request,
          url: this.parseURL(data.request?.url || 'http://localhost'),
        },
        response: {
          ...data.response,
          body: data.response?.body || {},
          load_time: this.getLoadTime(data.response?.load_time || process.hrtime())
        },
        errors: (data.errors || []),
      }
    };;
  }

  /**
   * Get load time in milliseconds.
   * @param {(number[] | number )} loadTime - The load time data.
   * @returns {number} - The load time in milliseconds.
   */
  private getLoadTime(loadTime?: [number, number] | number) {
    if (typeof loadTime === 'object') {
      const diff = process.hrtime(loadTime)
      return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
    }

    return loadTime
  }

  private parseURL(urlString: string) {
    const url = new URL(urlString);
    this.maskedFields.forEach((field) => {
      if (url.searchParams.get(field)) {
        url.searchParams.set(field, MASK)
      }
    })

    return url.toString();
  }


  /**
   * Mask sensitive fields in the object.
   * @param {Record<string, any>} obj - The object to mask sensitive fields in.
   * @returns {Record<string, any>} - The object with sensitive fields masked.
   */
  private maskedSensitiveFields(obj: Record<string, any>) {
    return PayloadBuilder.maskFields(obj, this.maskedFields);
  }

  /**
   * Mask fields in the data.
   * @template T
   * @param {T} data - The data to mask fields in.
   * @param {string[]} fieldsToMask - The fields to mask.
   * @returns {T} - The data with fields masked.
   */
  private static maskFields<T = any>(data: T, fieldsToMask: string[] = []): T {
    if (typeof data !== "object" || data === null) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((item) => PayloadBuilder.maskFields(item, fieldsToMask)) as T;
    }

    const maskedObject: T = {
      ...data,
    };

    for (const key in data) {
      if (fieldsToMask.includes(key)) {
        maskedObject[key] = MASK as T[typeof key];
      } else {
        maskedObject[key] = PayloadBuilder.maskFields(data[key], fieldsToMask);
      }
    }

    return maskedObject;
  }
}