//#region src/content/github.d.ts
interface GetGithubLastCommitOptions {
  /**
   * Repository name, like "fumadocs"
   */
  repo: string;
  /** Owner of repository */
  owner: string;
  /**
   * Path to file
   */
  path: string;
  /**
   * GitHub access token
   */
  token?: string;
  /**
   * SHA or ref (branch or tag) name.
   */
  sha?: string;
  /**
   * Base URL for GitHub API
   * @default "https://api.github.com"
   * @link https://docs.github.com/en/get-started/using-github-docs/about-versions-of-github-docs#determining-which-github-product-you-use
   */
  baseUrl?: string;
  /**
   * Custom query parameters
   */
  params?: Record<string, string>;
  options?: RequestInit;
}
/**
 * Get the last edit time of a file using GitHub API
 *
 * By default, this will cache the result forever.
 * Set `options.next.revalidate` to customize this.
 */
declare function getGithubLastEdit({ repo, token, owner, path, sha, baseUrl, options, params: customParams }: GetGithubLastCommitOptions): Promise<Date | null>;
//#endregion
export { GetGithubLastCommitOptions, getGithubLastEdit };