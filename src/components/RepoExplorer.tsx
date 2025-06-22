import { useState, useEffect } from 'react';
import { useGitHubApi, GitHubContent } from '@/hooks/useGitHubApi';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { parseGitHubUrl, GitHubUrlInfo } from '@/utils/gitHubUtils';
import { RepositoryCard } from './RepositoryCard';
import { FilePreview } from './FilePreview';
import { SearchBox } from './SearchBox';
import { Breadcrumbs } from './Breadcrumbs';
import { FileList } from './FileList';
import { DownloadRecord } from './RecentDownloads';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDebounce } from '@/hooks/use-debounce';
import JSZip from 'jszip';
import { v4 as uuidv4 } from 'uuid';
import { getFileExtension, isBinaryFile } from '@/utils/gitHubUtils';

interface RepoExplorerProps {
  onSearch?: (hasResults: boolean) => void;
}

export function RepoExplorer({ onSearch }: RepoExplorerProps) {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [path, setPath] = useState('');
  const [breadcrumbs, setBreadcrumbs] = useState<{name: string, path: string}[]>([]);
  const [downloads, setDownloads] = useLocalStorage<DownloadRecord[]>('recent-downloads', []);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingFolders, setDownloadingFolders] = useState<{[key: string]: boolean}>({});
  const [previewFile, setPreviewFile] = useState<GitHubContent | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const isMobile = useIsMobile();
  const [showInitialSearch, setShowInitialSearch] = useState(true);
  
  const debouncedUrl = useDebounce(url, 800);
  
  const {
    repo,
    contents,
    file,
    fetchRepo,
    fetchContents,
    fetchFile
  } = useGitHubApi();

  useEffect(() => {
    if (onSearch) {
      onSearch(!!repo.data);
    }
    if (repo.data) {
      setShowInitialSearch(false);
    }
  }, [repo.data, onSearch]);

  useEffect(() => {
    if (debouncedUrl && debouncedUrl.includes('github.com')) {
      handleExplore();
    }
  }, [debouncedUrl]);

  const handleExplore = async () => {
    try {
      const parsedUrl = parseGitHubUrl(url);
      
      if (parsedUrl.type === 'invalid') {
        return;
      }
      
      setPath('');
      setBreadcrumbs([]);
      
      if (parsedUrl.type === 'repository') {
        const repoData = await fetchRepo(url);
        if (repoData) {
          await fetchContents(url);
        }
      } else if (parsedUrl.type === 'directory') {
        const repoData = await fetchRepo(`https://github.com/${parsedUrl.owner}/${parsedUrl.repo}`);
        if (repoData && parsedUrl.path) {
          setPath(parsedUrl.path);
          const pathParts = parsedUrl.path.split('/');
          const crumbs = pathParts.map((part, index) => ({
            name: part,
            path: pathParts.slice(0, index + 1).join('/')
          }));
          setBreadcrumbs(crumbs);
          await fetchContents(url, parsedUrl.path);
        }
      } else if (parsedUrl.type === 'file') {
        const fileData = await fetchFile(url);
        if (fileData) {
          await downloadFileDirect(fileData, parsedUrl);
          return;
        }
      }
    } catch (error) {
      if (url === debouncedUrl) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'An unknown error occurred',
          variant: 'destructive'
        });
      }
    }
  };

  const downloadFileDirect = async (fileContent: GitHubContent, parsedUrl: GitHubUrlInfo) => {
    try {
      if (!fileContent.download_url) {
        toast({
          title: 'Download Error',
          description: 'No download URL available for this file',
          variant: 'destructive'
        });
        return;
      }
      
      setIsDownloading(true);
      const response = await fetch(fileContent.download_url);
      if (!response.ok) {
        throw new Error('Failed to download file');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileContent.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      const newDownload: DownloadRecord = {
        id: uuidv4(),
        url: fileContent.html_url,
        timestamp: Date.now(),
        type: 'file',
        name: fileContent.name
      };
      setDownloads([newDownload, ...downloads.slice(0, 9)]);
      
      toast({
        title: 'File Downloaded',
        description: `Successfully downloaded ${fileContent.name}`
      });

      if (parsedUrl.owner && parsedUrl.repo) {
        const repoData = await fetchRepo(`https://github.com/${parsedUrl.owner}/${parsedUrl.repo}`);
        if (repoData) {
          if (parsedUrl.path) {
            const pathParts = parsedUrl.path.split('/');
            const fileName = pathParts.pop() || '';
            const directoryPath = pathParts.join('/');
            
            const crumbs = pathParts.map((part, index) => ({
              name: part,
              path: pathParts.slice(0, index + 1).join('/')
            }));
            
            setPath(directoryPath);
            setBreadcrumbs(crumbs);
          }
        }
      }
    } catch (error) {
      toast({
        title: 'Download Error',
        description: error instanceof Error ? error.message : 'Failed to download file',
        variant: 'destructive'
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleFilePreview = (fileContent: GitHubContent) => {
    if (isMobile) {
      downloadFile(fileContent);
      return;
    }
    
    setPreviewFile(fileContent);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setPreviewFile(null);
  };

  const downloadPreviewFile = () => {
    if (previewFile) {
      downloadFile(previewFile);
    }
  };

  const navigateToFolder = async (folderPath: string) => {
    if (!repo.data) return;
    
    try {
      setPath(folderPath);
      
      const pathParts = folderPath.split('/');
      const crumbs = pathParts.map((part, index) => ({
        name: part,
        path: pathParts.slice(0, index + 1).join('/')
      }));
      setBreadcrumbs(crumbs);
      
      await fetchContents(`https://github.com/${repo.data.owner.login}/${repo.data.name}`, folderPath);
    } catch (error) {
      toast({
        title: 'Navigation Error',
        description: error instanceof Error ? error.message : 'Failed to navigate to folder',
        variant: 'destructive'
      });
    }
  };

  const goToParentFolder = async () => {
    if (!path || !repo.data) return;
    
    try {
      const pathParts = path.split('/');
      pathParts.pop();
      const parentPath = pathParts.join('/');
      
      setPath(parentPath);
      
      const crumbs = pathParts.map((part, index) => ({
        name: part,
        path: pathParts.slice(0, index + 1).join('/')
      }));
      setBreadcrumbs(crumbs);
      
      await fetchContents(`https://github.com/${repo.data.owner.login}/${repo.data.name}`, parentPath);
    } catch (error) {
      toast({
        title: 'Navigation Error',
        description: error instanceof Error ? error.message : 'Failed to navigate to parent folder',
        variant: 'destructive'
      });
    }
  };

  const backToSearch = () => {
    setShowInitialSearch(true);
  };

  const downloadFile = async (fileContent: GitHubContent) => {
    try {
      if (!fileContent.download_url) {
        toast({
          title: 'Download Error',
          description: 'No download URL available for this file',
          variant: 'destructive'
        });
        return;
      }
      
      const response = await fetch(fileContent.download_url);
      if (!response.ok) {
        throw new Error('Failed to download file');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileContent.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      const newDownload: DownloadRecord = {
        id: uuidv4(),
        url: fileContent.html_url,
        timestamp: Date.now(),
        type: 'file',
        name: fileContent.name
      };
      setDownloads([newDownload, ...downloads.slice(0, 9)]);
      
      toast({
        title: 'File Downloaded',
        description: `Successfully downloaded ${fileContent.name}`
      });
    } catch (error) {
      toast({
        title: 'Download Error',
        description: error instanceof Error ? error.message : 'Failed to download file',
        variant: 'destructive'
      });
    }
  };

  const downloadSpecificFolder = async (folderPath: string, folderName: string) => {
    if (!repo.data) return;
    
    try {
      setDownloadingFolders(prev => ({ ...prev, [folderPath]: true }));
      
      const zip = new JSZip();
      
      const addToZip = async (
        contentPath: string, 
        zipFolder: JSZip = zip
      ) => {
        const contentResponse = await fetch(
          `https://api.github.com/repos/${repo.data.owner.login}/${repo.data.name}/contents/${contentPath}`
        );
        
        if (!contentResponse.ok) {
          throw new Error('Failed to fetch folder contents');
        }
        
        const contentItems = await contentResponse.json() as GitHubContent[];
        
        for (const item of contentItems) {
          if (item.type === 'file') {
            if (!item.download_url) continue;
            
            const response = await fetch(item.download_url);
            if (!response.ok) continue;
            
            let content;
            const extension = getFileExtension(item.name);
            
            if (isBinaryFile(extension)) {
              content = await response.blob();
            } else {
              content = await response.text();
            }
            
            zipFolder.file(item.name, content);
          } else if (item.type === 'dir') {
            const subFolder = zipFolder.folder(item.name);
            if (!subFolder) continue;
            
            const subPath = contentPath ? `${contentPath}/${item.name}` : item.name;
            await addToZip(subPath, subFolder);
          }
        }
      };
      
      await addToZip(folderPath);
      
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${folderName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      const downloadUrl = `https://github.com/${repo.data.owner.login}/${repo.data.name}/tree/main/${folderPath}`;
      
      const newDownload: DownloadRecord = {
        id: uuidv4(),
        url: downloadUrl,
        timestamp: Date.now(),
        type: 'directory',
        name: folderName
      };
      setDownloads([newDownload, ...downloads.slice(0, 9)]);
      
      toast({
        title: 'Download Complete',
        description: `Successfully downloaded ${folderName}`
      });
    } catch (error) {
      toast({
        title: 'Download Error',
        description: error instanceof Error ? error.message : 'Failed to download folder',
        variant: 'destructive'
      });
    } finally {
      setDownloadingFolders(prev => {
        const updated = { ...prev };
        delete updated[folderPath];
        return updated;
      });
    }
  };

  const downloadDirectory = async () => {
    if (!repo.data || !contents.data) return;
    
    try {
      setIsDownloading(true);
      const zip = new JSZip();
      
      const addToZip = async (
        contentItems: GitHubContent[], 
        currentPath: string = '', 
        zipFolder: JSZip = zip
      ) => {
        for (const item of contentItems) {
          if (item.type === 'file') {
            if (!item.download_url) continue;
            
            const response = await fetch(item.download_url);
            if (!response.ok) continue;
            
            let content;
            const extension = getFileExtension(item.name);
            
            if (isBinaryFile(extension)) {
              content = await response.blob();
            } else {
              content = await response.text();
            }
            
            zipFolder.file(item.name, content);
          } else if (item.type === 'dir') {
            const subFolder = zipFolder.folder(item.name);
            if (!subFolder) continue;
            
            const subPath = currentPath ? `${currentPath}/${item.name}` : item.name;
            const subContentResponse = await fetch(
              `https://api.github.com/repos/${repo.data.owner.login}/${repo.data.name}/contents/${subPath}`
            );
            
            if (subContentResponse.ok) {
              const subContents = await subContentResponse.json() as GitHubContent[];
              await addToZip(subContents, subPath, subFolder);
            }
          }
        }
      };
      
      await addToZip(contents.data);
      
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = path ? `${path.split('/').pop()}.zip`  : `${repo.data.name}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      const downloadUrl = path
        ? `https://github.com/${repo.data.owner.login}/${repo.data.name}/tree/main/${path}`
        : repo.data.html_url;
      
      const newDownload: DownloadRecord = {
        id: uuidv4(),
        url: downloadUrl,
        timestamp: Date.now(),
        type: path ? 'directory' : 'repository',
        name: path ? path.split('/').pop() || repo.data.name : repo.data.name
      };
      setDownloads([newDownload, ...downloads.slice(0, 9)]);
      
      toast({
        title: 'Download Complete',
        description: `Successfully downloaded ${path || repo.data.name}`
      });
    } catch (error) {
      toast({
        title: 'Download Error',
        description: error instanceof Error ? error.message : 'Failed to download directory',
        variant: 'destructive'
      });
    } finally {
      setIsDownloading(false);
    }
  };
  
  const downloadRepository = async () => {
    if (!repo.data) return;
    
    try {
      setIsDownloading(true);
      
      const repoUrl = `https://github.com/${repo.data.owner.login}/${repo.data.name}/archive/refs/heads/${repo.data.default_branch}.zip`;
      
      const a = document.createElement('a');
      a.href = repoUrl;
      a.download = `${repo.data.name}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      const newDownload: DownloadRecord = {
        id: uuidv4(),
        url: repo.data.html_url,
        timestamp: Date.now(),
        type: 'repository',
        name: repo.data.name
      };
      setDownloads([newDownload, ...downloads.slice(0, 9)]);
      
      toast({
        title: 'Repository Download Started',
        description: `Downloading ${repo.data.name}`
      });
    } catch (error) {
      toast({
        title: 'Download Error',
        description: error instanceof Error ? error.message : 'Failed to download repository',
        variant: 'destructive'
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {showInitialSearch || !repo.data ? (
        <SearchBox
          url={url}
          onUrlChange={setUrl}
          onExplore={handleExplore}
          isLoading={repo.loading}
          error={repo.error}
        />
      ) : (
        <div className="max-w-3xl mx-auto animate-fade-in space-y-4">
          <RepositoryCard repo={repo.data} onBack={backToSearch} />
          
          <Breadcrumbs 
            breadcrumbs={breadcrumbs}
            onNavigate={navigateToFolder}
          />
          
          {contents.data && (
            <FileList
              contents={contents.data}
              path={path}
              isLoading={contents.loading}
              downloadingFolders={downloadingFolders}
              onNavigateToFolder={navigateToFolder}
              onGoToParent={goToParentFolder}
              onFilePreview={handleFilePreview}
              onDownloadFile={downloadFile}
              onDownloadFolder={downloadSpecificFolder}
              onDownloadDirectory={downloadDirectory}
              onDownloadRepository={downloadRepository}
              isDownloading={isDownloading}
            />
          )}
        </div>
      )}
      
      {previewFile && (
        <FilePreview
          file={previewFile}
          isOpen={isPreviewOpen}
          onClose={closePreview}
          onDownload={downloadPreviewFile}
        />
      )}
    </div>
  );
}
