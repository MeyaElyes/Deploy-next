import { useEffect } from 'react';
import Head from 'next/head';
// import Header from '../../components/header';
// import Footer from '../../components/footer';

export async function getStaticProps() {
  // Check if we're in development and the WordPress site is available
  const isLocal = process.env.NODE_ENV === 'development';
  const wordpressUrl = process.env.WORDPRESS_URL || 'http://kendrick-lamar-official-website.local';
  
  let pageData;

  if (isLocal) {
    try {
      const resPage = await fetch(`${wordpressUrl}/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            {
              page(id: "about", idType: URI) {
                content
                databaseId
              }
            }
          `,
        }),
      });

      const response = await resPage.json();
      pageData = response.data.page;
    } catch (error) {
      console.warn('WordPress fetch failed, using fallback data:', error.message);
      pageData = null;
    }
  }

  // Fallback data for production or when WordPress is unavailable
  if (!pageData) {
    pageData = {
      content: `
        <div class="elementor-widget-container">
          <h1>About</h1>
          <p>Welcome to the about page. This content will be loaded from WordPress when available.</p>
          <p>Currently showing fallback content for deployment.</p>
        </div>
      `,
      databaseId: 123
    };
  }

  return {
    props: {
      page: {
        content: pageData.content,
        databaseId: pageData.databaseId,
      },
    },
    revalidate: 60, // Revalidate every minute in production
  };
}

export default function About({
  page,
}: {
  page: { content: string; databaseId: number };
}) {
  useEffect(() => {
    // Only load CSS in development or when WordPress URL is available
    const wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
    
    if (wordpressUrl && process.env.NODE_ENV === 'development') {
      const elementorCSS = document.createElement('link');
      elementorCSS.rel = 'stylesheet';
      elementorCSS.href = `${wordpressUrl}/wp-content/uploads/elementor/css/post-${page.databaseId}.css`;
      document.head.appendChild(elementorCSS);

      return () => {
        if (document.head.contains(elementorCSS)) {
          document.head.removeChild(elementorCSS);
        }
      };
    }
  }, [page.databaseId]);

  return (
    <>
      <Head>
        <title>About</title>
      </Head>

      {/* <Header /> */}

      <main style={{ background: 'black', color: 'white', padding: '20px 0' }}>
        {/* tailwind css for the component that holds the main page */}
        <div className="max-w-[1500px] mt-10 box-border w-full mx-auto px-4">
          <div
            className={`page-content elementor elementor-${page.databaseId}`}
            style={{ margin: 0, padding: 0 }}
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </main>

      {/* <Footer /> */}
    </>
  );
}