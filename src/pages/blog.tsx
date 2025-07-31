import { useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/header';
//import Footer from '../components/footer';

export async function getStaticProps() {
  let pageData;

  const wordpressUrl = process.env.WORDPRESS_URL;

  if (wordpressUrl) {
    try {
      console.log('Attempting to fetch blog data from WordPress:', wordpressUrl);
      const res = await fetch(`${wordpressUrl}/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: ` 
            {
              page(id: "/home/blog", idType: URI) {
                content
                databaseId
              }
            }
          `,
        }),
      });

      const { data } = await res.json();

      if (data?.page) {
        pageData = data.page;
        console.log('WordPress blog data loaded successfully');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.warn('WordPress fetch failed, using fallback data:', error.message);
      } else {
        console.warn('Unknown error occurred, using fallback data');
      }
    }
  }

  if (!pageData) {
    pageData = {
      content: `
        <div class="elementor-widget-container" style="padding: 40px; text-align: center;">
          <h1 style="font-size: 2.5rem; margin-bottom: 20px; color: #fff;">Blog</h1>
          <p style="font-size: 1.2rem; line-height: 1.6; margin-bottom: 20px;">Welcome to the blog page. This content will be loaded from WordPress when available.</p>
          <p style="font-size: 1rem; opacity: 0.8;">Currently showing fallback content for deployment.</p>
        </div>
      `,
      databaseId: 124
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

export default function Blog({
  page,
}: {
  page: { content: string; databaseId: number };
}) {
  useEffect(() => {
    // Only load CSS in development when WordPress URL is available
    if (process.env.NODE_ENV === 'development') {
      const wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;

      if (wordpressUrl) {
        const elementorCSS = document.createElement('link');
        elementorCSS.rel = 'stylesheet';
        elementorCSS.href = `${wordpressUrl}/wp-content/uploads/elementor/css/post-${page.databaseId}.css`;
        elementorCSS.type = 'text/css';
        elementorCSS.media = 'all';
        document.head.appendChild(elementorCSS);

        // Add custom CSS for header max-width
        const customCSS = document.createElement('style');
        customCSS.textContent = `
          .header {
            max-width: 1200px !important;
            margin: 0 auto !important;
          }
        `;
        document.head.appendChild(customCSS);

        return () => {
          if (document.head.contains(elementorCSS)) {
            document.head.removeChild(elementorCSS);
          }
          if (document.head.contains(customCSS)) {
            document.head.removeChild(customCSS);
          }
        };
      }
    }
  }, [page.databaseId]);

  return (
    <>
      <Head>
        <title>Blog</title>
        <style jsx>{`
          .header {
            max-width: 1200px !important;
            margin: 0 auto !important;
          }
        `}</style>
      </Head>

      <Header />
      <div className={`home page page-id-${page.databaseId}`}>
        <main style={{ color: "white", backgroundColor: 'black', width: "100vw", minHeight: "100vh" }}>
          <div className={`elementor elementor-${page.databaseId}`}>
            <div className="elementor-inner">
              <div className="elementor-section-wrap">
                <div dangerouslySetInnerHTML={{ __html: page.content }} />
              </div>
            </div>
          </div>
        </main>
      </div>
     {/* <Footer />*/}
    </>
  );
}