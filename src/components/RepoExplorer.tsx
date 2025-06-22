
import { useState, useEffect, useCallback, useRef, forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { useQuery } from "@tanstack/react-query";
import { searchRepo } from "@/lib/github";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface RepoExplorerProps {
  onSearch?: (hasResults: boolean) => void;
}

const RepoExplorer = forwardRef<HTMLInputElement, RepoExplorerProps>(
  ({ onSearch }, ref) => {
    const [repoUrl, setRepoUrl] = useState("");
    const debouncedRepoUrl = useDebounce(repoUrl, 500);
    const [isFocused, setIsFocused] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    // Extract username and repo from GitHub URL
    const parseGitHubUrl = (url: string) => {
      if (!url) return { username: '', repoName: '' };
      
      // Handle different GitHub URL formats
      const patterns = [
        /github\.com\/([^\/]+)\/([^\/]+)/,
        /^([^\/]+)\/([^\/]+)$/
      ];
      
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
          return {
            username: match[1],
            repoName: match[2].replace(/\.git$/, '')
          };
        }
      }
      
      return { username: '', repoName: '' };
    };

    const { username, repoName } = parseGitHubUrl(debouncedRepoUrl);

    const {
      data: searchResults,
      isLoading,
      isError,
      error,
    } = useQuery({
      queryKey: ["searchRepo", username, repoName],
      queryFn: () => searchRepo(username, repoName),
      enabled: !!username && !!repoName,
    });

    useEffect(() => {
      if (onSearch) {
        onSearch(!!searchResults?.length);
      }
    }, [searchResults, onSearch]);

    const handleClear = () => {
      setRepoUrl("");
      if (onSearch) {
        onSearch(false);
      }
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setRepoUrl(e.target.value);
    };

    return (
      <div className="relative">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Enter GitHub repository URL or username/repo"
            value={repoUrl}
            onChange={handleUrlChange}
            className="shadow-sm search-input"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            ref={inputRef}
          />
          <Button
            type="button"
            onClick={handleClear}
            variant="secondary"
            size="icon"
            className="shrink-0"
            disabled={!repoUrl}
          >
            {repoUrl ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>

        {isLoading && (
          <div className="mt-4 space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        )}

        {isError && (
          <div className="mt-4 text-sm text-red-500">
            Error: {(error as Error).message}
          </div>
        )}

        {searchResults?.length > 0 && (
          <Accordion type="single" collapsible className="mt-4">
            {searchResults.map((result) => (
              <AccordionItem key={result.path} value={result.path}>
                <AccordionTrigger className="font-bold">{result.path}</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-none pl-4 space-y-2">
                    <li>
                      <Link
                        to={`/download?repo=${username}/${repoName}&path=${result.path}`}
                        className="text-primary hover:underline"
                      >
                        Download File
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`/view?repo=${username}/${repoName}&path=${result.path}`}
                        className="text-primary hover:underline"
                      >
                        View File
                      </Link>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    );
  }
);

RepoExplorer.displayName = "RepoExplorer";

export { RepoExplorer };
