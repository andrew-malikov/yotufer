class Subscription {
  final String channelId;

  Subscription(this.channelId);

  Subscription.fromJson(Map<String, dynamic> graph)
      : channelId = graph['channelId'];
}
