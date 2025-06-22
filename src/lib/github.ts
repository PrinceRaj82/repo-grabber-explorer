
export interface SearchResult {
  path: string;
  name: string;
  type: 'file' | 'dir';
  download_url?: string;
  html_url: string;
}

export async function searchRepo(username: string, repoName: string): Promise<SearchResult[]> {
  if (!username || !repoName) {
    return [];
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/contents`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch repository contents: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform GitHub API response to SearchResult format
    return data.map((item: any) => ({
      path: item.path,
      name: item.name,
      type: item.type === 'dir' ? 'dir' : 'file',
      download_url: item.download_url,
      html_url: item.html_url
    }));
  } catch (error) {
    console.error('Error fetching repository:', error);
    throw error;
  }
}
