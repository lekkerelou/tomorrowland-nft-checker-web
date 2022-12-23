import { Connection, PublicKey } from "@solana/web3.js";
import { deserializeUnchecked } from "borsh";
import Creator from "../class/Creator";
import Data from "../class/Data";
import Metadata from "../class/Metadata";
import "dotenv/config";

const METADATA_SCHEMA = new Map<any, any>([
  [
    Data,
    {
      kind: "struct",
      fields: [
        ["name", "string"],
        ["symbol", "string"],
        ["uri", "string"],
        ["sellerFeeBasisPoints", "u16"],
        ["creators", { kind: "option", type: [Creator] }],
      ],
    },
  ],
  [
    Creator,
    {
      kind: "struct",
      fields: [
        ["address", [32]],
        ["verified", "u8"],
        ["share", "u8"],
      ],
    },
  ],
  [
    Metadata,
    {
      kind: "struct",
      fields: [
        ["key", "u8"],
        ["updateAuthority", [32]],
        ["mint", [32]],
        ["data", Data],
        ["primarySaleHappened", "u8"],
        ["isMutable", "u8"],
      ],
    },
  ],
]);
const connection = new Connection(process.env.RPC_HOST!);

export const getMints: any = async (creatorId: string, failed: number = 0) => {
  try {
    const a = await connection.getProgramAccounts(
      new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"),
      {
        encoding: "base64",
        filters: [
          {
            memcmp: {
              offset: 326,
              bytes: new PublicKey(creatorId).toBase58(),
            },
          },
        ],
      }
    );
    return a.map((b) =>
      deserializeUnchecked(METADATA_SCHEMA, Metadata, b.account.data)
    );
  } catch (e: any) {
    failed = failed === 0 ? 1 : failed;
    //console.error(`${e.code}: Sleep ${1000 * failed}MS before retry...`);
    await delay(1000 * failed);
    return getMints(creatorId, ++failed);
  }
};

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
