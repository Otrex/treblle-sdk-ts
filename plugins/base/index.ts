import TreblleCore, { TreblleConfig } from "../../core";

export default class TrebllePlugin {
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
  static getInstance(config: TreblleConfig) {
    if (!(this.treblleCore instanceof TreblleCore)) {
      this.treblleCore = new TreblleCore({
        ...config,
      });
    }

    return this.treblleCore;
  }
}