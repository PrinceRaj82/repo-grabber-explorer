
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Guide from "./GuideContent";
import Head from "next/head";

export default function GuidePage() {
  return (
    <>
      <Head>
        <title>How to Use RepoGrabber | GitHub Download Guide</title>
        <meta name="description" content="Step-by-step guide on using RepoGrabber to download GitHub repositories, folders and files without Git knowledge." />
        <link rel="canonical" href="https://repograbber.com/guide" />
        
        {/* Open Graph tags specific to guide page */}
        <meta property="og:title" content="How to Use RepoGrabber | GitHub Download Guide" />
        <meta property="og:description" content="Step-by-step guide on using RepoGrabber to download GitHub repositories, folders and files without Git knowledge." />
        <meta property="og:url" content="https://repograbber.com/guide" />
        
        {/* Schema.org structured data for Guide/HowTo page */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HowTo",
              "name": "How to Use RepoGrabber",
              "description": "Step-by-step guide on using RepoGrabber to download GitHub repositories, folders and files without Git knowledge.",
              "step": [
                {
                  "@type": "HowToStep",
                  "name": "Enter Repository URL",
                  "text": "Enter the GitHub repository URL in the search box."
                },
                {
                  "@type": "HowToStep",
                  "name": "Explore Content",
                  "text": "Browse through the repository structure to find what you need."
                },
                {
                  "@type": "HowToStep",
                  "name": "Download",
                  "text": "Click the download button to save the repository, folder, or file."
                }
              ]
            })
          }}
        />
      </Head>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Guide />
        </main>
        <Footer />
      </div>
    </>
  );
}
