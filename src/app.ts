import { GetAppCommands } from "./app-cli/app-commands";

export function run(args: string[]) {
  GetAppCommands().parse(args);
}
