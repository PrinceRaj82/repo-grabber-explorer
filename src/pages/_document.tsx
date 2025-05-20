
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        
        {/* Standard meta tags */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Robots control */}
        <meta name="robots" content="index, follow" />
        
        {/* Common Open Graph tags */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="RepoGrabber" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@repograbber" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
