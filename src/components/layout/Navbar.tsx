
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Github, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NavbarProps {
  onSearchStateChange?: (hasSearched: boolean) => void;
}

export function Navbar({ onSearchStateChange }: NavbarProps) {
  const location = useLocation();
  
  return (
    <header className="border-b border-border/30 sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <Github className="h-6 w-6 text-accent" />
            <span className="hidden sm:inline-block font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              RepoGrabber
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link
            to="/"
            className={`transition-colors hover:text-accent ${
              location.pathname === '/' ? 'text-accent font-medium' : 'text-foreground/80'
            }`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`transition-colors hover:text-accent ${
              location.pathname === '/about' ? 'text-accent font-medium' : 'text-foreground/80'
            }`}
          >
            About
          </Link>
          <Link
            to="/guide"
            className={`transition-colors hover:text-accent ${
              location.pathname === '/guide' ? 'text-accent font-medium' : 'text-foreground/80'
            }`}
          >
            Guide
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a 
                  href="https://rajkumarprince.me" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-foreground/80 hover:text-accent transition-colors"
                >
                  <Avatar className="h-8 w-8 border border-border/50">
                    <AvatarFallback className="bg-accent/10 text-accent">RP</AvatarFallback>
                    <AvatarImage src="https://github.com/rajkumarprince.png" alt="Rajkumar Prince" />
                  </Avatar>
                  <span className="hidden md:inline-flex items-center gap-1">
                    <span>Created by Rajkumar Prince</span>
                    <ExternalLink className="h-3 w-3" />
                  </span>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>Visit Creator's Website</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="hidden md:flex border-border/50 hover:bg-accent/20 hover:text-accent"
          >
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="gap-1"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
          </Button>
          <Button
            variant="outline"
            size="icon"
            asChild
            className="md:hidden border-border/50"
          >
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
