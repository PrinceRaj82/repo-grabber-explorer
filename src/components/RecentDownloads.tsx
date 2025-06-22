import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Github } from 'lucide-react';
import { RecentDownloadItem } from './RecentDownloadItem';
import { useGitHubApi } from '@/hooks/useGitHubApi';
import { parseGitHubUrl } from '@/utils/gitHubUtils';
import { useToast } from '@/hooks/use-toast';
import JSZip from 'jszip';

export interface DownloadRecord {
  id: string;
  url: string;
  timestamp: number;
  type: 'repository' | 'directory' | 'file';
  name: string;
}

export function RecentDownloads() {
  const [downloads, setDownloads] = useLocalStorage<DownloadRecord[]>('recent-downloads', []);
  const [isEmpty, setIsEmpty] = useState(true);
  const [downloadingItems, setDownloadingItems] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();
  const { fetchRepo, fetchContents, fetchFile } = useGitHubApi();

  useEffect(() => {
    setIsEmpty(downloads.length === 0);
  }, [downloads]);

  const handleClear = () => {
    setDownloads([]);
  };

  const handleRemove = (id: string) => {
    setDownloads(downloads.filter(item => item.id !== id));
  };

  const handleDownload = async (item: DownloadRecord) => {
    try {
      setDownloadingItems(prev => ({ ...prev, [item.id]: true }));
      
      const { owner, repo, path, type } = parseGitHubUrl(item.url);
      
      if (!owner || !repo) {
        throw new Error('Invalid GitHub URL');
      }
      
      if (item.type === 'file') {
        const fileData = await fetchFile(item.url);
        if (!fileData || !fileData.download_url) {
          throw new Error('Failed to fetch file data');
        }
        
        const response = await fetch(fileData.download_url);
        if (!response.ok) {
          throw new Error('Failed to download file');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = item.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        toast({
          title: 'File Downloaded',
          description: `Successfully downloaded ${item.name}`
        });
      } 
      else if (item.type === 'directory') {
        const zip = new JSZip();
        
        const addToZip = async (
          contentPath: string, 
          zipFolder: JSZip = zip
        ) => {
          const contentResponse = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/contents/${contentPath}`
          );
          
          if (!contentResponse.ok) {
            throw new Error('Failed to fetch folder contents');
          }
          
          const contentItems = await contentResponse.json();
          
          for (const contentItem of Array.isArray(contentItems) ? contentItems : [contentItems]) {
            if (contentItem.type === 'file') {
              if (!contentItem.download_url) continue;
              
              const response = await fetch(contentItem.download_url);
              if (!response.ok) continue;
              
              const content = await response.text();
              zipFolder.file(contentItem.name, content);
            } else if (contentItem.type === 'dir') {
              const subFolder = zipFolder.folder(contentItem.name);
              if (!subFolder) continue;
              
              const subPath = contentPath ? `${contentPath}/${contentItem.name}` : contentItem.name;
              await addToZip(subPath, subFolder);
            }
          }
        };
        
        if (path) {
          await addToZip(path);
        } else {
          const contentsData = await fetchContents(item.url);
          if (contentsData && Array.isArray(contentsData)) {
            await addToZip('');
          }
        }
        
        const blob = await zip.generateAsync({ type: 'blob' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${item.name}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        toast({
          title: 'Directory Downloaded',
          description: `Successfully downloaded ${item.name}`
        });
      } 
      else if (item.type === 'repository') {
        const repoData = await fetchRepo(item.url);
        if (!repoData) {
          throw new Error('Failed to fetch repository data');
        }
        
        const repoUrl = `https://github.com/${owner}/${repo}/archive/refs/heads/${repoData.default_branch}.zip`;
        
        const a = document.createElement('a');
        a.href = repoUrl;
        a.download = `${repo}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        toast({
          title: 'Repository Download Started',
          description: `Downloading ${repo}`
        });
      }
    } catch (error) {
      toast({
        title: 'Download Error',
        description: error instanceof Error ? error.message : 'Failed to download item',
        variant: 'destructive'
      });
    } finally {
      setDownloadingItems(prev => {
        const updated = { ...prev };
        delete updated[item.id];
        return updated;
      });
    }
  };

  if (isEmpty) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Recent Downloads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Github className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No recent downloads</p>
            <p className="text-sm text-muted-foreground mt-1">
              Your download history will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Recent Downloads</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="h-8 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Clear All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {downloads.slice(0, 5).map((item) => (
            <RecentDownloadItem
              key={item.id}
              item={item}
              isDownloading={downloadingItems[item.id]}
              onDownload={handleDownload}
              onRemove={handleRemove}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
