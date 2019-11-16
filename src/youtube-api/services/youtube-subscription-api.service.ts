import { GaxiosResponse } from "gaxios";

import { OAuth2Client } from "googleapis-common";

import { Youtube, Schema$Subscription } from "../types/youtube.aliases";

import { YOUTUBE_RESOURCE_KIND } from "../metadata/youtube-resource-kind.enum";

export class YoutubeSubscriptionApiService {
  constructor(private client: OAuth2Client, private youtube: Youtube) {}

  public addSubscription(
    channelId: string
  ): Promise<GaxiosResponse<Schema$Subscription>> {
    return this.youtube.subscriptions.insert({
      auth: this.client,
      part: "snippet",
      requestBody: {
        snippet: {
          resourceId: {
            kind: YOUTUBE_RESOURCE_KIND.CHANNEL,
            channelId: channelId
          }
        }
      }
    });
  }

  public hasSubscription(channelId: string): Promise<boolean> {
    return new Promise((resolve, reject) =>
      this.youtube.subscriptions
        .list({
          auth: this.client,
          mine: true,
          forChannelId: channelId
        })
        .then(response => {
          if (response.data.items) {
            return resolve(response.data.items.length > 0);
          }
          resolve(false);
        })
        .catch(error => reject(error))
    );
  }
}
