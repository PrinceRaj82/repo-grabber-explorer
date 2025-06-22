
/**
 * Interface representing a repository search result
 */
interface RepoSearchResult {
  path: string;
  type: string;
  url: string;
  name: string;
}

/**
 * Search for files within a GitHub repository
 * 
 * @param username The GitHub username
 * @param repoName The repository name
 * @returns An array of search results
 */
export async function searchRepo(
  username: string,
  repoName: string
): Promise<RepoSearchResult[]> {
  try {
    // Skip API call if username or repoName are empty
    if (!username || !repoName) {
      return [];
    }

    // GitHub API endpoint for repository contents
    const url = `https://api.github.com/repos/${username}/${repoName}/contents`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform the API response to our expected format
    return data.map((item: any) => ({
      path: item.path,
      type: item.type,
      url: item.html_url,
      name: item.name
    }));
  } catch (error) {
    console.error("Error fetching repo contents:", error);
    throw error;
  }
}
