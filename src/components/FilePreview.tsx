
import { useState, useEffect } from 'react';
import { GitHubContent } from '@/hooks/useGitHubApi';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Download, ExternalLink } from 'lucide-react';
import { getFileExtension, isBinaryFile } from '@/utils/gitHubUtils';
import { cn } from '@/lib/utils';

interface FilePreviewProps {
  file: GitHubContent;
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
}

export function FilePreview({ file, isOpen, onClose, onDownload }: FilePreviewProps) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && file.download_url) {
      fetchFileContent();
    }
  }, [isOpen, file.download_url]);

  const fetchFileContent = async () => {
    if (!file.download_url) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const extension = getFileExtension(file.name);
      
      if (isBinaryFile(extension)) {
        setContent('Binary file - Preview not available');
        setLoading(false);
        return;
      }

      const response = await fetch(file.download_url);
      if (!response.ok) {
        throw new Error('Failed to fetch file content');
      }
      
      const text = await response.text();
      setContent(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load file');
    } finally {
      setLoading(false);
    }
  };

  const getLanguageFromExtension = (filename: string): string => {
    const ext = getFileExtension(filename);
    const languageMap: { [key: string]: string } = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'cs': 'csharp',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'json': 'json',
      'xml': 'xml',
      'md': 'markdown',
      'yml': 'yaml',
      'yaml': 'yaml',
      'sh': 'bash',
      'sql': 'sql'
    };
    
    return languageMap[ext] || 'text';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 hidden lg:flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl h-[80vh] flex flex-col border border-border/40">
        <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b border-border/20">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-mono text-sm truncate">{file.name}</span>
            <span className="text-xs text-muted-foreground">
              ({Math.round(file.size / 1024)}KB)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onDownload}
              className="h-8 px-2"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-8 px-2"
            >
              <a href={file.html_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 px-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-muted-foreground">Loading file content...</div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-destructive">{error}</div>
              </div>
            ) : (
              <pre className={cn(
                "p-4 text-sm font-mono whitespace-pre-wrap break-words",
                "text-foreground bg-background"
              )}>
                <code className={`language-${getLanguageFromExtension(file.name)}`}>
                  {content}
                </code>
              </pre>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
