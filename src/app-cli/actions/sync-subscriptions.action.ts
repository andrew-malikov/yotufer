import { Container } from "inversify";
import { Types } from "../../types";

import { API_SCOPES } from "../../youtube-api/metadata/api-scopes.enum";

import { FileProfileRepository } from "../../profile/file-profile.repository";
import { ProfileSyncService } from "../../profile/profile-sync.service";

import { CommandAction } from "../command-action-factory";
import { ResolvableDependencies } from "../containers/resolvable-dependencies";
import {
  PopulateYoutubeOAuthClient,
  PopulateYoutubeService,
  PopulateYoutubeSubscriptionService,
  PopulateProfileSyncService,
  PopulateProfileRepository
} from "../containers/dependency-resolvers";

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

export const GetSyncSubscriptionsDependencies = async (
  requirements: SyncSubscriptionsArgs & { container: Container }
) => {
  const resolvableDependencies = await new ResolvableDependencies(
    requirements.container
  ).populateByArgsAsync(PopulateYoutubeOAuthClient, {
    ...requirements,
    scopes: API_SCOPES
  });

  return resolvableDependencies
    .populate(PopulateYoutubeService)
    .populate(PopulateYoutubeSubscriptionService)
    .populate(PopulateProfileSyncService)
    .populateByArgs(PopulateProfileRepository, requirements)
    .resolve(container => ({
      service: container.get<ProfileSyncService>(Types.ProfileSyncService),
      profileRepository: container.get<FileProfileRepository>(
        Types.FileProfileRepository
      )
    }));
};

export const SyncSubscriptionsAction: SyncSubscriptionsAction = async (
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
