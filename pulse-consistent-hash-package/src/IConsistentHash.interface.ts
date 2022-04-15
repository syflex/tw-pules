export interface IConsistentHash {
  /**
   * Size of the ring
   */
  readonly ringSize: number;
  /**
   * Represents the nodes in the ring
   */
  nodes: Array<string | null>;

  /**
   * Find the n hash keys of the word and it's virtuals in the ring
   * @param word
   * @returns number
   */
  NHash(word: string): Array<number>;

  /**
   * Find hash of the word
   * @param word
   * @param totalSlots
   * @returns number
   */
  Hash(word: string, totalSlots: number): number;

  /**
   * Adds a new host
   * @param host
   * @returns this
   */
  AddNode(host: string): IConsistentHash;

  /**
   * Remove a host
   * @param host
   * @returns boolean
   */
  RemoveNode(host: string): boolean;

  /**
   * Assign a word to a host
   * @param word
   * @returns string
   */
  Assign(word: string): string | null;
}
