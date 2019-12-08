import 'package:googleapis/youtube/v3.dart';
import 'package:rxdart/subjects.dart';

import 'package:youtube_api/src/metadata/youtube_resource_kind.dart';

class YoutubeSubscriptionApiService {
  final YoutubeApi _youtube;

  YoutubeSubscriptionApiService(this._youtube);

  Subject<Subscription> addSubscriptions(List<String> channelIds) {
    final subject = ReplaySubject<Subscription>();

    Future.forEach(
            channelIds,
            (channelId) => addSubscription(channelId)
                .then((subscription) => subject.add(subscription))
                .catchError((error) => subject.addError(error)))
        .then((onComplete) => subject.close());

    return subject;
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
