import 'package:googleapis/youtube/v3.dart';

import 'package:youtube_api/metadata/youtube_resource_kind.dart';

class YoutubeSubscriptionApiService {
  final YoutubeApi _youtube;

  YoutubeSubscriptionApiService(this._youtube);

  Future<Subscription> addSubscription(String channelId) {
    final request = Subscription.fromJson({
      "snippet": SubscriptionSnippet.fromJson({
        "resourceId": ResourceId.fromJson({
          "kind": YOUTUBE_RESOURCE_KIND_PROPS[YOUTUBE_RESOURCE_KIND.CHANNEL],
          "channelId": channelId
        })
      })
    });

    return _youtube.subscriptions.insert(request, "snippet");
  }

  Future<bool> hasSubscription(String channelId) {
    return _youtube.subscriptions
        .list("", mine: true, forChannelId: channelId)
        .then((response) {
      return response.items.isNotEmpty;
    });
  }
}
