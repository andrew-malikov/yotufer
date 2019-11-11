import { readFile } from "fs";

import { ClientCredentials } from "./client-credentials";

export class FileClientCredentialsRepository {
  constructor(private sourcePath: string) {}

  public getCredentials(): Promise<ClientCredentials> {
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
