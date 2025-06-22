
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, Trash2, Loader2, Github } from 'lucide-react';
import { DownloadRecord } from './RecentDownloads';
import { parseGitHubUrl } from '@/utils/gitHubUtils';

interface RecentDownloadItemProps {
  item: DownloadRecord;
  isDownloading: boolean;
  onDownload: (item: DownloadRecord) => void;
  onRemove: (id: string) => void;
}

export function RecentDownloadItem({ 
  item, 
  isDownloading, 
  onDownload, 
  onRemove 
}: RecentDownloadItemProps) {
  const { owner, repo, path } = parseGitHubUrl(item.url);
  const displayName = item.name || 
    (item.type === 'repository' ? repo : 
    item.type === 'file' ? path?.split('/').pop() : 
    path || 'Unknown');

  return (
    <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
      <div className="flex items-center gap-2 overflow-hidden">
        <Github className="h-4 w-4 flex-shrink-0" />
        <div className="overflow-hidden">
          <div className="font-medium block truncate">
            {displayName}
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {owner}/{repo}{path ? `/${path}` : ''}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => onDownload(item)}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          asChild
        >
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-muted-foreground hover:text-destructive" 
          onClick={() => onRemove(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
