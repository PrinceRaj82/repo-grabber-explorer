
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Github } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface BreadcrumbsProps {
  breadcrumbs: BreadcrumbItem[];
  onNavigate: (path: string) => void;
}

export function Breadcrumbs({ breadcrumbs, onNavigate }: BreadcrumbsProps) {
  if (breadcrumbs.length === 0) return null;

  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border border-border/30 rounded-md pb-1">
      <ScrollArea className="w-full py-1 px-2">
        <div className="flex items-center flex-nowrap gap-1 text-sm">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 whitespace-nowrap flex-shrink-0 hover:bg-accent/10 hover:text-accent"
            onClick={() => onNavigate('')}
          >
            <Github className="h-4 w-4 mr-1 text-accent" />
            <span>Root</span>
          </Button>
          
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.path} className="flex items-center flex-shrink-0">
              <span className="mx-1 text-muted-foreground">/</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 whitespace-nowrap hover:bg-accent/10 hover:text-accent"
                onClick={() => onNavigate(crumb.path)}
              >
                {crumb.name}
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
