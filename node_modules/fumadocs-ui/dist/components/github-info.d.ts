import { ComponentProps } from "react";
//#region src/components/github-info.d.ts
interface FetchRepositoryInfoOptions {
  owner: string;
  repo: string;
  baseUrl?: string;
  token?: string;
  fetchOptions?: RequestInit;
}
interface RepositoryInfo {
  stars: number;
  forks: number;
}
interface GithubInfoProps extends ComponentProps<'a'>, FetchRepositoryInfoOptions {
  locale?: Intl.LocalesArgument;
}
declare function fetchRepositoryInfo({ owner, repo, token, baseUrl, fetchOptions }: FetchRepositoryInfoOptions): Promise<RepositoryInfo>;
declare function GithubInfo({ repo, owner, token, baseUrl, fetchOptions, locale, ...props }: GithubInfoProps): import("react").JSX.Element;
//#endregion
export { FetchRepositoryInfoOptions, GithubInfo, GithubInfoProps, RepositoryInfo, fetchRepositoryInfo };