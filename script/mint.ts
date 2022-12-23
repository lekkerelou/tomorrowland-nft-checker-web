import { info, success } from "./helpers/log";
import { PublicKey } from "@solana/web3.js";
import { getMints } from "./utils/get-mint";

async function run() {
  const fs = require("fs");
  const path = require("path");
  const str = fs.readFileSync(path.resolve("mints.json")).toString();
  const mintJson = JSON.parse(str);
  const newJson = {
    mints: Array(),
  };

  for(const mint of mintJson.mints) {
    info(`Fetching [${mint.name}] mints `);
    let mints = await getMints(mint.creator);
    mints = mints.filter(
      // eslint-disable-next-line no-control-regex
      (b: any) => b.data.symbol.replace(/\x00/g, "") === mint.symbol
    );
    const moment = require("moment");
    const finalResult = {
      name: mint.name,
      creator: mint.creator,
      symbol: mint.symbol,
      mint: {
        addresses: mints.map((item: any) => new PublicKey(item.mint).toJSON()),
        size: mints.length,
        date: moment().format("YYYY/MM/DD HH:mm:ss"),
      },
    };
    newJson.mints.push(finalResult);
    success(`Fetching [${mint.name}] mints taken successfully`);
  }

  fs.writeFileSync(
    path.resolve(`mints.json`),
    JSON.stringify(newJson, null, 2)
  );
  process.exit(0);
}

run();
