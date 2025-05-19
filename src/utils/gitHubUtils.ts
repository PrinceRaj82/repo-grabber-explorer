
export interface GitHubUrlInfo {
  owner: string | null;
  repo: string | null;
  path: string | null;
  type: 'repository' | 'directory' | 'file' | 'invalid';
}

export function parseGitHubUrl(url: string): GitHubUrlInfo {
  try {
    // Handle URLs with or without protocol
    if (!url.includes('github.com')) {
      return { owner: null, repo: null, path: null, type: 'invalid' };
    }

    // Remove protocol and www if present
    let cleanUrl = url.replace(/^(https?:\/\/)?(www\.)?github\.com\//, '');
    
    // Split by slash to separate owner, repo, and path
    const parts = cleanUrl.split('/');
    
    if (parts.length < 2) {
      return { owner: null, repo: null, path: null, type: 'invalid' };
    }

    const owner = parts[0];
    // Handle repo names that end with .git
    let repo = parts[1];
    if (repo.endsWith('.git')) {
      repo = repo.substring(0, repo.length - 4); // Remove .git suffix
    }
    
    // If there's no path, it's a repository URL
    if (parts.length === 2) {
      return { owner, repo, path: null, type: 'repository' };
    }

    // Check if it's a blob URL (file) or tree URL (directory)
    if (parts.length >= 4) {
      // Check for blob (file) or tree (directory)
      if (parts[2] === 'blob' || parts[2] === 'tree') {
        // parts[3] is the branch, we'll skip it and get the rest as path
        const path = parts.slice(4).join('/');
        const type = parts[2] === 'blob' ? 'file' : 'directory';
        return { owner, repo, path, type };
      }
      
      // Special case for raw URLs
      if (parts[2] === 'raw') {
        const path = parts.slice(4).join('/');
        return { owner, repo, path, type: 'file' };
      }
    }

    // If it doesn't match known patterns, treat as invalid
    return { owner, repo, path: null, type: 'invalid' };
  } catch (error) {
    console.error('Error parsing GitHub URL:', error);
    return { owner: null, repo: null, path: null, type: 'invalid' };
  }
}

// Function to format numbers for display (e.g., 1.5k, 2.3M)
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

// Function to format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }).format(date);
}

// Helper function to get file extension
export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

// Helper function to determine if a file is binary
export function isBinaryFile(extension: string): boolean {
  const binaryExtensions = [
    'jpg', 'jpeg', 'png', 'gif', 'bmp', 'ico', 'webp',
    'mp3', 'mp4', 'avi', 'mov', 'wmv', 'flv', 'wav',
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
    'zip', 'rar', 'tar', 'gz', '7z', 
    'exe', 'dll', 'so', 'dmg', 'bin'
  ];
  
  return binaryExtensions.includes(extension.toLowerCase());
}
