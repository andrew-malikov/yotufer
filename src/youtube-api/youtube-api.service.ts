import { createInterface } from "readline";

import { youtube_v3 } from "googleapis";
import { OAuth2Client } from "googleapis-common";

import { ClientCredentials } from "../../config/credentials";
import { Credentials } from "google-auth-library";

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
          this.client.credentials = JSON.parse(token.toString());

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
  SUBSCRIPTION = "youtube#subscription"
}

export class YoutubeSubscriptionApiService {
  constructor(private client: OAuth2Client, private youtube: Youtube) {}

  public addSubscription(channelId: string): Promise<any> {
    return this.youtube.subscriptions.insert({
      auth: this.client,
      requestBody: {
        kind: YOUTUBE_RESOURCE_KIND.SUBSCRIPTION,
        snippet: {
          channelId: channelId
        }
      }
    });
  }
}
