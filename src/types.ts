export const Types: Readonly<{
  Youtube: symbol;
  OAuth2Client: symbol;
  YoutubeSubscriptionApiService: symbol;
  ProfileSyncService: symbol;
  FileProfileRepository: symbol;
}> = {
  Youtube: Symbol.for("Youtube"),
  OAuth2Client: Symbol.for("OAuth2Client"),
  YoutubeSubscriptionApiService: Symbol.for("YoutubeSubscriptionApiService"),
  ProfileSyncService: Symbol.for("ProfileSyncService"),
  FileProfileRepository: Symbol.for("FileProfileRepository")
};
