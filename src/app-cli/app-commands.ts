import { Command } from "commander";

import { Container } from "inversify";

import { CommandGraphBuilder } from "./command-graph-builder";
import { CommandActionFactory } from "./command-action-factory";

import {
  SyncSubscriptionsAction,
  GetSyncSubscriptionsDependencies
} from "./actions/sync-subscriptions.action";

export const GetAppCommands = () =>
  new CommandGraphBuilder(new Command())
    .populate(root => {
      root
        .command("sync subscriptions")
        .requiredOption("-p, --profile <profile>", "profile name to sync")
        .requiredOption("-l, --profiles <profiles>", "path to stored profiles")
        .requiredOption(
          "-c, --credentials <credentials>",
          "path to stored app credentials"
        )
        .option("-t, --token <token>", "path to stored youtube-api token")
        .action(async options => {
          const factory = new CommandActionFactory(new Container());

          const subscribeAction = factory.getAction(
            SyncSubscriptionsAction,
            GetSyncSubscriptionsDependencies
          );

          await subscribeAction({
            profileName: options.profile,
            pathToProfiles: options.profiles,
            pathToCredentials: options.credentials,
            pathToToken: options.token
          });
        });
    })
    .build();
