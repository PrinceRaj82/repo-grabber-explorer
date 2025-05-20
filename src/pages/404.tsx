
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import NotFound from "../pages/NotFound";
import Head from "next/head";

export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>Page Not Found | RepoGrabber</title>
        <meta name="description" content="The page you're looking for couldn't be found. Return to RepoGrabber to download GitHub repositories easily." />
        <meta name="robots" content="noindex, follow" />
        
        {/* Open Graph tags for 404 page */}
        <meta property="og:title" content="Page Not Found | RepoGrabber" />
        <meta property="og:description" content="The page you're looking for couldn't be found. Return to RepoGrabber to download GitHub repositories easily." />
      </Head>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <NotFound />
        </main>
        <Footer />
      </div>
    </>
  );
}
