import { Command } from "commander";

export function run() {
  const args = new Command()
    .requiredOption("-p, --profile <profile>", "profile name to sync")
    .requiredOption("-ps, --profiles <profiles>", "path to stored profiles")
    .parse(process.argv);
}
