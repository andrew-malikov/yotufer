import 'package:googleapis/youtube/v3.dart';

import 'package:youtube_api/src/metadata/youtube_resource_kind.dart';
import 'package:youtube_api/src/models/response.dart';
import 'package:youtube_api/src/builders/response.builder.dart';

class YoutubeSubscriptionApiService {
  final YoutubeApi _youtube;

  YoutubeSubscriptionApiService(this._youtube);

  // TODO: consider to return a stream
  Future<Response<Subscription, String>> addSubscriptions(
      List<String> channelIds) {
    ResponseBuilder<Subscription, String> builder = ResponseBuilder();

    return Future.forEach(
            channelIds,
            (channelId) => addSubscription(channelId)
                .then((subscription) => builder.addSuccessfulCase(subscription))
                .catchError((error) => builder.addFailedCase(channelId)))
        .then((onComplete) => builder.build());
  }

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
