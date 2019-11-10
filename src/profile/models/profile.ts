import { InsertPlaylist } from "./insert-playlist-snippet";
import { InsertVideoToPlaylistSnippet } from "./insert-video-playlist-snippet";
import { InsertSubscriptionSnippet } from "./insert-subscription-snippet";

export type ProfileInsertPlaylist = {
  playlist: InsertPlaylist;
  videos: InsertVideoToPlaylistSnippet[];
};

export type Profile = {
  name: string;
  playlists: ProfileInsertPlaylist[];
  subscriptions: InsertSubscriptionSnippet[];
};
