
import { formatNumber, formatDate } from '@/utils/gitHubUtils';
import { GitHubRepo } from '@/hooks/useGitHubApi';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, GitFork, Calendar, Users, Code, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Extend the GitHubRepo interface to include optional properties mentioned in errors
interface EnhancedGitHubRepo extends GitHubRepo {
  language?: string;
  topics?: string[];
  watchers_count?: number;
}

interface RepositoryCardProps {
  repo: EnhancedGitHubRepo;
  onBack?: () => void;
}

export function RepositoryCard({ repo, onBack }: RepositoryCardProps) {
  return (
    <Card className="w-full border border-border/40 bg-card animate-fade-in">
      {onBack && (
        <div className="pt-4 px-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="gap-1 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to search
          </Button>
        </div>
      )}
      <CardHeader className={onBack ? "pb-2 pt-2" : "pb-2"}>
        <div className="flex items-center gap-3">
          <img 
            src={repo.owner.avatar_url} 
            alt={`${repo.owner.login} avatar`} 
            className="h-10 w-10 rounded-full border border-border/50 p-0.5 bg-card/50"
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">
              {repo.owner.login}
            </span>
            <CardTitle className="text-xl">
              <a 
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                {repo.name}
              </a>
            </CardTitle>
          </div>
        </div>
        <CardDescription className="line-clamp-2 mt-2">
          {repo.description || "No description available"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-2">
          {repo.language && (
            <Badge variant="outline" className="bg-card border-accent/30 text-accent">
              <Code className="h-3 w-3 mr-1" />
              {repo.language}
            </Badge>
          )}
          {repo.topics?.slice(0, 3).map((topic) => (
            <Badge key={topic} variant="outline" className="bg-card border-primary/30 text-primary">
              {topic}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex-wrap">
        <div className="flex flex-wrap items-center gap-4 text-sm w-full">
          <div className="flex items-center gap-1" title={`${repo.stargazers_count} stars`}>
            <Star className="h-4 w-4 text-accent" />
            <span>{formatNumber(repo.stargazers_count)}</span>
          </div>
          <div className="flex items-center gap-1" title={`${repo.forks_count} forks`}>
            <GitFork className="h-4 w-4 text-primary" />
            <span>{formatNumber(repo.forks_count)}</span>
          </div>
          <div className="flex items-center gap-1" title={`${repo.watchers_count || 0} watchers`}>
            <Users className="h-4 w-4 text-primary" />
            <span>{formatNumber(repo.watchers_count || 0)}</span>
          </div>
          <div className="flex items-center gap-1 ml-auto" title={`Last updated: ${new Date(repo.updated_at).toLocaleDateString()}`}>
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{formatDate(repo.updated_at)}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
