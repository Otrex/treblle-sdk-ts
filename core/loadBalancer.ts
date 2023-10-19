/**
 * LoadBalancer class for managing and cycling through a list of endpoints in a round-robin fashion.
 */
export default class LoadBalancer {
  /**
   * An array of endpoints to be balanced.
   */
  private endpoints: string[];

  /**
   * The current index of the endpoint in use.
   */
  private currentIndex: number;

  /**
   * Constructor for creating a new LoadBalancer instance.
   *
   * @param {string[]} endpoints - An array of endpoint URLs to balance requests between.
   */
  constructor(endpoints: string[]) {
    this.endpoints = endpoints;
    this.currentIndex = 0;
  }

  /**
   * Get the next endpoint in the round-robin order.
   *
   * @returns {string} The next endpoint URL in the rotation.
   */
  public getNextEndpoint(): string {
    const nextEndpoint = this.endpoints[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.endpoints.length;
    return nextEndpoint;
  }
}
