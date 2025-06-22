
import { RepoExplorer } from "@/components/RepoExplorer";
import { RecentDownloads } from "@/components/RecentDownloads";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Download, Github, FileCode, FolderIcon, FileIcon, History } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { FAQ } from "@/components/FAQ";

export default function Index() {
  const [hasSearched, setHasSearched] = useState(false);
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onSearchStateChange={setHasSearched} />
      <main className="flex-1" role="main">
        {/* Hero Section */}
        <section 
          className={cn(
            "transition-all duration-300 ease-in-out px-4 md:px-6 flex flex-col items-center justify-center",
            hasSearched 
              ? "py-4 md:py-8" 
              : "py-12 md:py-20 lg:py-28"
          )}
          style={{
            background: theme === 'dark' ? '#0c1222' : undefined,
            minHeight: hasSearched ? 'auto' : '60vh'
          }}
          aria-label="Hero section with GitHub downloader"
        >
          <div className="container max-w-7xl">
            <div 
              className={cn(
                "grid gap-6 transition-all duration-300",
                hasSearched 
                  ? "grid-cols-1 max-w-3xl mx-auto" 
                  : "grid-cols-1 text-center"
              )}
            >
              <header 
                className={cn(
                  "flex flex-col items-center justify-center space-y-6 transition-all duration-300", 
                  hasSearched && "hidden"
                )}
              >
                <div className="space-y-4 max-w-3xl mx-auto">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-gradient-to-r from-blue-500 to-amber-400 bg-clip-text text-transparent">
                    Download GitHub Code with Ease
                  </h1>
                  <p className="text-muted-foreground md:text-xl max-w-2xl mx-auto">
                    Easily download any public GitHub repository, folder, or file without using Git or command line tools. 
                    Perfect for developers, students, and code enthusiasts.
                  </p>
                </div>
                <nav className="flex flex-col sm:flex-row gap-3 justify-center" aria-label="Main actions">
                  <Button size="lg" className="gap-1 bg-primary hover:bg-primary/90 hover-lift" aria-label="Start downloading GitHub repositories">
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Get Started
                  </Button>
                  <Button size="lg" variant="outline" asChild className="hover-lift">
                    <Link to="/guide" className="gap-1" aria-label="Learn how RepoGrabber works">
                      <FileCode className="h-4 w-4" aria-hidden="true" />
                      Learn How It Works
                    </Link>
                  </Button>
                </nav>
                <div className="flex flex-wrap justify-center gap-6 text-sm mt-4" role="list" aria-label="Key features">
                  <div className="flex items-center gap-2" role="listitem">
                    <span className="inline-block w-4 h-4 rounded-full bg-accent" aria-hidden="true" />
                    <span className="text-muted-foreground">No authentication required</span>
                  </div>
                  <div className="flex items-center gap-2" role="listitem">
                    <span className="inline-block w-4 h-4 rounded-full bg-accent" aria-hidden="true" />
                    <span className="text-muted-foreground">100% free & open source</span>
                  </div>
                </div>
              </header>
              <div className={cn(
                "transition-all duration-300 max-w-3xl mx-auto w-full",
                !hasSearched && "mt-8 bg-card/30 p-4 sm:p-6 rounded-xl border border-border/20 shadow-lg"
              )}>
                <RepoExplorer onSearch={(hasResults) => setHasSearched(!!hasResults)} />
              </div>
            </div>
          </div>
        </section>

        {/* Recent Downloads Section */}
        <section 
          className={cn(
            "transition-all duration-300 ease-in-out px-4 md:px-0",
            hasSearched ? "py-4 md:py-6 bg-card/50" : "py-8 md:py-12 lg:py-16 bg-card/50"
          )}
          aria-labelledby="recent-downloads-heading"
        >
          <div className="container px-4 md:px-6 max-w-7xl">
            <div className="space-y-6">
              <header className="space-y-2 text-center">
                <h2 id="recent-downloads-heading" className="text-2xl md:text-3xl font-bold tracking-tighter">
                  Recent Downloads
                </h2>
                <p className="text-muted-foreground">
                  Your download history is saved locally for easy access
                </p>
              </header>
              <div className="mx-auto max-w-3xl">
                <RecentDownloads />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section 
          className={cn(
            "transition-all duration-300 bg-background px-4 md:px-0",
            hasSearched ? "hidden" : "py-8 md:py-16 lg:py-24"
          )}
          aria-labelledby="features-heading"
        >
          <div className="container px-4 md:px-6 max-w-7xl">
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-6 md:py-12 lg:grid-cols-2 lg:gap-12">
              <header className="space-y-4">
                <div className="inline-block rounded-lg bg-accent/10 px-3 py-1 text-sm text-accent font-medium">
                  Simple & Powerful
                </div>
                <h2 id="features-heading" className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Everything you need to explore GitHub repositories
                </h2>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  RepoGrabber makes it easy to browse and download code from GitHub without
                  any technical knowledge or special tools. Perfect for developers, students, and anyone working with code.
                </p>
              </header>
              <div className="grid gap-6 md:grid-cols-2" role="list" aria-label="Feature list">
                <article className="flex flex-col items-center gap-2 rounded-lg border border-border/40 bg-card p-4 text-center hover-scale shadow-sm" role="listitem">
                  <div className="rounded-full bg-accent/10 p-2" aria-hidden="true">
                    <Github className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold">Repository Downloads</h3>
                  <p className="text-sm text-muted-foreground">
                    Download complete repositories with a single click. Perfect for code exploration and learning.
                  </p>
                </article>
                <article className="flex flex-col items-center gap-2 rounded-lg border border-border/40 bg-card p-4 text-center hover-scale shadow-sm" role="listitem">
                  <div className="rounded-full bg-accent/10 p-2" aria-hidden="true">
                    <FolderIcon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold">Folder Downloads</h3>
                  <p className="text-sm text-muted-foreground">
                    Download specific folders as ZIP archives. Get only what you need from large projects.
                  </p>
                </article>
                <article className="flex flex-col items-center gap-2 rounded-lg border border-border/40 bg-card p-4 text-center hover-scale shadow-sm" role="listitem">
                  <div className="rounded-full bg-accent/10 p-2" aria-hidden="true">
                    <FileIcon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold">File Downloads</h3>
                  <p className="text-sm text-muted-foreground">
                    Download individual files directly to your device. No need to clone entire repositories.
                  </p>
                </article>
                <article className="flex flex-col items-center gap-2 rounded-lg border border-border/40 bg-card p-4 text-center hover-scale shadow-sm" role="listitem">
                  <div className="rounded-full bg-accent/10 p-2" aria-hidden="true">
                    <History className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold">Download History</h3>
                  <p className="text-sm text-muted-foreground">
                    Track your recent downloads for easy access. Never lose track of useful repositories.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section 
          className={cn(
            "transition-all duration-300 px-4 md:px-0 py-8 md:py-16 lg:py-24",
            hasSearched ? "hidden" : "bg-card/30"
          )}
          aria-labelledby="faq-heading"
        >
          <div className="container px-4 md:px-6 max-w-4xl mx-auto">
            <header className="text-center space-y-4 mb-8">
              <h2 id="faq-heading" className="text-3xl font-bold tracking-tighter">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">Common questions about using RepoGrabber for GitHub downloads</p>
            </header>
            <FAQ />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
