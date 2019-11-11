import { createInterface } from "readline";

import { youtube_v3 } from "googleapis";
import { OAuth2Client } from "googleapis-common";
import { Credentials } from "google-auth-library";

import { ClientCredentials } from "../credentials/client-credentials";

export type Youtube = youtube_v3.Youtube;

const SCOPES = ["https://www.googleapis.com/auth/youtube"];

export class YoutubeApiBuilder {
  private readonly client: OAuth2Client;

  constructor(credentials: ClientCredentials) {
    this.client = new OAuth2Client(
      credentials.installed.client_id,
      credentials.installed.client_secret,
      credentials.installed.redirect_uris[0]
    );
  }

  public authorize(): Promise<YoutubeApiBuilder> {
    return new Promise((resolve, reject) => {
      this.getToken()
        .then(token => {
          this.client.credentials = token;

          resolve(this);
        })
        .catch(error => reject(error));
    });
  }

  public build(): OAuth2Client {
    return this.client;
  }

  private getToken(): Promise<Credentials> {
    return new Promise((resolve, reject) => {
      const authUrl = this.client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES
      });

      console.log("Authorize this app by visiting this url: ", authUrl);

      const readline = createInterface({
        input: process.stdin,
        output: process.stdout
      });

      readline.question("Enter the code from that page here: ", code => {
        readline.close();

        this.client.getToken(code, function(error, token) {
          if (error || !token) {
            return reject(error);
          }

          resolve(token);
        });
      });
    });
  }
}

export enum YOUTUBE_RESOURCE_KIND {
  CHANNEL = "youtube#channel"
}

export class YoutubeSubscriptionApiService {
  constructor(private client: OAuth2Client, private youtube: Youtube) {}

  // TODO: remove sourceChannelId
  // TODO: reject error if limit was get out
  public addSubscription(
    sourceChannelId: string,
    addChannelId: string
  ): Promise<any> {
    return this.youtube.subscriptions.insert({
      auth: this.client,
      part: "snippet",
      requestBody: {
        snippet: {
          resourceId: {
            kind: YOUTUBE_RESOURCE_KIND.CHANNEL,
            channelId: addChannelId
          }
        }
      }
    });
  }

  // TODO: remove sourceChannelId
  public hasSubscription(
    sourceChannelId: string,
    channelIdForCheck: string
  ): Promise<any> {
    return new Promise((resolve, reject) =>
      this.youtube.subscriptions
        .list({
          auth: this.client,
          part: "snippet,contentDetails",
          mine: true,
          forChannelId: channelIdForCheck
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
