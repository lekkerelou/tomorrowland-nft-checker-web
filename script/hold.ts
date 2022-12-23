import { error, info, success, warn } from "./helpers/log";
import "dotenv/config";
import { size } from "lodash";

const path = require("path");
const fs = require("fs");
const rolesDirectory = path.resolve(
  process.cwd(),
  `${process.env.DIR_RESULT}${process.env.DIR_HOLDER}`
);
const snapshotDirectory = path.resolve(
  process.cwd(),
  `${process.env.DIR_RESULT}${process.env.DIR_SNAPSHOT}`
);

if (!fs.existsSync(rolesDirectory)) {
  fs.mkdirSync(rolesDirectory, { recursive: true });
}

const rolesConfigPath = fs
  .readFileSync(path.resolve("holders_config.json"))
  .toString();
const snapshotPath = fs
  .readFileSync(`${snapshotDirectory}\\result.json`)
  .toString();

const rolesConfigJson = JSON.parse(rolesConfigPath);
const snapshotJson = JSON.parse(snapshotPath);

async function run() {
  const cliProgress = require("cli-progress");
  const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

  const snapshotFiles: any[] = [];
  for (const role of rolesConfigJson.holders) {
    // GET SNAPSHOT FILE LIST
    if (role.snapshot_timestamp === "latest") {
      for (const holding of role.holdings) {
        snapshotJson.collections
          .filter((collection: any) => collection.name === holding.name)
          .map((value: any) => {
            const result = value.snapshot.at(-1);
            result.name = value.name;
            snapshotFiles.push(result);
          });
      }
    } else {
      for (const holding of role.holdings) {
        snapshotJson.collections
          .filter((collection: any) => collection.name === holding.name)
          .map((collection: any) =>
            collection.snapshot
              .filter(
                (snapshot: any) =>
                  snapshot.timestamp === role.snapshot_timestamp
              )
              .map((value: any) => {
                value.name = collection.name;
                snapshotFiles.push(value);
              })
          );
      }
    }

    if (snapshotFiles.length === 0) {
      error(
        `No snapshot file found for role [${role.name}] at this timestamp [${role.snapshot_timestamp}]`
      );
      process.exit(1);
    }

    // CHECK SNAPSHOT FILE EXIST
    let result = new Map();
    for (const snapshotFile of snapshotFiles) {
      await checkSnapshotFileExist(snapshotFile.file, snapshotFile.name);

      const str = fs.readFileSync(snapshotFile.file).toString();
      const snapshot = JSON.parse(str);
      info(`Cleaning [${snapshot.name}] snapshot`);
      let progress = 0;
      bar.start(size(Object.keys(snapshot.snapshot)), progress);
      // START CHECK ALL ADDRESS
      Object.entries(snapshot.snapshot).forEach(
        ([address, nft]: [string, any]) => {
          if (result.has(address)) {
            const collection = addEntry(
              result.get(address),
              snapshotFile.name,
              nft.amount
            );
            result.set(address, collection);
          } else {
            const collection = addEntry({}, snapshotFile.name, nft.amount);
            result.set(address, collection);
          }
          bar.update((progress += 1));
        }
      );
      bar.stop();
      success(`Cleaning [${snapshot.name}] snapshot taken successfully`);
    }
    success(`Cleaning all snapshot taken successfully`);

    const resultFile = `${snapshotDirectory}\\snapshot_aggregate_${role.snapshot_timestamp}.json`;
    fs.writeFileSync(
      resultFile,
      JSON.stringify(Object.fromEntries(result), null, 2)
    );
    info(`Full snapshot file: ${resultFile}`);

    const moment = require("moment");
    const timestamp = moment().format("x");
    const holder_list_rank = `${rolesDirectory}\\holders.json`;

    const stats: any[] = [];

    role.stats.forEach((statistique: any) => {
      const statsArray = Array.from(result.values());
      const res = statsArray.filter(value =>
        eval(statistique.condition)
      ).length;
      success(`[${statistique.title}] : ${res}`);
      statistique = {
        title: statistique.title,
        name: statistique.name,
        value: res,
      };
      stats.push(statistique);
    });

    warn(`Generate [${role.name}] holder list`);
    warn(`With condition :`);

    Object.values(role.holdings).forEach((holding: any) => {
      warn(`- Collection: ${holding.name}, Holding amount: ${holding.holding}`);
      let progress = 0;
      let lost = 0;
      bar.start(result.size, progress);
      result = new Map(
        Array.from(result).filter(([key, value]) => {
          bar.update((progress += 1));
          if (value[holding.name] >= 1) {
            return true;
          }
          lost++;
          return false;
        })
      );
      bar.stop();
      error(`${lost} Holder does not match the requirement`);
    });

    Array.from(result).map((value: any) => {
      value[1][role.name] = Math.min.apply(
        null,
        Object.entries(value[1]).map((value1: any) => value1[1])
      );
    });

    success(`Generate [${role.name}] unique holder list taken successfully`);
    success(`[${role.name}] unique holder list size : ${result.size}`);
    const realMedalion = Array.from(result).reduce(function (n, val) {
      return n + val[1][role.name];
    }, 0);
    success(`[${role.name}] available : ${realMedalion}`);

    let collections: any;
    if (!fs.existsSync(holder_list_rank)) {
      collections = {
        collections: Array(),
      };
    } else {
      const resultFile = fs
        .readFileSync(path.resolve(`${holder_list_rank}`))
        .toString();
      collections = JSON.parse(resultFile);
    }

    const time = moment();
    const collection = {
      name: role.name,
      date: time.format("YYYY/MM/DD HH:mm:ss"),
      timestamp: time.format("X"),
      unique_holder: result.size,
      total: realMedalion,
      holders: Object.fromEntries(result),
      stats: stats
    };

    collections.collections.push(collection);

    fs.writeFileSync(holder_list_rank, JSON.stringify(collections, null, 2));
    info(`Holder [${role.name}] list path: ${holder_list_rank}`);
  }
  process.exit(0);
}

async function checkSnapshotFileExist(
  filePath: string,
  collectionName: string
) {
  if (!fs.existsSync(filePath)) {
    error(`File [${filePath}] for [${collectionName}] not found!`);
    process.exit(-1);
  }
}

const addEntry = (myObject: any, key: any, value: any) => ({
  ...myObject,
  [key]: value,
});

run();
