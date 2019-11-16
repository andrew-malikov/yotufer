import { GaxiosResponse } from "gaxios";

import { OAuth2Client } from "googleapis-common";

import { Youtube, Schema$Playlist } from "../types/youtube.aliases";

import { YOUTUBE_PLAYLIST_PRIVACY_STATUS } from "../metadata/youtube-playlist-privacy-status.enum";

export class YoutubePlaylistApiService {
  constructor(private client: OAuth2Client, private youtube: Youtube) {}

  public getPlaylists(): Promise<GaxiosResponse<Schema$Playlist>[]> {
    return new Promise(async (resolve, reject) => {
      this.youtube.playlists
        .list({
          auth: this.client,
          mine: true
        })
        .then(async firstPage => {
          if (firstPage.data.nextPageToken) {
            return resolve([
              firstPage,
              ...(await this.getNextPlaylistPages(firstPage.data.nextPageToken))
            ]);
          }

          return resolve([firstPage]);
        })
        .catch(error => reject(error));
    });
  }

  private getNextPlaylistPages(
    pageToken: string
  ): Promise<GaxiosResponse<Schema$Playlist>[]> {
    return new Promise(async (resolve, reject) => {
      const pages = [
        await this.youtube.playlists.list({
          auth: this.client,
          mine: true,
          pageToken: pageToken
        })
      ];
      const nextPageToken = pages[0]?.data?.nextPageToken;

      if (nextPageToken) {
        pages.push(...(await this.getNextPlaylistPages(nextPageToken)));
      }

      resolve(pages);
    });
  }

  public addPlaylist(
    title: string,
    description: string,
    privacy: YOUTUBE_PLAYLIST_PRIVACY_STATUS
  ): Promise<GaxiosResponse<Schema$Playlist>> {
    return this.youtube.playlists.insert({
      auth: this.client,
      part: "snippet,status",
      requestBody: {
        snippet: {
          title: title,
          description: description,
          defaultLanguage: "en"
        },
        status: {
          privacyStatus: privacy
        }
      }
    });
  }
}
