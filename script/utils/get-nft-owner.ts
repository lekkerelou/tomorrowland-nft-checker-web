import type { PublicKey } from "@solana/web3.js";
import axios from "axios";
import "dotenv/config";

export const getNftOwner: any = async (addresses: Array<PublicKey>, failed: number = 0) => {
  try {
    const headers = {
      "Content-Type": "application/json",
    };
    const data = addresses.map((address) => {
      return {
        jsonrpc: "2.0",
        id: 3,
        method: "getTokenLargestAccounts",
        params: [
          address,
          {
            commitment: "finalized",
          },
        ],
      };
    });

    const res = await axios.post(process.env.RPC_HOST!, data, { headers });
    const accounts = res.data
      .map((item: any, i: number) => {
        if (!item.result) {
          return null;
        }
        if (item.result.value[0] && item.result.value[0].uiAmount === 1) {
          return {
            account: item.result.value[0].address,
            address: addresses[i],
          };
        } else {
          return null;
        }
      })
      .filter(Boolean);

    const mutlipleAccData = {
      jsonrpc: "2.0",
      id: 3,
      method: "getMultipleAccounts",
      params: [
        accounts.map((a: any) => a.account),
        {
          commitment: "finalized",
          encoding: "jsonParsed",
        },
      ],
    };

    const info = await axios.post(process.env.RPC_HOST!, mutlipleAccData, {
      headers,
    });
    const infos = info.data.result.value;

    return infos.map((item: any, i: number) => {
      return {
        mint: accounts[i].address,
        owner: item.data.parsed.info.owner,
      };
    });
  } catch (err: any) {
    failed = failed === 0 ? 1 : failed;
    //console.error(`${err.response?.statusText}: Sleep ${1000 * failed}MS before retry...`);
    await delay(1000 * failed);
    return getNftOwner(addresses, ++failed);
  }
};

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
