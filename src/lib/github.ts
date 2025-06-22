
export async function searchRepo(username: string, repoName: string) {
  if (!username || !repoName) {
    return [];
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/contents`);
    
    if (!response.ok) {
      throw new Error('Repository not found or not accessible');
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching repository:', error);
    throw error;
  }
}
