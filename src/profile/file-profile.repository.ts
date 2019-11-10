import { Profile } from "./models/profile";
import { readFile } from "fs";

export class FileProfileRepository {
  public getProfiles(path: string): Promise<Profile[]> {
    return new Promise((resolve, reject) => {
      readFile(path, (error, data) => {
        if (error || !data) {
          reject(error);
        }

        resolve(JSON.parse(data.toString()));
      });
    });
  }
}
