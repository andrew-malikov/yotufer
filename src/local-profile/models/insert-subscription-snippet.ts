export type InsertSubscriptionResourceSnippet = {
  kind: string;
  channelId: string;
};

export type InsertSubscription = {
  resourceId: InsertSubscriptionResourceSnippet;
};

export type InsertSubscriptionSnippet = {
  snippet: InsertSubscription;
};
