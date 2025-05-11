
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Github, Download, FileIcon, FolderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter">About RepoGrabber</h1>
            <p className="text-xl text-muted-foreground">
              A simple tool for downloading GitHub repositories, folders, and files
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>What is RepoGrabber?</CardTitle>
              <CardDescription>
                Your one-stop solution for easily downloading GitHub content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                RepoGrabber is a lightweight, frontend-only tool designed to make
                downloading GitHub content easier for everyone. Whether you need to
                grab an entire repository, a specific folder, or just a single file,
                RepoGrabber simplifies the process without requiring any authentication
                or complex setup.
              </p>
              
              <p>
                Built with simplicity in mind, RepoGrabber provides an intuitive interface
                that works across all devices. Just paste a GitHub URL, navigate through the
                repository structure, and download what you need with a single click.
              </p>
              
              <div className="flex flex-wrap gap-3 mt-4">
                <Button asChild>
                  <Link to="/" className="gap-2">
                    <Download className="h-4 w-4" />
                    Try It Now
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/guide" className="gap-2">
                    <FileIcon className="h-4 w-4" />
                    View Guide
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="space-y-1">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Github className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-xl">Repository Downloads</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Download entire repositories with a single click. Perfect for getting started
                  with new projects or studying codebases.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="space-y-1">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <FolderIcon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-xl">Folder Downloads</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Only interested in specific parts of a project? Navigate to any folder
                  and download just what you need, compressed into a convenient zip file.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="space-y-1">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <FileIcon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-xl">File Downloads</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Need just a single file? RepoGrabber makes it easy to download individual
                  files without having to clone the entire repository.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                RepoGrabber uses the GitHub REST API to fetch repository information and
                content. It's entirely frontend-based, running in your browser without
                requiring a backend server. This makes it fast, secure, and easy to use.
              </p>
              
              <p>
                For repositories and large folders, RepoGrabber leverages GitHub's native
                zip download functionality. For individual files and smaller folders, it
                fetches and packages content on-demand using JSZip.
              </p>
              
              <p>
                Your recent downloads are stored locally in your browser using localStorage,
                making it easy to access your frequently used repositories without having to
                search for them again.
              </p>
              
              <div className="flex justify-center mt-4">
                <Button asChild variant="outline">
                  <Link to="/guide" className="gap-2">
                    <FileIcon className="h-4 w-4" />
                    Read the Full Guide
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Why Use RepoGrabber?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <Download className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">No Git Required</h3>
                    <p className="text-sm text-muted-foreground">
                      Download repositories without installing Git or learning Git commands
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <Download className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Selective Downloads</h3>
                    <p className="text-sm text-muted-foreground">
                      Only download the parts of a repository you actually need
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <Download className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">No Authentication</h3>
                    <p className="text-sm text-muted-foreground">
                      Access public repositories without creating a GitHub account
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <Download className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Mobile Friendly</h3>
                    <p className="text-sm text-muted-foreground">
                      Download GitHub content from any device, including smartphones and tablets
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-6">
                <Button asChild>
                  <Link to="/" className="gap-2">
                    <Download className="h-4 w-4" />
                    Start Using RepoGrabber Now
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
