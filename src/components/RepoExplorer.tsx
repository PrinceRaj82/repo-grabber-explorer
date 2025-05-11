import { useState } from 'react';
import { useGitHubApi, GitHubContent } from '@/hooks/useGitHubApi';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { parseGitHubUrl, getFileExtension, isBinaryFile } from '@/utils/gitHubUtils';
import { RepositoryCard } from './RepositoryCard';
import { DownloadRecord } from './RecentDownloads';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Folder, File, Download, ArrowLeft, Github, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import JSZip from 'jszip';
import { v4 as uuidv4 } from 'uuid';

export function RepoExplorer() {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [path, setPath] = useState('');
  const [breadcrumbs, setBreadcrumbs] = useState<{name: string, path: string}[]>([]);
  const [downloads, setDownloads] = useLocalStorage<DownloadRecord[]>('recent-downloads', []);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const {
    repo,
    contents,
    file,
    fetchRepo,
    fetchContents,
    fetchFile
  } = useGitHubApi();

  // Handle URL submission
  const handleExplore = async () => {
    try {
      const parsedUrl = parseGitHubUrl(url);
      
      if (parsedUrl.type === 'invalid') {
        toast({
          title: 'Invalid GitHub URL',
          description: 'Please enter a valid GitHub repository URL',
          variant: 'destructive'
        });
        return;
      }
      
      // Reset path and breadcrumbs
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
          // Create breadcrumbs
          const pathParts = parsedUrl.path.split('/');
          const crumbs = pathParts.map((part, index) => ({
            name: part,
            path: pathParts.slice(0, index + 1).join('/')
          }));
          setBreadcrumbs(crumbs);
          await fetchContents(url, parsedUrl.path);
        }
      } else if (parsedUrl.type === 'file') {
        const repoData = await fetchRepo(`https://github.com/${parsedUrl.owner}/${parsedUrl.repo}`);
        if (repoData && parsedUrl.path) {
          await fetchFile(url);
          // Create breadcrumbs for file
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
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive'
      });
    }
  };

  // Navigate to folder
  const navigateToFolder = async (folderPath: string) => {
    if (!repo.data) return;
    
    try {
      setPath(folderPath);
      
      // Update breadcrumbs
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

  // Go back to parent folder
  const goToParentFolder = async () => {
    if (!path || !repo.data) return;
    
    try {
      const pathParts = path.split('/');
      pathParts.pop();
      const parentPath = pathParts.join('/');
      
      setPath(parentPath);
      
      // Update breadcrumbs
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

  // Download file
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
      
      // Add to recent downloads
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

  // Download directory
  const downloadDirectory = async () => {
    if (!repo.data || !contents.data) return;
    
    try {
      setIsDownloading(true);
      const zip = new JSZip();
      
      // Function to recursively fetch and add files to zip
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
      
      // Generate zip file
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = path ? `${path.split('/').pop()}.zip` : `${repo.data.name}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      // Add to recent downloads
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
  
  // Download entire repository
  const downloadRepository = async () => {
    if (!repo.data) return;
    
    try {
      setIsDownloading(true);
      
      const repoUrl = `https://github.com/${repo.data.owner.login}/${repo.data.name}/archive/refs/heads/${repo.data.default_branch}.zip`;
      
      // Create an invisible link and click it
      const a = document.createElement('a');
      a.href = repoUrl;
      a.download = `${repo.data.name}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Add to recent downloads
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
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Input
              placeholder="Enter GitHub URL (e.g., https://github.com/user/repo)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleExplore} disabled={!url || repo.loading}>
              {repo.loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Explore'
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {repo.error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4">
              {repo.error}
            </div>
          )}
          
          {repo.data && (
            <div className="space-y-4">
              <RepositoryCard repo={repo.data} />
              
              {/* Breadcrumbs */}
              {breadcrumbs.length > 0 && (
                <ScrollArea className="w-full pb-2">
                  <div className="flex items-center flex-nowrap gap-1 text-sm">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2 whitespace-nowrap flex-shrink-0"
                      onClick={() => navigateToFolder('')}
                    >
                      <Github className="h-4 w-4 mr-1" />
                      Root
                    </Button>
                    
                    {breadcrumbs.map((crumb, index) => (
                      <div key={crumb.path} className="flex items-center flex-shrink-0">
                        <span className="mx-1 text-muted-foreground">/</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 px-2 whitespace-nowrap"
                          onClick={() => navigateToFolder(crumb.path)}
                        >
                          {crumb.name}
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
              
              {/* Content listing */}
              {contents.loading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : contents.data ? (
                <ScrollArea className="w-full border rounded-md max-h-[500px]">
                  {path && (
                    <div className="border-b p-2 sticky top-0 bg-background z-10">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={goToParentFolder}
                        className="h-8 px-2"
                      >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Up to parent directory
                      </Button>
                    </div>
                  )}
                  
                  {contents.data.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      This directory is empty
                    </div>
                  ) : (
                    <div className="divide-y">
                      {contents.data
                        .sort((a, b) => {
                          // Directories first, then files
                          if (a.type === 'dir' && b.type !== 'dir') return -1;
                          if (a.type !== 'dir' && b.type === 'dir') return 1;
                          // Alphabetically within each type
                          return a.name.localeCompare(b.name);
                        })
                        .map((item) => (
                          <div 
                            key={item.sha} 
                            className="p-2 flex items-center justify-between hover:bg-muted/50"
                          >
                            <div 
                              className="flex items-center gap-2 overflow-hidden cursor-pointer"
                              onClick={() => item.type === 'dir' ? navigateToFolder(item.path) : undefined}
                            >
                              {item.type === 'dir' ? (
                                <Folder className="h-4 w-4 text-blue-500 flex-shrink-0" />
                              ) : (
                                <File className="h-4 w-4 text-gray-500 flex-shrink-0" />
                              )}
                              <span className="truncate">
                                {item.name}
                              </span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 flex-shrink-0"
                              onClick={() => item.type === 'dir' 
                                ? navigateToFolder(item.path)
                                : downloadFile(item)
                              }
                            >
                              {item.type === 'dir' ? (
                                <Folder className="h-4 w-4" />
                              ) : (
                                <Download className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        ))}
                    </div>
                  )}
                </ScrollArea>
              ) : null}
            </div>
          )}
        </CardContent>
        {repo.data && (
          <CardFooter className="flex justify-end gap-2">
            {path ? (
              <Button 
                variant="outline"
                onClick={downloadDirectory}
                disabled={isDownloading || !contents.data}
              >
                {isDownloading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Download this directory
              </Button>
            ) : (
              <Button 
                variant="outline"
                onClick={downloadRepository}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Download entire repository
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
