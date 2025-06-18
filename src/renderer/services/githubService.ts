export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  html_url: string;
  user: {
    login: string;
    html_url: string;
  };
  created_at: string;
  labels: Array<{
    name: string;
    color: string;
  }>;
  state: 'open' | 'closed';
}

interface FetchIssuesResponse {
  issues: GitHubIssue[];
  nextPageUrl: string | null;
}

/**
 * Fetches GitHub issues from a specified repository.
 * @param owner The repository owner (e.g., 'facebook')
 * @param repo The repository name (e.g., 'react')
 * @param pat Optional: Personal Access Token for private repos or higher rate limits.
 * @param pageUrl Optional: URL for the next page of issues (from Link header).
 * @returns A promise resolving to an object containing issues and the next page URL.
 */
export async function fetchIssues(
  owner: string,
  repo: string,
  pat: string = '',
  pageUrl: string | null = null,
): Promise<FetchIssuesResponse> {
  const url =
    pageUrl ||
    `https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=20`;

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };

  if (pat) {
    headers.Authorization = `token ${pat}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `GitHub API Error: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`,
    );
  }

  const issues: GitHubIssue[] = await response.json();

  // Parse Link header for pagination
  const linkHeader = response.headers.get('Link');
  let nextPageUrl: string | null = null;
  if (linkHeader) {
    const nextLinkMatch = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
    if (nextLinkMatch) {
      const [, nextUrl] = nextLinkMatch;
      nextPageUrl = nextUrl;
    }
  }

  return { issues, nextPageUrl };
}
