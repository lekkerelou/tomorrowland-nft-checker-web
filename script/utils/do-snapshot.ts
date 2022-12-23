import type { PublicKey } from "@solana/web3.js";
import { getNftOwners } from "./get-nft-owners";

export const doSnapshot = async (addresses: Array<PublicKey>, timeout: number = 100, onProgress: (num?: number) => void) => {
  const owners = await getNftOwners(addresses, timeout, onProgress);

  return owners.reduce((snapshot, item) => {
    const obj = snapshot[item.owner];
    if (!obj) {
      return {
        ...snapshot,
        [item.owner]: {
          amount: 1,
          mints: [item.mint],
        },
      };
    }

    obj.mints.push(item.mint);
    obj.amount++;

    return {
      ...snapshot,
      [item.owner]: obj,
    };
  }, {});
};
