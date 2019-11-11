import { Command } from "commander";

import { google } from "googleapis";

import { Profile } from "./profile/models/profile";
import {
  YoutubeSubscriptionApiService,
  YoutubeApiBuilder
} from "./youtube-api/youtube-api.service";

import { FileProfileRepository } from "./profile/file-profile.repository";
import { FileClientCredentialsRepository } from "./credentials/file-client-credentials.repository";

export async function run() {
  const args = new Command()
    .requiredOption("-p, --profile <profile>", "profile name to sync")
    .requiredOption("-l, --profiles <profiles>", "path to stored profiles")
    .requiredOption(
      "-c, --credentials <credentials>",
      "path to stored credentials"
    )
    .parse(process.argv);

  const client = (await new YoutubeApiBuilder(
    await new FileClientCredentialsRepository(
      args["credentials"]
    ).getCredentials()
  ).authorize()).build();

  const profile = await new FileProfileRepository(
    args["profiles"]
  ).getProfileByName(args["profile"]);

  if (!profile) {
    return console.log(`can't find profile '${args["profile"]}'`);
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

      const channelIdToSubscribe = subscription.snippet.resourceId.channelId;
      const hasSubscription = await this.subscriptionService.hasSubscription(
        profile.channelId,
        channelIdToSubscribe
      );

      console.log(
        `subscription to '${channelIdToSubscribe}' is `,
        hasSubscription ? "active" : "dropped"
      );

      if (!hasSubscription) {
        this.subscriptionService
          .addSubscription(profile.channelId, channelIdToSubscribe)
          .then(response => {
            console.log(
              `subscription to '${channelIdToSubscribe}' is now active`,
              response
            );
          })
          .catch(error => {
            hasError = true;

            console.log(
              `subscription to '${channelIdToSubscribe}' was failed`,
              error
            );
          });
      }
    });
  }
}
