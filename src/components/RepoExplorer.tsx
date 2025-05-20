
import { useState, useEffect, useRef, forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
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
    const [url, setUrl] = useState("");
    const debouncedUrl = useDebounce(url, 500);
    const [isFocused, setIsFocused] = useState(false);
    
    // Extract username and repo from URL
    const extractRepoInfo = (githubUrl: string) => {
      try {
        const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
        const matches = githubUrl.match(regex);
        
        if (matches && matches.length >= 3) {
          return {
            username: matches[1],
            repoName: matches[2]
          };
        }
        return { username: "", repoName: "" };
      } catch (error) {
        console.error("Error parsing GitHub URL:", error);
        return { username: "", repoName: "" };
      }
    };
    
    const { username, repoName } = extractRepoInfo(debouncedUrl);
    
    const inputRef = useRef<HTMLInputElement>(null);

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
      setUrl("");
      if (onSearch) {
        onSearch(false);
      }
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setUrl(e.target.value);
    };
    
    const handleExplore = () => {
      // This function will be called when the Explore button is clicked
      // You can add additional functionality here if needed
      console.log("Exploring URL:", url);
    };

    return (
      <div className="relative space-y-4">
        <div className="flex flex-col space-y-3">
          <Input
            type="text"
            placeholder="Enter GitHub URL (e.g., https://github.com/user/repo)"
            value={url}
            onChange={handleUrlChange}
            className="w-full bg-background/90 px-4 py-3 h-12 rounded-lg shadow-sm search-input text-foreground"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            ref={inputRef}
          />
          <Button
            type="button"
            onClick={handleExplore}
            className="w-full bg-primary text-white hover:bg-primary/90 h-12 flex items-center justify-center gap-2 transition-all duration-300 rounded-lg"
          >
            <Search className="h-5 w-5" />
            Explore
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
