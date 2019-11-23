import { YoutubeSubscriptionApiService } from "../youtube-api/services/youtube-subscription-api.service";

import { Profile } from "./models/profile";

export class ProfileSyncService {
  constructor(private subscriptionService: YoutubeSubscriptionApiService) {}

  public syncSubscriptions(profile: Profile) {
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
