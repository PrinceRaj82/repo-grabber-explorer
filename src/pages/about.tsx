
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import About from "./AboutContent";
import Head from "next/head";

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About RepoGrabber | GitHub Code Downloader</title>
        <meta name="description" content="Learn more about RepoGrabber, the tool that makes downloading GitHub content easier without Git or command line tools." />
        <link rel="canonical" href="https://repograbber.com/about" />
        
        {/* Open Graph tags specific to about page */}
        <meta property="og:title" content="About RepoGrabber | GitHub Code Downloader" />
        <meta property="og:description" content="Learn more about RepoGrabber, the tool that makes downloading GitHub content easier without Git or command line tools." />
        <meta property="og:url" content="https://repograbber.com/about" />
        
        {/* Schema.org structured data for About page */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "About RepoGrabber",
              "description": "Learn more about RepoGrabber, the tool that makes downloading GitHub content easier without Git or command line tools."
            })
          }}
        />
      </Head>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <About />
        </main>
        <Footer />
      </div>
    </>
  );
}
