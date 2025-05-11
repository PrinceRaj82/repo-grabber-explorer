
import { RepoExplorer } from "@/components/RepoExplorer";
import { RecentDownloads } from "@/components/RecentDownloads";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Download, Github, FileCode } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

export default function Index() {
  const [hasSearched, setHasSearched] = useState(false);
  const { theme } = useTheme();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onSearchStateChange={setHasSearched} />
      <main className="flex-1">
        <section 
          className={cn(
            "transition-all duration-300 ease-in-out",
            hasSearched 
              ? "py-6 md:py-8" 
              : "py-12 md:py-24 lg:py-32 xl:py-36"
          )}
        >
          <div className="container px-4 md:px-6">
            <div 
              className={cn(
                "grid gap-6 transition-all duration-300",
                hasSearched 
                  ? "lg:grid-cols-[1fr_400px] lg:gap-8 xl:grid-cols-[1fr_500px]" 
                  : "lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]"
              )}
            >
              <div 
                className={cn(
                  "flex flex-col justify-center space-y-4 transition-all duration-300", 
                  hasSearched && "lg:hidden"
                )}
              >
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Download GitHub Code with Ease
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Easily download any public GitHub repository, folder, or file without using Git or command line tools
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="gap-1 bg-primary hover:bg-primary/90">
                    <Download className="h-4 w-4" />
                    Get Started
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/guide" className="gap-1">
                      <FileCode className="h-4 w-4" />
                      Learn How It Works
                    </Link>
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="inline-block w-4 h-4 rounded-full bg-accent" />
                    <span className="text-muted-foreground">No authentication required</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="inline-block w-4 h-4 rounded-full bg-accent" />
                    <span className="text-muted-foreground">100% free & open source</span>
                  </div>
                </div>
              </div>
              <RepoExplorer onSearch={(hasResults) => setHasSearched(!!hasResults)} />
            </div>
          </div>
        </section>

        <section 
          className={cn(
            "transition-all duration-300 ease-in-out",
            hasSearched ? "py-4 md:py-6 bg-card/50" : "py-8 md:py-12 lg:py-16 bg-card/50"
          )}
        >
          <div className="container px-4 md:px-6">
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tighter">
                  Recent Downloads
                </h2>
                <p className="text-muted-foreground">
                  Your download history is saved locally for easy access
                </p>
              </div>
              <div className="mx-auto max-w-3xl">
                <RecentDownloads />
              </div>
            </div>
          </div>
        </section>

        <section 
          className={cn(
            "transition-all duration-300 bg-background",
            hasSearched ? "hidden" : "py-12 md:py-24 lg:py-32"
          )}
        >
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-accent/10 px-3 py-1 text-sm text-accent font-medium">
                  Simple & Powerful
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Everything you need to explore GitHub repositories
                </h2>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  RepoGrabber makes it easy to browse and download code from GitHub without
                  any technical knowledge or special tools.
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex flex-col items-center gap-2 rounded-lg border border-border/40 bg-card p-4 text-center hover-scale">
                  <div className="rounded-full bg-accent/10 p-2">
                    <Github className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold">Repository Downloads</h3>
                  <p className="text-sm text-muted-foreground">
                    Download complete repositories with a single click
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2 rounded-lg border border-border/40 bg-card p-4 text-center hover-scale">
                  <div className="rounded-full bg-accent/10 p-2">
                    <FolderIcon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold">Folder Downloads</h3>
                  <p className="text-sm text-muted-foreground">
                    Download specific folders as ZIP archives
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2 rounded-lg border border-border/40 bg-card p-4 text-center hover-scale">
                  <div className="rounded-full bg-accent/10 p-2">
                    <FileIcon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold">File Downloads</h3>
                  <p className="text-sm text-muted-foreground">
                    Download individual files directly to your device
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2 rounded-lg border border-border/40 bg-card p-4 text-center hover-scale">
                  <div className="rounded-full bg-accent/10 p-2">
                    <History className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold">Download History</h3>
                  <p className="text-sm text-muted-foreground">
                    Track your recent downloads for easy access
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

// Import missing icons
import { FolderIcon, FileIcon, History } from "lucide-react";
