import { injectable, inject } from "inversify";
import { Types } from "../../types";

import { GaxiosResponse } from "gaxios";

import { OAuth2Client } from "googleapis-common";

import { Youtube, Schema$Subscription } from "../types/youtube.aliases";

import { YOUTUBE_RESOURCE_KIND } from "../metadata/youtube-resource-kind.enum";

@injectable()
export class YoutubeSubscriptionApiService {
  constructor(
    @inject(Types.OAuth2Client)
    private client: OAuth2Client,
    @inject(Types.Youtube)
    private youtube: Youtube
  ) {}

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
