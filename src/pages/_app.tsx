import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import '../styles/globals.css'  

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (!pageProps?.page?.databaseId) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `http://kendrick-lamar-official-website.local/wp-content/uploads/elementor/css/post-${pageProps.page.databaseId}.css`;
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [pageProps?.page?.databaseId]);

  return <Component {...pageProps} />;
}

export default MyApp;
