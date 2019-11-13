import { Command } from "commander";

import { google } from "googleapis";

import { Profile } from "./profile/models/profile";
import {
  YoutubeSubscriptionApiService,
  YoutubeApiBuilder
} from "./youtube-api/youtube-api.service";

import { FileProfileRepository } from "./profile/file-profile.repository";
import { FileClientCredentialsRepository } from "./credentials/file-client-credentials.repository";
import {
  ResolvableError,
  getChainedResolvableError,
  resolvableErrors
} from "./youtube-api/resolvable-error";

export async function run() {
  const args = new Command()
    .requiredOption("-p, --profile <profile>", "profile name to sync")
    .requiredOption("-l, --profiles <profiles>", "path to stored profiles")
    .requiredOption(
      "-c, --credentials <credentials>",
      "path to stored credentials"
    )
    .parse(process.argv);

  const client = (
    await new YoutubeApiBuilder(
      await new FileClientCredentialsRepository(
        args["credentials"]
      ).getCredentials()
    ).authorize()
  ).build();

  const profile = await new FileProfileRepository(
    args["profiles"]
  ).getProfileByName(args["profile"]);

  if (!profile) {
    return console.log(`can't find profile '${args["profile"]}'`);
  }

  new ProfileSync(
    new YoutubeSubscriptionApiService(client, google.youtube("v3")),
    getChainedResolvableError([resolvableErrors.byStatusCode])
  ).sync(profile);
}

class ProfileSync {
  constructor(
    private subscriptionService: YoutubeSubscriptionApiService,
    private resolvableError: ResolvableError
  ) {}

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
        `subscription to '${channelId}' is `,
        hasSubscription ? "active" : "dropped"
      );

      if (!hasSubscription) {
        this.subscriptionService
          .addSubscription(channelId)
          .then(response => {
            if (this.resolvableError(response)) {
              return (hasError = true);
            }

            console.log(
              `subscription to '${channelId}' is now active`,
              response
            );
          })
          .catch(error => {
            hasError = true;

            console.log(`subscription to '${channelId}' was failed`, error);
          });
      }
    });
  }
}
