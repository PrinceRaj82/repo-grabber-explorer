
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Github, FileIcon, FolderIcon, Download } from "lucide-react";

export default function Guide() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter">User Guide</h1>
            <p className="text-xl text-muted-foreground">
              Learn how to use RepoGrabber efficiently
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Getting Started</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-medium flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm">1</span>
                  Find a GitHub Repository
                </h3>
                <div className="pl-8 space-y-3">
                  <p className="text-muted-foreground">
                    Start by finding the GitHub repository, folder, or file you want to download.
                    You'll need the URL from your browser's address bar.
                  </p>
                  <div className="border rounded-md overflow-hidden">
                    <div className="bg-muted/50 p-2 border-b text-sm font-medium">
                      Example URLs
                    </div>
                    <div className="p-3 space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Github className="h-4 w-4" />
                        <span className="font-mono bg-muted/50 px-2 py-1 rounded text-xs">
                          https://github.com/username/repository
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FolderIcon className="h-4 w-4" />
                        <span className="font-mono bg-muted/50 px-2 py-1 rounded text-xs">
                          https://github.com/username/repository/tree/main/folder
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileIcon className="h-4 w-4" />
                        <span className="font-mono bg-muted/50 px-2 py-1 rounded text-xs">
                          https://github.com/username/repository/blob/main/file.txt
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-xl font-medium flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm">2</span>
                  Enter the URL
                </h3>
                <div className="pl-8 space-y-3">
                  <p className="text-muted-foreground">
                    Paste the URL into the input field on the RepoGrabber homepage and click "Explore".
                  </p>
                  <div className="border rounded-md overflow-hidden">
                    <div className="p-3">
                      <div className="border rounded-md flex">
                        <div className="flex-1 p-2 text-sm text-muted-foreground border-r">https://github.com/username/repository</div>
                        <div className="p-2 bg-primary text-primary-foreground font-medium text-sm">Explore</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    RepoGrabber will automatically detect if you're trying to access a repository, folder, or file
                    and show you the appropriate content.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-xl font-medium flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm">3</span>
                  Navigate and Download
                </h3>
                <div className="pl-8 space-y-3">
                  <p className="text-muted-foreground">
                    Once the repository content is loaded, you can:
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <ArrowRight className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Download the entire repository</p>
                        <p className="text-sm text-muted-foreground">
                          Use the "Download entire repository" button at the bottom of the page.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <ArrowRight className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Navigate through folders</p>
                        <p className="text-sm text-muted-foreground">
                          Click on folder names or icons to navigate into directories.
                          Use the breadcrumbs or "Up to parent directory" button to navigate back.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <ArrowRight className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Download a specific folder</p>
                        <p className="text-sm text-muted-foreground">
                          Navigate to the folder and use the "Download this directory" button.
                          The folder will be downloaded as a ZIP file.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <ArrowRight className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Download individual files</p>
                        <p className="text-sm text-muted-foreground">
                          Click the download icon next to any file to download it directly.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Recent Downloads</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                RepoGrabber keeps track of your recent downloads to make it easy to access
                repositories you've previously downloaded.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <Download className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Accessing Recent Downloads</h3>
                    <p className="text-sm text-muted-foreground">
                      Your recent downloads are displayed on the homepage. Click on any item
                      to go directly to that repository, folder, or file.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <Download className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Managing Your History</h3>
                    <p className="text-sm text-muted-foreground">
                      You can remove individual items from your history or clear the entire
                      history using the buttons provided in the Recent Downloads section.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Tips and Tricks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <ArrowRight className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Direct Access</h3>
                    <p className="text-sm text-muted-foreground">
                      You can directly paste folder or file URLs from GitHub to jump straight
                      to that location within RepoGrabber.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <ArrowRight className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Dark Mode</h3>
                    <p className="text-sm text-muted-foreground">
                      Toggle between light and dark mode using the theme button in the top
                      navigation bar to reduce eye strain.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <ArrowRight className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Mobile Usage</h3>
                    <p className="text-sm text-muted-foreground">
                      RepoGrabber is fully responsive and works on mobile devices, making it
                      easy to download GitHub content on the go.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <ArrowRight className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">API Rate Limits</h3>
                    <p className="text-sm text-muted-foreground">
                      GitHub's API has rate limits for unauthenticated requests. If you
                      encounter errors, wait a few minutes before trying again.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
