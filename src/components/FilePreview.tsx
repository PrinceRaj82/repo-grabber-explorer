
import { useState, useEffect } from 'react';
import { GitHubContent } from '@/hooks/useGitHubApi';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Download, ExternalLink, FileImage, FileVideo, FileAudio, FileText } from 'lucide-react';
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
      
      const response = await fetch(file.download_url);
      if (!response.ok) {
        throw new Error('Failed to fetch file content');
      }
      
      if (isBinaryFile(extension)) {
        // For binary files, we'll show a preview based on file type
        setContent('');
      } else {
        const text = await response.text();
        setContent(text);
      }
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

  const getFileTypeIcon = (filename: string) => {
    const ext = getFileExtension(filename).toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico'].includes(ext)) {
      return <FileImage className="h-8 w-8 text-blue-500" />;
    }
    if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'].includes(ext)) {
      return <FileVideo className="h-8 w-8 text-purple-500" />;
    }
    if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma'].includes(ext)) {
      return <FileAudio className="h-8 w-8 text-green-500" />;
    }
    return <FileText className="h-8 w-8 text-gray-500" />;
  };

  const isImageFile = (filename: string) => {
    const ext = getFileExtension(filename).toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico'].includes(ext);
  };

  const isVideoFile = (filename: string) => {
    const ext = getFileExtension(filename).toLowerCase();
    return ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'].includes(ext);
  };

  const isAudioFile = (filename: string) => {
    const ext = getFileExtension(filename).toLowerCase();
    return ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma'].includes(ext);
  };

  const renderBinaryPreview = () => {
    if (isImageFile(file.name)) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-4">
          <img 
            src={file.download_url!} 
            alt={file.name}
            className="max-w-full max-h-96 object-contain rounded-md shadow-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              setError('Failed to load image preview');
            }}
          />
          <p className="text-sm text-muted-foreground mt-2">{file.name}</p>
        </div>
      );
    }

    if (isVideoFile(file.name)) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-4">
          <video 
            src={file.download_url!} 
            controls
            className="max-w-full max-h-96 rounded-md shadow-lg"
            onError={() => setError('Failed to load video preview')}
          >
            Your browser does not support the video tag.
          </video>
          <p className="text-sm text-muted-foreground mt-2">{file.name}</p>
        </div>
      );
    }

    if (isAudioFile(file.name)) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-4">
          <div className="bg-muted/20 p-8 rounded-lg">
            {getFileTypeIcon(file.name)}
          </div>
          <audio 
            src={file.download_url!} 
            controls
            className="mt-4"
            onError={() => setError('Failed to load audio preview')}
          >
            Your browser does not support the audio tag.
          </audio>
          <p className="text-sm text-muted-foreground mt-2">{file.name}</p>
        </div>
      );
    }

    // For other binary files, show file info
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="bg-muted/20 p-8 rounded-lg mb-4">
          {getFileTypeIcon(file.name)}
        </div>
        <h3 className="font-medium text-lg mb-2">{file.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Binary file ({Math.round(file.size / 1024)}KB)
        </p>
        <p className="text-sm text-muted-foreground text-center">
          This file type cannot be previewed as text. Click download to save the file.
        </p>
      </div>
    );
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
            ) : isBinaryFile(getFileExtension(file.name)) ? (
              renderBinaryPreview()
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
