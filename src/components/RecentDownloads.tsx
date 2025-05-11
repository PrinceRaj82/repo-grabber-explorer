
import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Trash2, Github } from 'lucide-react';
import { parseGitHubUrl } from '@/utils/gitHubUtils';

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

  useEffect(() => {
    setIsEmpty(downloads.length === 0);
  }, [downloads]);

  const handleClear = () => {
    setDownloads([]);
  };

  const handleRemove = (id: string) => {
    setDownloads(downloads.filter(item => item.id !== id));
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
          {downloads.slice(0, 5).map((item) => {
            const { owner, repo, path } = parseGitHubUrl(item.url);
            const displayName = item.name || 
              (item.type === 'repository' ? repo : 
              item.type === 'file' ? path?.split('/').pop() : 
              path || 'Unknown');
                
            return (
              <div 
                key={item.id}
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  {item.type === 'repository' && <Github className="h-4 w-4 flex-shrink-0" />}
                  {item.type === 'directory' && <Github className="h-4 w-4 flex-shrink-0" />}
                  {item.type === 'file' && <Github className="h-4 w-4 flex-shrink-0" />}
                  <div className="overflow-hidden">
                    <a 
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:underline block truncate"
                    >
                      {displayName}
                    </a>
                    <p className="text-xs text-muted-foreground truncate">
                      {owner}/{repo}{path ? `/${path}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive" 
                    onClick={() => handleRemove(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
