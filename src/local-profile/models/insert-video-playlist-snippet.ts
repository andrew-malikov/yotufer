export type InsertVideoToPlaylistResource = {
  kind: string;
  videoId: string;
};

export type InsertVideoToPlaylist = {
  playlistId?: string;
  resourceId: InsertVideoToPlaylistResource;
};

export type InsertVideoToPlaylistSnippet = {
  snippet: InsertVideoToPlaylist;
};
