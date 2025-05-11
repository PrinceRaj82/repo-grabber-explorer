
import { Link } from "react-router-dom";

export function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
        <p className="text-sm text-muted-foreground">
          © {year} RepoGrabber. All rights reserved.
        </p>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            to="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
          <Link
            to="/guide"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Guide
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
