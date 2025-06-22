
export interface GitHubSearchResult {
  path: string;
  type: 'file' | 'dir';
  name: string;
  download_url?: string;
}

export async function searchRepo(username: string, repoName: string): Promise<GitHubSearchResult[]> {
  if (!username || !repoName) {
    return [];
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/contents`);
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        path: item.path,
        type: item.type,
        name: item.name,
        download_url: item.download_url
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching repository contents:', error);
    throw error;
  }
}
