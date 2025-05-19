import { useState, useEffect } from 'react';
import { useGitHubApi, GitHubContent } from '@/hooks/useGitHubApi';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { parseGitHubUrl, getFileExtension, isBinaryFile } from '@/utils/gitHubUtils';
import { RepositoryCard } from './RepositoryCard';
import { DownloadRecord } from './RecentDownloads';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Folder, File, Download, ArrowLeft, Github, Loader2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import JSZip from 'jszip';
import { v4 as uuidv4 } from 'uuid';

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
  const isMobile = useIsMobile();
  const [showInitialSearch, setShowInitialSearch] = useState(true);
  
  const {
    repo,
    contents,
    file,
    fetchRepo,
    fetchContents,
    fetchFile
  } = useGitHubApi();

  useEffect(() => {
    // Call onSearch callback when repo data changes
    if (onSearch) {
      onSearch(!!repo.data);
    }
    if (repo.data) {
      setShowInitialSearch(false);
    }
  }, [repo.data, onSearch]);

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

  // Return to initial search
  const backToSearch = () => {
    setShowInitialSearch(true);
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

  // Download specific folder
  const downloadSpecificFolder = async (folderPath: string, folderName: string) => {
    if (!repo.data) return;
    
    try {
      // Mark this folder as currently downloading
      setDownloadingFolders(prev => ({ ...prev, [folderPath]: true }));
      
      const zip = new JSZip();
      
      // Function to recursively fetch and add files to zip
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
      
      // Generate zip file
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${folderName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      // Add to recent downloads
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
      // Mark this folder as no longer downloading
      setDownloadingFolders(prev => {
        const updated = { ...prev };
        delete updated[folderPath];
        return updated;
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
      {showInitialSearch || !repo.data ? (
        <Card className="border border-border/40 backdrop-blur-sm animate-fade-in hover-scale max-w-2xl mx-auto">
          <CardHeader className="pb-3">
            <div className="search-container p-4 animate-fade-in">
              <div className="flex flex-col md:flex-row gap-2">
                <Input
                  type="text"
                  placeholder="Enter GitHub URL (e.g., https://github.com/user/repo)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="search-input flex-grow"
                />
                <Button 
                  onClick={handleExplore} 
                  disabled={!url || repo.loading}
                  className="search-button"
                >
                  {repo.loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Explore
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {repo.error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4">
                {repo.error}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="max-w-3xl mx-auto animate-fade-in space-y-4">
          <RepositoryCard repo={repo.data} onBack={backToSearch} />
          
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border border-border/30 rounded-md pb-1">
              <ScrollArea className="w-full py-1 px-2">
                <div className="flex items-center flex-nowrap gap-1 text-sm">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-2 whitespace-nowrap flex-shrink-0 hover:bg-accent/10 hover:text-accent"
                    onClick={() => navigateToFolder('')}
                  >
                    <Github className="h-4 w-4 mr-1 text-accent" />
                    <span>Root</span>
                  </Button>
                  
                  {breadcrumbs.map((crumb, index) => (
                    <div key={crumb.path} className="flex items-center flex-shrink-0">
                      <span className="mx-1 text-muted-foreground">/</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 px-2 whitespace-nowrap hover:bg-accent/10 hover:text-accent"
                        onClick={() => navigateToFolder(crumb.path)}
                      >
                        {crumb.name}
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
          
          {/* Content listing */}
          {contents.loading ? (
            <div className="flex justify-center p-8 animate-pulse">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : contents.data ? (
            <Card className="border border-border/40">
              <ScrollArea className="w-full max-h-[500px] bg-card/30">
                {path && (
                  <div className="border-b border-border/40 p-2 sticky top-0 bg-card/90 backdrop-blur-sm z-10">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={goToParentFolder}
                      className="h-8 px-2 hover:bg-accent/10 hover:text-accent"
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
                  <div className="divide-y divide-border/20">
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
                          className={cn(
                            "p-2 flex items-center justify-between transition-colors",
                            "hover:bg-accent/5 animate-slide-in"
                          )}
                        >
                          <div 
                            className="flex items-center gap-2 overflow-hidden cursor-pointer flex-1"
                            onClick={() => item.type === 'dir' ? navigateToFolder(item.path) : undefined}
                          >
                            {item.type === 'dir' ? (
                              <Folder className="h-4 w-4 text-accent flex-shrink-0" />
                            ) : (
                              <File className="h-4 w-4 text-primary flex-shrink-0" />
                            )}
                            <span className="truncate">
                              {item.name}
                            </span>
                          </div>
                          <div className="flex flex-shrink-0 gap-1">
                            {item.type === 'dir' && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 hover:bg-accent/10"
                                onClick={() => downloadSpecificFolder(item.path, item.name)}
                                disabled={downloadingFolders[item.path]}
                              >
                                {downloadingFolders[item.path] ? (
                                  <Loader2 className="h-4 w-4 text-accent animate-spin" />
                                ) : (
                                  <Download className="h-4 w-4 text-accent" />
                                )}
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 hover:bg-accent/10"
                              onClick={() => item.type === 'dir' 
                                ? navigateToFolder(item.path)
                                : downloadFile(item)
                              }
                            >
                              {item.type === 'dir' ? (
                                <Folder className="h-4 w-4 text-accent" />
                              ) : (
                                <Download className="h-4 w-4 text-primary" />
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </ScrollArea>

              <CardFooter className="flex justify-end gap-2 border-t border-border/20 pt-3">
                {path ? (
                  <Button 
                    variant="outline"
                    onClick={downloadDirectory}
                    disabled={isDownloading || !contents.data}
                    className="border-accent/30 hover:border-accent hover:bg-accent/10 hover:text-accent"
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
                    className="border-accent/30 hover:border-accent hover:bg-accent/10 hover:text-accent"
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
            </Card>
          ) : null}
        </div>
      )}
    </div>
  );
}
