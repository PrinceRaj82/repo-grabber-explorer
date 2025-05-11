
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="border-b sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <Github className="h-6 w-6" />
            <span className="hidden sm:inline-block font-bold text-xl">
              RepoGrabber
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link
            to="/"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            About
          </Link>
          <Link
            to="/guide"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Guide
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            asChild
            className="hidden md:flex"
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
            className="md:hidden"
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
