export type InsertPlaylistSnippet = {
  channelId: string;
  title: string;
};

export type InsertPlaylistStatus = {
  privacyStatus: string;
};

export type InsertPlaylist = {
  kind: string;
  snippet: InsertPlaylistSnippet;
  status: InsertPlaylistStatus;
};
