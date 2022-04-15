export interface IPublisher {
  /**
   * Publish keyword
   *
   * @param keyword
   * @constructor
   */
  Publish(keyword: { keyword: string; epoch: number }): void;
}
