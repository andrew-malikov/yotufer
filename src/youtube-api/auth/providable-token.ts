import { readFile } from "fs";
import { createInterface } from "readline";

import { Credentials, OAuth2Client } from "google-auth-library";

export type ProvidableToken = (
  client: OAuth2Client,
  scopes: ReadonlyArray<string>
) => Promise<Credentials>;

export class ProvidableTokenFactory {
  public getConsoleProvidable(): ProvidableToken {
    return (client: OAuth2Client, scopes: ReadonlyArray<string>) =>
      new Promise((resolve, reject) => {
        const authUrl = client.generateAuthUrl({
          access_type: "offline",
          scope: scopes as string[]
        });

        console.log("Authorize this app by visiting this url: ", authUrl);

        const readline = createInterface({
          input: process.stdin,
          output: process.stdout
        });

        readline.question("Enter the code from that page here: ", code => {
          readline.close();

          client.getToken(code, function(error, token) {
            if (error || !token) {
              return reject(error);
            }

            resolve(token);
          });
        });
      });
  }

  public getFileProvidable(pathToToken: string): ProvidableToken {
    return (client: OAuth2Client, scopes: ReadonlyArray<string>) =>
      new Promise((resolve, reject) => {
        readFile(pathToToken, (error, token) => {
          if (error || !token) {
            return reject(error);
          }

          resolve(JSON.parse(token.toString()));
        });
      });
  }
}
