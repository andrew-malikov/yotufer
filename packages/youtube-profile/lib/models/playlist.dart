class Playlist {
  final String title;
  final List<String> videoIds;
  final String privacyStatus;

  Playlist(this.title, this.videoIds, this.privacyStatus);

  Playlist.fromJson(Map<String, dynamic> graph)
      : title = graph['title'],
        videoIds = graph['videoIds'],
        privacyStatus = graph['privacyStatus'];
}
