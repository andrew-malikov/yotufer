import { readFile } from "fs";

import { AppCredentials } from "./app-credentials";

export class FileAppCredentialsRepository {
  constructor(private sourcePath: string) {}

  public getCredentials(): Promise<AppCredentials> {
    return new Promise((resolve, reject) =>
      readFile(this.sourcePath, (error, data) => {
        if (error || !data) {
          return reject(error);
        }

        resolve(JSON.parse(data.toString()));
      })
    );
  }
}
