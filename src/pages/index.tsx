import Head from 'next/head';
//import Header from '../../components/header';
//import Footer from '../../components/footer';
import { useEffect } from 'react';

export async function getStaticProps() {
  let pageData;

  // NEVER fetch WordPress in production - only in development
  if (process.env.NODE_ENV === 'development') {
    // Only try WordPress if explicitly enabled
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
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.warn('WordPress fetch failed, using fallback data:', errorMessage);
      }
    } else {
      console.log('WORDPRESS_URL not set, using fallback data');
    }
  } else {
    console.log('Production environment detected, skipping WordPress fetch');
  }

  // Fallback data if WordPress data not available
  if (!pageData) {
    pageData = {
      content: `
        <div class="elementor-widget-container" style="padding: 40px; text-align: center; background: black; color: white; min-height: 100vh;">
          <h1 style="font-size: 3rem; margin-bottom: 20px; color: #fff;">Welcome Home</h1>
          <p style="font-size: 1.2rem; line-height: 1.6; margin-bottom: 20px;">This is the home page. Content will be loaded from WordPress when available.</p>
          <p style="font-size: 1rem; opacity: 0.8;">Currently showing fallback content for deployment.</p>
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
    revalidate: 3600, // Revalidate every hour in production
  };
}

export default function Home({
  page,
}: {
  page: { content: string; databaseId: number };
}) {
  useEffect(() => {
    // Only load CSS in development when WordPress URL is available
    if (process.env.NODE_ENV === 'development') {
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
    }
  }, [page.databaseId]);

  return (
    <>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/*<Header />*/}

      <main>
        <div
          className="page-content"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </main>

     {/*<Footer />*/}
    </>
  );
}