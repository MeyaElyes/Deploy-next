import { useEffect } from 'react';
import Head from 'next/head';
// import Header from '../../components/header';
// import Footer from '../../components/footer';

export async function getStaticProps() {
  let pageData;

  // NEVER fetch WordPress in production - only in development
  if (process.env.NODE_ENV === 'development') {
    // Only try WordPress if explicitly enabled
    const wordpressUrl = process.env.WORDPRESS_URL;
    
    if (wordpressUrl) {
      try {
        console.log('Attempting to fetch from WordPress:', wordpressUrl);
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
        if (response.data?.page) {
          pageData = response.data.page;
          console.log('WordPress data loaded successfully');
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

  // Always use fallback data if WordPress data not available
  if (!pageData) {
    pageData = {
      content: `
        <div class="elementor-widget-container" style="padding: 40px; text-align: center;">
          <h1 style="font-size: 2.5rem; margin-bottom: 20px; color: #fff;">About</h1>
          <p style="font-size: 1.2rem; line-height: 1.6; margin-bottom: 20px;">Welcome to the about page. This content will be loaded from WordPress when available.</p>
          <p style="font-size: 1rem; opacity: 0.8;">Currently showing fallback content for deployment.</p>
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
    revalidate: 3600, // Revalidate every hour in production
  };
}

export default function About({
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
        document.head.appendChild(elementorCSS);

        return () => {
          if (document.head.contains(elementorCSS)) {
            document.head.removeChild(elementorCSS);
          }
        };
      }
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