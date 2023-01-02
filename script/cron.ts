import * as cron from "node-cron";
const { exec } = require("child_process");
console.log(`CRON STARTED`);
const task1 = cron.schedule("0 0 0 * * *", () => {
  exec(`npm run full`, (error: any, stdout: any, stderr: any) => {
    if (error) {
      console.error(`FAILED WITH ERROR : ${error}`);
      return;
    }
    console.log(`CRON [${new Date()}] SUCCESS`);
  });
});

task1.start();
