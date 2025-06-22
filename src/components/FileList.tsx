
import { GitHubContent } from '@/hooks/useGitHubApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Folder, File, Download, ArrowLeft, Eye, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface FileListProps {
  contents: GitHubContent[];
  path: string;
  isLoading: boolean;
  downloadingFolders: {[key: string]: boolean};
  onNavigateToFolder: (folderPath: string) => void;
  onGoToParent: () => void;
  onFilePreview: (file: GitHubContent) => void;
  onDownloadFile: (file: GitHubContent) => void;
  onDownloadFolder: (folderPath: string, folderName: string) => void;
  onDownloadDirectory: () => void;
  onDownloadRepository: () => void;
  isDownloading: boolean;
}

export function FileList({
  contents,
  path,
  isLoading,
  downloadingFolders,
  onNavigateToFolder,
  onGoToParent,
  onFilePreview,
  onDownloadFile,
  onDownloadFolder,
  onDownloadDirectory,
  onDownloadRepository,
  isDownloading
}: FileListProps) {
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="flex justify-center p-8 animate-pulse">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <Card className="border border-border/40">
      <ScrollArea className="w-full max-h-[500px] bg-card/30">
        {path && (
          <div className="border-b border-border/40 p-2 sticky top-0 bg-card/90 backdrop-blur-sm z-10">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onGoToParent}
              className="h-8 px-2 hover:bg-accent/10 hover:text-accent"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Up to parent directory
            </Button>
          </div>
        )}
        
        {contents.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            This directory is empty
          </div>
        ) : (
          <div className="divide-y divide-border/20">
            {contents
              .sort((a, b) => {
                if (a.type === 'dir' && b.type !== 'dir') return -1;
                if (a.type !== 'dir' && b.type === 'dir') return 1;
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
                    onClick={() => item.type === 'dir' ? onNavigateToFolder(item.path) : undefined}
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
                        onClick={() => onDownloadFolder(item.path, item.name)}
                        disabled={downloadingFolders[item.path]}
                      >
                        {downloadingFolders[item.path] ? (
                          <Loader2 className="h-4 w-4 text-accent animate-spin" />
                        ) : (
                          <Download className="h-4 w-4 text-accent" />
                        )}
                      </Button>
                    )}
                    {item.type === 'file' && !isMobile && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:bg-accent/10"
                        onClick={() => onFilePreview(item)}
                      >
                        <Eye className="h-4 w-4 text-primary" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 hover:bg-accent/10"
                      onClick={() => item.type === 'dir' 
                        ? onNavigateToFolder(item.path)
                        : onDownloadFile(item)
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
            onClick={onDownloadDirectory}
            disabled={isDownloading || !contents}
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
            onClick={onDownloadRepository}
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
  );
}
