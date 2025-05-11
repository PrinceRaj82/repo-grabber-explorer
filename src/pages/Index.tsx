
import { RepoExplorer } from "@/components/RepoExplorer";
import { RecentDownloads } from "@/components/RecentDownloads";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Download, Github } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32 xl:py-36 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Download GitHub Code with Ease
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Easily download any public GitHub repository, folder, or file without using Git or command line tools
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="gap-1">
                    <Download className="h-4 w-4" />
                    Get Started
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/guide" className="gap-1">
                      <Github className="h-4 w-4" />
                      Learn How It Works
                    </Link>
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <svg
                      className="h-4 w-4 fill-primary"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.4 7.4-6-4.6-6 4.6 2.4-7.4-6-4.6h7.6z"></path>
                    </svg>
                    <span className="text-muted-foreground">No authentication required</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg
                      className="h-4 w-4 fill-primary"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.4 7.4-6-4.6-6 4.6 2.4-7.4-6-4.6h7.6z"></path>
                    </svg>
                    <span className="text-muted-foreground">100% free & open source</span>
                  </div>
                </div>
              </div>
              <RepoExplorer />
            </div>
          </div>
        </section>

        <section className="py-8 md:py-12 lg:py-16 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
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

        <section className="py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
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
                <div className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Github className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold">Repository Downloads</h3>
                  <p className="text-sm text-muted-foreground">
                    Download complete repositories with a single click
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center">
                  <div className="rounded-full bg-primary/10 p-2">
                    <FolderIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold">Folder Downloads</h3>
                  <p className="text-sm text-muted-foreground">
                    Download specific folders as ZIP archives
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center">
                  <div className="rounded-full bg-primary/10 p-2">
                    <FileIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold">File Downloads</h3>
                  <p className="text-sm text-muted-foreground">
                    Download individual files directly to your device
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center">
                  <div className="rounded-full bg-primary/10 p-2">
                    <History className="h-6 w-6 text-primary" />
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
