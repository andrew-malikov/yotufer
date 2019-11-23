import { Command } from "commander";

import { google } from "googleapis";

import { Profile } from "./profile/models/profile";
import { YoutubeApiBuilder } from "./youtube-api/youtube-api-builder";
import { YoutubeSubscriptionApiService } from "./youtube-api/services/youtube-subscription-api.service";

import { FileProfileRepository } from "./profile/file-profile.repository";
import { FileAppCredentialsRepository } from "./app-credentials/file-app-credentials.repository";
import { ProvidableTokenFactory } from "./youtube-api/auth/providable-token";
import { API_SCOPES } from "./youtube-api/metadata/api-scopes.enum";

export async function run() {
  const args = new Command()
    .requiredOption("-p, --profile <profile>", "profile name to sync")
    .requiredOption("-l, --profiles <profiles>", "path to stored profiles")
    .requiredOption(
      "-c, --credentials <credentials>",
      "path to stored app credentials"
    )
    .option("-t, --token <token>", "path to stored youtube-api token")
    .parse(process.argv);

  const client = (
    await new YoutubeApiBuilder(
      new ProvidableTokenFactory().getConsoleProvidable(),
      await new FileAppCredentialsRepository(
        args["credentials"]
      ).getCredentials()
    ).authorize(API_SCOPES)
  ).build();

  const profile = await new FileProfileRepository(
    args["profiles"]
  ).getProfileByName(args["profile"]);

  if (!profile) {
    return console.log(`Can't find profile '${args["profile"]}'`);
  }

  new ProfileSync(
    new YoutubeSubscriptionApiService(client, google.youtube("v3"))
  ).sync(profile);
}

class ProfileSync {
  constructor(private subscriptionService: YoutubeSubscriptionApiService) {}

  public sync(profile: Profile) {
    let hasError = false;

    profile.subscriptions.forEach(async subscription => {
      if (hasError) {
        return;
      }

      const channelId = subscription.snippet.resourceId.channelId;
      const hasSubscription = await this.subscriptionService.hasSubscription(
        channelId
      );

      console.log(
        `Subscription to '${channelId}' is `,
        hasSubscription ? "active" : "dropped"
      );

      if (!hasSubscription) {
        this.subscriptionService
          .addSubscription(channelId)
          .then(response => {
            console.log(
              `Subscription to '${channelId}' is now active`,
              response
            );
          })
          .catch(error => {
            hasError = true;

            console.log(`Subscription to '${channelId}' was failed`, error);
          });
      }
    });
  }
}
