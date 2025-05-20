
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "@/index.css";
import { useState } from "react";
import { AppProps } from "next/app";
import Head from "next/head";

// Main App component for Next.js
export default function MyApp({ Component, pageProps }: AppProps) {
  // Create a new QueryClient instance inside the component
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Head>
            {/* Default meta tags that can be overridden by individual pages */}
            <title>RepoGrabber - Download GitHub Code with Ease</title>
            <meta name="description" content="Easily download any public GitHub repository, folder, or file without using Git or command line tools. Free and open source." />
            
            {/* Canonical link - should be overridden by individual pages */}
            <link rel="canonical" href="https://repograbber.com" />
            
            {/* Open Graph tags */}
            <meta property="og:title" content="RepoGrabber - Download GitHub Code with Ease" />
            <meta property="og:description" content="Easily download any public GitHub repository, folder, or file without using Git or command line tools." />
            <meta property="og:image" content="https://repograbber.com/og-image.png" />
            <meta property="og:url" content="https://repograbber.com" />
            
            {/* Twitter Card tags */}
            <meta name="twitter:title" content="RepoGrabber - Download GitHub Code with Ease" />
            <meta name="twitter:description" content="Easily download any public GitHub repository, folder, or file without using Git or command line tools." />
            <meta name="twitter:image" content="https://repograbber.com/og-image.png" />
            
            {/* Keywords */}
            <meta name="keywords" content="github, download, repository, repo, folder, file, git, code, developer tools" />
          </Head>
          
          <Toaster />
          <Sonner />
          <Component {...pageProps} />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
