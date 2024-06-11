import type { PublicKey } from "@solana/web3.js";
import { getNftOwner } from "./get-nft-owner";

export const getNftOwners = async (addresses: Array<PublicKey>, timeout: number = 100, onProgress: (num?: number) => void) => {

  const Bottleneck = require("bottleneck/es5");
  const { chunk, flatten } = require("lodash");

  const limiter = new Bottleneck({
    minTime: timeout,
    maxConcurrent: 1,
  });

  const chunks = chunk(addresses, 100);

  async function getOwner(ads: Array<PublicKey>) {
    const owners = await getNftOwner(ads);
    onProgress && onProgress(owners.length);
    return owners;
  }

  const limited = limiter.wrap(getOwner);

  const allTasks = chunks.map(limited);
  return Promise.all(allTasks).then(flatten);
};
