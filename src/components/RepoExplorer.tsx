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
    const [username, setUsername] = useState("");
    const [repoName, setRepoName] = useState("");
    const debouncedUsername = useDebounce(username, 500);
    const debouncedRepoName = useDebounce(repoName, 500);
    const [isFocused, setIsFocused] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    const {
      data: searchResults,
      isLoading,
      isError,
      error,
    } = useQuery({
      queryKey: ["searchRepo", debouncedUsername, debouncedRepoName],
      queryFn: () => searchRepo(debouncedUsername, debouncedRepoName),
      enabled: !!debouncedUsername && !!debouncedRepoName,
    });

    useEffect(() => {
      if (onSearch) {
        onSearch(!!searchResults?.length);
      }
    }, [searchResults, onSearch]);

    const handleClear = () => {
      setUsername("");
      setRepoName("");
      if (onSearch) {
        onSearch(false);
      }
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setUsername(e.target.value);
    };

    const handleRepoNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setRepoName(e.target.value);
    };

    return (
      <div className="relative">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="GitHub Username"
            value={username}
            onChange={handleUsernameChange}
            className="shadow-sm search-input"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            ref={inputRef}
          />
          <Input
            type="text"
            placeholder="Repository Name"
            value={repoName}
            onChange={handleRepoNameChange}
            className="shadow-sm search-input"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <Button
            type="button"
            onClick={handleClear}
            variant="secondary"
            size="icon"
            className="shrink-0"
            disabled={!username && !repoName}
          >
            {username || repoName ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
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
