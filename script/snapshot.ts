import { info, success } from "./helpers/log";
import type { PublicKey } from "@solana/web3.js";
import { doSnapshot } from "./utils/do-snapshot";
import { mergeWith, isArray } from "lodash";
import "dotenv/config";

const fs = require("fs");
const path = require("path");
const moment = require("moment");
const snapshotDate = moment();
const folderResult = path.resolve(
  process.cwd(),
  `${process.env.DIR_RESULT}${process.env.DIR_SNAPSHOT}`
);
if (!fs.existsSync(folderResult)) {
  fs.mkdirSync(folderResult, { recursive: true });
}
const folderSnapshotData = path.resolve(
  process.cwd(),
  `${process.env.DIR_RESULT}${process.env.DIR_SNAPSHOT}${process.env.DIR_SNAPSHOT_RAW_DATA}`
);
if (!fs.existsSync(folderSnapshotData)) {
  fs.mkdirSync(folderSnapshotData, { recursive: true });
}

async function run() {
  const str = fs.readFileSync(path.resolve("mints.json")).toString();
  const mintJson = JSON.parse(str);

  const resultPath = `${folderResult}/result.json`;
  let result: any;
  if (!fs.existsSync(resultPath)) {
    result = {
      collections: Array(),
    };
  } else {
    const resultFile = fs
      .readFileSync(path.resolve(`${resultPath}`))
      .toString();
    result = JSON.parse(resultFile);
  }

  const dataToMerge = [];
  for (const mint of mintJson.mints) {
    const collection = {
      name: mint.name,
      snapshot: Array(),
    };
    collection.snapshot.push(await snapshot(mint.name, mint.mint.addresses));
    dataToMerge.push(collection);
  }

  info(`All snapshot path: ${folderResult}`);

  mergeWith(result.collections, dataToMerge, customizer);
  fs.writeFileSync(resultPath, JSON.stringify(result, null, 2));
  info(`Result snapshot path: ${resultPath}`);
  process.exit(0);
}

const customizer = (objValue: any, srcValue: any) => {
  if (isArray(objValue)) {
    return objValue.concat(srcValue);
  }
};

const snapshot = async (name: string, addresses: Array<PublicKey>) => {
  const cliProgress = require("cli-progress");
  const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  const timeout = 100;

  info(`Taking snapshot of [${name}]`);
  let progress = 0;
  bar.start(addresses.length, progress);

  function onProgress(num = 1) {
    bar.update((progress += num));
  }

  const snapshot = await doSnapshot(addresses, timeout, onProgress);

  bar.stop();

  const moment = require("moment");
  const timestamp = moment().format("x");
  const output = `${folderSnapshotData}/${timestamp}.json`;

  const finalResult = {
    name: name,
    date: moment().format("YYYY/MM/DD HH:mm:ss"),
    timestamp: timestamp,
    snapshot: snapshot,
  };

  fs.writeFileSync(output, JSON.stringify(finalResult, null, 2));

  success(`Snapshot of [${name}] taken successfully`);
  return {
    date: snapshotDate.format("YYYY/MM/DD HH:mm:ss"),
    timestamp: snapshotDate.format("x"),
    holder: Object.keys(snapshot).length,
    file: output,
  };
};

run();
