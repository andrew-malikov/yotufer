import { FileProfileRepository } from "../../profile/file-profile.repository";
import { ProfileSyncService } from "../../profile/profile-sync.service";

import { CommandAction } from "../command-action-factory";

export type SyncSubscriptionsDependencies = {
  service: ProfileSyncService;
  profileRepository: FileProfileRepository;
};

export type SyncSubscriptionsArgs = {
  pathToProfiles: string;
  pathToCredentials: string;
  profileName: string;
  pathToToken?: string;
};

export type SyncSubscriptionsAction = CommandAction<
  SyncSubscriptionsDependencies,
  SyncSubscriptionsArgs
>;

export const SyncSubscriptionsAction: SyncSubscriptionsAction = () => async (
  args: SyncSubscriptionsDependencies & SyncSubscriptionsArgs
) => {
  const profile = await args.profileRepository.getProfileByName(
    args.profileName
  );

  if (!profile) {
    throw new Error(
      `Can't find profile by name: ${args.profileName} in the profiles: ${args.pathToProfiles}`
    );
  }

  args.service.syncSubscriptions(profile);
};
