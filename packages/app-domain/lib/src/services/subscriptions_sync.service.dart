import 'package:rxdart/rxdart.dart';
import 'package:googleapis/youtube/v3.dart' as youtube;

import 'package:youtube_api/youtube_api.dart';
import 'package:youtube_profile/youtube_profile.dart';

class SubscriptionsSyncService {
  final YoutubeSubscriptionApiService _service;

  SubscriptionsSyncService(this._service);

  Subject<youtube.Subscription> sync(List<Subscription> subscriptions) {
    return _service.addSubscriptions(
        subscriptions.map((subscription) => subscription.channelId));
  }
}
