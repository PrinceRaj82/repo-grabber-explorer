
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
                  "name": "Can I Download Complete GitHub Repository",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, you can download any public GitHub repository as a ZIP file. Simply enter the repository URL in the search box and click the download button."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I Download Individual Files",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, you can download individual files from any public GitHub repository. Simply navigate to the desired file and click the download button to save it to your device."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is It Possible To Download A Specific Folder From A Repo",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Absolutely! RepoGrabber allows you to navigate through repositories and download specific folders. After searching for a repository, you can browse its contents and download any folder you need."
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
