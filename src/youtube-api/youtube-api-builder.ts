import { OAuth2Client } from "googleapis-common";

import { AppCredentials } from "../app-credentials/app-credentials";

import { ProvidableToken } from "./auth/providable-token";

export class YoutubeApiBuilder {
  private readonly client: OAuth2Client;

  constructor(private getToken: ProvidableToken, credentials: AppCredentials) {
    this.client = new OAuth2Client(
      credentials.installed.client_id,
      credentials.installed.client_secret,
      credentials.installed.redirect_uris[0]
    );
  }

  public authorize(scopes: ReadonlyArray<string>): Promise<YoutubeApiBuilder> {
    return new Promise((resolve, reject) => {
      this.getToken(this.client, scopes)
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
}
