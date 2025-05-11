
import { formatNumber, formatDate } from '@/utils/gitHubUtils';
import { GitHubRepo } from '@/hooks/useGitHubApi';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, GitFork, Calendar } from 'lucide-react';

interface RepositoryCardProps {
  repo: GitHubRepo;
}

export function RepositoryCard({ repo }: RepositoryCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <img 
            src={repo.owner.avatar_url} 
            alt={`${repo.owner.login} avatar`} 
            className="h-6 w-6 rounded-full"
          />
          <span className="text-sm font-medium text-muted-foreground">
            {repo.owner.login}
          </span>
        </div>
        <CardTitle className="text-xl mt-1">
          <a 
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {repo.name}
          </a>
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {repo.description || "No description available"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-1" title={`${repo.stargazers_count} stars`}>
            <Star className="h-4 w-4 text-yellow-400" />
            <span>{formatNumber(repo.stargazers_count)}</span>
          </div>
          <div className="flex items-center gap-1" title={`${repo.forks_count} forks`}>
            <GitFork className="h-4 w-4 text-blue-400" />
            <span>{formatNumber(repo.forks_count)}</span>
          </div>
          <div className="flex items-center gap-1" title={`Last updated: ${new Date(repo.updated_at).toLocaleDateString()}`}>
            <Calendar className="h-4 w-4 text-green-400" />
            <span>{formatDate(repo.updated_at)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
