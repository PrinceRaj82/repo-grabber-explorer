
import { useState } from 'react';
import { parseGitHubUrl } from '@/utils/gitHubUtils';

// Define types for GitHub API responses
export interface GitHubRepo {
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  default_branch: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

export interface GitHubContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: string;
  content?: string;
  encoding?: string;
}

export interface GitHubApiError {
  message: string;
  documentation_url?: string;
}

// Define return types
type GitHubApiResult<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export function useGitHubApi() {
  const [repoResult, setRepoResult] = useState<GitHubApiResult<GitHubRepo>>({
    data: null,
    loading: false,
    error: null,
  });

  const [contentsResult, setContentsResult] = useState<GitHubApiResult<GitHubContent[]>>({
    data: null,
    loading: false,
    error: null,
  });

  const [fileResult, setFileResult] = useState<GitHubApiResult<GitHubContent>>({
    data: null,
    loading: false,
    error: null,
  });

  // Fetch repository information
  const fetchRepo = async (url: string) => {
    setRepoResult({ data: null, loading: true, error: null });
    try {
      const { owner, repo } = parseGitHubUrl(url);
      if (!owner || !repo) {
        throw new Error('Invalid GitHub URL');
      }

      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      
      if (!response.ok) {
        const errorData = await response.json() as GitHubApiError;
        throw new Error(errorData.message || 'Failed to fetch repository');
      }
      
      const data = await response.json() as GitHubRepo;
      setRepoResult({ data, loading: false, error: null });
      return data;
    } catch (error) {
      setRepoResult({ 
        data: null, 
        loading: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
      return null;
    }
  };

  // Fetch contents of a directory
  const fetchContents = async (url: string, path: string = '') => {
    setContentsResult({ data: null, loading: true, error: null });
    try {
      const { owner, repo } = parseGitHubUrl(url);
      if (!owner || !repo) {
        throw new Error('Invalid GitHub URL');
      }

      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        const errorData = await response.json() as GitHubApiError;
        throw new Error(errorData.message || 'Failed to fetch contents');
      }
      
      const data = await response.json() as GitHubContent[];
      setContentsResult({ data, loading: false, error: null });
      return data;
    } catch (error) {
      setContentsResult({ 
        data: null, 
        loading: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
      return null;
    }
  };

  // Fetch a specific file
  const fetchFile = async (url: string) => {
    setFileResult({ data: null, loading: true, error: null });
    try {
      const { owner, repo, path } = parseGitHubUrl(url);
      if (!owner || !repo || !path) {
        throw new Error('Invalid GitHub file URL');
      }

      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        const errorData = await response.json() as GitHubApiError;
        throw new Error(errorData.message || 'Failed to fetch file');
      }
      
      const data = await response.json() as GitHubContent;
      setFileResult({ data, loading: false, error: null });
      return data;
    } catch (error) {
      setFileResult({ 
        data: null, 
        loading: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
      return null;
    }
  };

  return {
    repo: repoResult,
    contents: contentsResult,
    file: fileResult,
    fetchRepo,
    fetchContents,
    fetchFile
  };
}
