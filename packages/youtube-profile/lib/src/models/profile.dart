import 'package:youtube_profile/src/models/playlist.dart';
import 'package:youtube_profile/src/models/subscription.dart';

class Profile {
  final String name;
  final List<Playlist> playlist;
  final List<Subscription> subscriptions;

  Profile(this.name, this.playlist, this.subscriptions);

  Profile.fromJson(Map<String, dynamic> graph)
      : name = graph['name'],
        playlist = (graph['playlist'] as List)
            .map((playlistGraph) => Playlist.fromJson(playlistGraph))
            .toList(),
        subscriptions = (graph['subscriptions'] as List)
            .map(
                (subscriptionGraph) => Subscription.fromJson(subscriptionGraph))
            .toList();
}
