
import { Link, useLocation } from "react-router-dom";
import { Github, ExternalLink } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const location = useLocation();
  
  return (
    <footer className="border-t border-border/30 py-6 bg-card/30 backdrop-blur-sm">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
          <p className="text-sm text-muted-foreground">
            © {year} RepoGrabber. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Created by</span>
            <a 
              href="https://rajkumarprince.me" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary hover:text-accent transition-colors"
            >
              Rajkumar Prince
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-4 text-sm">
          <Link
            to="/"
            className={`transition-colors hover:text-accent ${
              location.pathname === '/' ? 'text-accent' : 'text-muted-foreground'
            }`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`transition-colors hover:text-accent ${
              location.pathname === '/about' ? 'text-accent' : 'text-muted-foreground'
            }`}
          >
            About
          </Link>
          <Link
            to="/guide"
            className={`transition-colors hover:text-accent ${
              location.pathname === '/guide' ? 'text-accent' : 'text-muted-foreground'
            }`}
          >
            Guide
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-muted-foreground hover:text-accent transition-colors"
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
          </a>
        </nav>
      </div>
    </footer>
  );
}
