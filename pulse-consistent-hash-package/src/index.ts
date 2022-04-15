const crypto = require("crypto");
import { IConsistentHash } from "./IConsistentHash.interface";

export class ConsistentHash implements IConsistentHash {
  nodes: (null | string)[];
  readonly ringSize: number = 160;

  constructor() {
    this.nodes = [];
  }

  AddNode(host: string): IConsistentHash {
    const indexes = this.NHash(host); // find n indexes in the ring for this host's node and it's virtuals

    for (let index = 0; index < indexes.length; index++) { // place the node in its positions in the ring.
      this.nodes[indexes[index]] = host;
    }

    return this;
  }

  Assign(word: string): string {
    if (this.nodes.length === 0)
      throw new Error("Add nodes first.");

    const index = this.Hash(word);

    const node = this.FindNearestNode(index);

    if (!node) {
      throw new Error('Cannot assign word to node');
    }

    return node;
  }

  Hash(word: string): number {
    const hash = crypto.createHash('md5').update(word).digest('hex');
    let number = 0;

    for(let i = 0; i < hash.length; i++) {
      number += parseInt(hash.charAt(i), 16);
    }

    return number % this.ringSize;
  }

  NHash(word: string): Array<number> {
    const algorithms = ['md4', 'md5', 'sha224', 'sha256', 'sha384'] // algorithms length == Math.log(this.totalSlots) == 5
    const indexes = []

    for (let index = 0; index < algorithms.length; index++) { // find position of host for each hash function
      const hash = crypto.createHash(algorithms[index]).update(word).digest('hex');
      let number = 0;

      for(let i = 0; i < hash.length; i++) {
        number += parseInt(hash.charAt(i), 16);
      }

      indexes[index] = number % this.ringSize;
    }

    return indexes;
  }

  RemoveNode(host: string): boolean {
    if (this.nodes.length === 0)
      throw new Error("Hash space is empty");

    const keys = this.NHash(host);

    for (let index = 0; index < keys.length; index++) { // remove host and it's virtuals from ring
      if (this.nodes[keys[index]] === host) {
        this.nodes[keys[index]] = null;
      }
    }

    return true;
  }

  /**
   * Find the host to the right of index
   * @param index
   * @returns string | null
   * @private
   */
  private FindNearestNode(index: number): string | null {
    for (let i = index; i <= this.ringSize; i++) {
      if (this.nodes[i])
        return this.nodes[i];

      if (i === this.ringSize)
        i = i % this.ringSize

    }

    return '';
  }
}
