import * as chalk from "chalk";

export const error = (msg: string) => console.log(chalk.white.bgRed.bold(msg));
export const success = (msg: string) => console.log(chalk.green.bold(msg));
export const info = (msg: string) => console.log(chalk.blue.bold(msg));
export const warn = (msg: string) => console.log(chalk.yellow.bold(msg));
export const cleanLine = (nbrLine: number) => {
  process.stdout.moveCursor(0, -nbrLine); // up one line
  process.stdout.clearLine(0); // from cursor to end
};
