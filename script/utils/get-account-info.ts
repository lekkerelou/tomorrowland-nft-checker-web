import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import "dotenv/config";
import { Buffer } from "buffer";

const connection = new Connection(process.env.RPC_HOST!);

export const getAccountInfo: any = async (
  AccountAddress: string,
  failed: number = 0
) => {
  try {
    const a = await connection.getAccountInfo(
      new PublicKey(AccountAddress),
      {
        commitment: "finalized",
      }
    );
    //const buf = new Buffer(a?.data.toString());
    //console.log(a.lamports,buf.toJSON());
    if(a?.lamports === undefined){
      return 0;
    }else{
      return a.lamports / LAMPORTS_PER_SOL;
    }
  } catch (e: any) {
    failed = failed === 0 ? 1 : failed;
    console.error(`${e.code}: Sleep ${1000 * failed}MS before retry...`);
    await delay(1000 * failed);
    return getAccountInfo(AccountAddress, ++failed);
  }
};

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
