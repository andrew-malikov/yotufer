import { GaxiosResponse } from "gaxios";

export type ResolvableError = (response: GaxiosResponse) => boolean;

export const getChainedResolvableError = (resolvers: ResolvableError[]) => (
  response: GaxiosResponse
) => {
  for (const resolvable of resolvers) {
    if (resolvable(response)) {
      return true;
    }
  }

  return false;
};

export const resolvableErrors: { [key: string]: ResolvableError } = {
  byStatusCode: response => {
    return response.status >= 400;
  }
};
