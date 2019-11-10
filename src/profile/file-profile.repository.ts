import { Profile } from "./models/profile";
import { readFile } from "fs";

export class FileProfileRepository {
  constructor(private sourcePath: string) {}

  public getProfiles(): Promise<Profile[]> {
    return new Promise((resolve, reject) => {
      readFile(this.sourcePath, (error, data) => {
        if (error || !data) {
          reject(error);
        }

        resolve(JSON.parse(data.toString()));
      });
    });
  }

  public getProfileByName(name: string): Promise<Profile | null> {
    return new Promise((resolve, reject) =>
      this.getProfiles()
        .then(profiles => {
          const foundProfile = profiles.find(profile => profile.name === name);

          if (foundProfile) {
            return resolve(foundProfile);
          }

          resolve(null);
        })
        .catch(error => reject(error))
    );
  }
}
