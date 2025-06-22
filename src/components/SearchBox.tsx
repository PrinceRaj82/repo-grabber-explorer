
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Search, Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SearchBoxProps {
  url: string;
  onUrlChange: (url: string) => void;
  onExplore: () => void;
  isLoading: boolean;
  error?: string;
  showCard?: boolean;
}

export function SearchBox({ 
  url, 
  onUrlChange, 
  onExplore, 
  isLoading, 
  error, 
  showCard = true 
}: SearchBoxProps) {
  const isMobile = useIsMobile();

  const SearchContent = () => (
    <div className="search-container p-0 sm:p-4 animate-fade-in">
      <div className="flex flex-col gap-2">
        <Input
          type="text"
          placeholder="Enter GitHub URL (e.g., https://github.com/user/repo)"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          className="search-input flex-grow text-base"
          style={{ fontSize: isMobile ? '16px' : '14px' }}
        />
        <Button 
          onClick={onExplore} 
          disabled={!url || isLoading}
          className="search-button w-full sm:w-auto py-6 sm:py-4"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Explore
            </>
          )}
        </Button>
      </div>
      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md mt-4">
          {error}
        </div>
      )}
    </div>
  );

  if (!showCard) {
    return <SearchContent />;
  }

  return (
    <Card className="border border-border/40 backdrop-blur-sm animate-fade-in hover-scale max-w-2xl mx-auto">
      <CardHeader className="pb-3">
        <SearchContent />
      </CardHeader>
      <CardContent>
        {/* Content handled by error display in SearchContent */}
      </CardContent>
    </Card>
  );
}
