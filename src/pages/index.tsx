import Head from 'next/head';
import Header from '../components/header';
import Footer from '../components/footer';
import { useEffect } from 'react';

export async function getStaticProps() {
  let pageData;

  const wordpressUrl = process.env.WORDPRESS_URL;
  
  if (wordpressUrl) {
    try {
      console.log('Attempting to fetch home data from WordPress:', wordpressUrl);
      const resPage = await fetch(`${wordpressUrl}/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            {
              page(id: "home", idType: URI) {
                content
                databaseId
              }
            }
          `,
        }),
      });

      const { data } = await resPage.json();
      
      if (data?.page) {
        pageData = data.page;
        console.log('WordPress home data loaded successfully');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.warn('WordPress fetch failed, using fallback data:', errorMessage);
    }
  } else {
    console.log('WORDPRESS_URL not set, using fallback data');
  }

  if (!pageData) {
    pageData = {
      content: `
        <div class="elementor-widget-container" style="padding: 40px; text-align: center; background: linear-gradient(135deg, #1e3c72, #2a5298); color: white; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <h1 style="font-size: 3rem; margin-bottom: 20px; color: #fff; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">🎵 Kendrick Lamar Official</h1>
          <p style="font-size: 1.2rem; line-height: 1.6; margin-bottom: 20px; max-width: 600px;">Welcome to the official website. Content will load from WordPress when available.</p>
        </div>
      `,
      databaseId: 125
    };
  }

  return {
    props: {
      page: {
        content: pageData.content,
        databaseId: pageData.databaseId,
      },
    },
    revalidate: 3600,
  };
}
// Client-side: Use NEXT_PUBLIC for public variables
const wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
console.log('Client-side URL:', wordpressUrl);

// Server-side: Use WORDPRESS_URL for backend operations
const serverSideWordPressUrl = process.env.WORDPRESS_URL;
console.log('Server-side URL:', serverSideWordPressUrl);


export default function Home({
  page,
}: {
  page: { content: string; databaseId: number };
}) {
  useEffect(() => {
    const wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
    
    if (wordpressUrl) {
      const elementorCSS = `${wordpressUrl}/wp-content/uploads/elementor/css/post-${page.databaseId}.css`;
      
      const loadCSS = (url: string) => {
        if (document.querySelector(`link[href="${url}"]`)) return;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.type = 'text/css';
        link.media = 'all';
        document.head.appendChild(link);
        return link;
      };

      const link = loadCSS(elementorCSS);

      return () => {
        if (link && document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
  }, [page.databaseId]);

  return (
    <>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>
        <div
          className="page-content"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </main>

   <Footer />
    </>
  );
}