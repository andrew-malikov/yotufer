import { Container } from "inversify";
import { Types } from "../../types";

import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";

import { Youtube } from "../../youtube-api/types/youtube.aliases";

import { YoutubeApiBuilder } from "../../youtube-api/youtube-api-builder";
import { ProvidableTokenFactory } from "../../youtube-api/auth/providable-token";
import { FileAppCredentialsRepository } from "../../app-credentials/file-app-credentials.repository";
import { YoutubeSubscriptionApiService } from "../../youtube-api/services/youtube-subscription-api.service";
import { FileProfileRepository } from "../../profile/file-profile.repository";

import { ProfileSyncService } from "../../profile/profile-sync.service";

import {
  PopulateDependenciesByArgsAsync,
  PopulateDependencies,
  PopulateDependenciesByArgs
} from "./resolvable-dependencies";

export type YoutubeOAuthClientPopulationArgs = {
  pathToCredentials: string;
  pathToToken?: string;
  scopes: ReadonlyArray<string>;
};

export const PopulateYoutubeOAuthClient: PopulateDependenciesByArgsAsync<YoutubeOAuthClientPopulationArgs> = async (
  container: Container,
  args: YoutubeOAuthClientPopulationArgs
) => {
  const getProvidableToken = (pathToToken?: string) => {
    const tokenFactory = new ProvidableTokenFactory();

    if (pathToToken) {
      return tokenFactory.getFileProvidable(pathToToken);
    }

    return tokenFactory.getConsoleProvidable();
  };

  const client = (
    await new YoutubeApiBuilder(
      getProvidableToken(args.pathToToken),
      await new FileAppCredentialsRepository(
        args.pathToCredentials
      ).getCredentials()
    ).authorize(args.scopes)
  ).build();

  container.bind<OAuth2Client>(OAuth2Client).toConstantValue(client);
};

export const PopulateYoutubeService: PopulateDependencies = (
  container: Container
) => {
  container
    .bind<Youtube>(Types.Youtube)
    .toDynamicValue(() => google.youtube("v3"));
};

export const PopulateYoutubeSubscriptionService: PopulateDependencies = (
  container: Container
) => {
  container
    .bind<YoutubeSubscriptionApiService>(Types.YoutubeSubscriptionApiService)
    .to(YoutubeSubscriptionApiService);
};

export const PopulateProfileSyncService: PopulateDependencies = (
  container: Container
) => {
  container
    .bind<ProfileSyncService>(Types.ProfileSyncService)
    .to(ProfileSyncService);
};

export type PopulateProfileRepositoryArgs = { pathToProfiles: string };

export const PopulateProfileRepository: PopulateDependenciesByArgs<PopulateProfileRepositoryArgs> = (
  container: Container,
  args: PopulateProfileRepositoryArgs
) => {
  container
    .bind<FileProfileRepository>(Types.FileProfileRepository)
    .toDynamicValue(() => new FileProfileRepository(args.pathToProfiles));
};
