import { IPluginData, TreblleConfig } from "../types";
import { httpClient } from "../utils";
import Parser from "./Parser";
import LoadBalancer from "./loadBalancer";
import Queue from "./queue";

/**
 * Handler class for managing data processing and dispatching to Treblle servers.
 */
export default class Handler {
  /**
   * The queue for managing and executing tasks.
   */
  private queue: Queue;

  /**
   * The parser used to prepare data for transmission.
   */
  private parser: Parser;

  /**
   * The router for load balancing requests to Treblle servers.
   */
  private router: LoadBalancer;

  /**
   * Constructor for creating a new Handler instance.
   *
   * @param {TreblleConfig} config - The Treblle configuration object.
   * @throws {Error} Throws an error if the API key or project ID is missing in the configuration.
   */
  constructor(private config: TreblleConfig) {
    this.validateConfig();
    this.queue = new Queue();
    this.parser = new Parser(config);
    this.router = new LoadBalancer([
      "https://rocknrolla.treblle.com",
      "https://punisher.treblle.com",
      "https://sicario.treblle.com",
    ]);
  }

  /**
   * Validates the configuration by checking if the API key and project ID are present.
   *
   * @throws {Error} Throws an error if the API key or project ID is missing in the configuration.
   */
  private validateConfig() {
    if (!this.config.apiKey) {
      throw new Error(`treblle API key is not present`);
    }

    if (!this.config.projectId) {
      throw new Error(`treblle project ID is not present`);
    }
  }

  /**
   * Creates a task for processing and dispatching data to Treblle servers.
   *
   * @param {T} data - Data to be processed and sent to Treblle.
   * @returns {Function} A task function that can be added to the queue for execution.
   */
  private createTask<T extends IPluginData>(data: T) {
    const preparedData = this.parser.prepare(data);
    return async () => {
      try {
        await httpClient({
          method: "POST",
          data: preparedData,
          url: this.router.getNextEndpoint(),
          headers: {
            "Content-Type": "application/json",
            "x-api-key": this.config.apiKey,
          },
        });
      } catch (error) {
        throw error;
      }
    };
  }

  /**
   * Starts processing and dispatching data to Treblle servers by creating and adding a task to the queue.
   *
   * @param {T} data - Data to be processed and sent to Treblle.
   */
  public start<T extends IPluginData>(data: T) {
    const task = this.createTask(data);
    this.queue.add(task);
  }
}
