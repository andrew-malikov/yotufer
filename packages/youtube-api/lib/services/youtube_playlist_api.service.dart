import 'package:googleapis/youtube/v3.dart';

class YoutubePlaylistApiService {
  final YoutubeApi _youtube;

  YoutubePlaylistApiService(this._youtube);

  Future<List<PlaylistListResponse>> getPlaylists() {
    return _youtube.playlists.list("", mine: true).then((firstPage) async {
      if (firstPage.nextPageToken != null) {
        return [
          firstPage,
          ...(await _getNextPlaylistPages(firstPage.nextPageToken))
        ];
      }

      return [firstPage];
    });
  }

  Future<List<PlaylistListResponse>> _getNextPlaylistPages(
      String pageToken) async {
    final pages = [
      await _youtube.playlists.list("", mine: true, pageToken: pageToken)
    ];

    final nextPageToken = pages[0]?.nextPageToken;

    if (nextPageToken != null) {
      pages.addAll(await _getNextPlaylistPages(nextPageToken));
    }

    return pages;
  }

  Future<Playlist> addPlaylist(
      String title, String description, String privacy) {
    final request = Playlist.fromJson({
      "playlistSnippet": PlaylistSnippet.fromJson(
          {"title": title, "description": description}),
      "status": PlaylistStatus.fromJson({"privacyStatus": privacy})
    });

    return _youtube.playlists.insert(request, "snippet,status");
  }
}
