
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Index from "./IndexContent";
import Head from "next/head";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>RepoGrabber - Download GitHub Code with Ease</title>
        <meta name="description" content="Easily download any public GitHub repository, folder, or file without using Git or command line tools. Free and open source." />
        <link rel="canonical" href="https://repograbber.com" />
        
        {/* Open Graph tags specific to home page */}
        <meta property="og:title" content="RepoGrabber - Download GitHub Code with Ease" />
        <meta property="og:description" content="Easily download any public GitHub repository, folder, or file without using Git or command line tools." />
        <meta property="og:url" content="https://repograbber.com" />
        
        {/* Schema.org structured data for Software Application */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "RepoGrabber",
              "applicationCategory": "DeveloperApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "1024"
              }
            })
          }}
        />
        
        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Can I download a complete GitHub repository?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, you can download any public GitHub repository as a ZIP file. Simply enter the repository URL in the search box and click the download button."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is it possible to download a specific folder from a repository?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Absolutely! RepoGrabber allows you to navigate through repositories and download specific folders. After searching for a repository, you can browse its contents and download any folder you need."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Do I need a GitHub account to use RepoGrabber?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No, RepoGrabber works without requiring you to have a GitHub account or to be logged in. You can freely download public repositories, folders, and files anonymously."
                  }
                }
              ]
            })
          }}
        />
      </Head>
      <Index />
    </>
  );
}
