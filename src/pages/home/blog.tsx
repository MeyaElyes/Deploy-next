import { useEffect } from 'react';
import Head from 'next/head';

export async function getStaticProps() {
  let pageData;
  let menuItemsData;

  // NEVER fetch WordPress in production - only in development
  if (process.env.NODE_ENV === 'development') {
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
                menuItems(where: { location: PRIMARY }) {
                  nodes {
                    label
                    url
                  }
                }
              }
            `,
          }),
        });

        const { data } = await res.json();
        
        if (data?.page) {
          pageData = data.page;
          menuItemsData = data.menuItems?.nodes || [];
          console.log('WordPress blog data loaded successfully');
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
        <div class="elementor-widget-container" style="padding: 40px; text-align: center;">
          <h1 style="font-size: 2.5rem; margin-bottom: 20px; color: #fff;">Blog</h1>
          <p style="font-size: 1.2rem; line-height: 1.6; margin-bottom: 20px;">Welcome to the blog page. This content will be loaded from WordPress when available.</p>
          <p style="font-size: 1rem; opacity: 0.8;">Currently showing fallback content for deployment.</p>
        </div>
      `,
      databaseId: 124
    };
  }

  if (!menuItemsData) {
    menuItemsData = [
      { label: 'Home', url: '/' },
      { label: 'About', url: '/about' },
      { label: 'Blog', url: '/blog' },
      { label: 'Contact', url: '/contact' }
    ];
  }

  return {
    props: {
      page: {
        content: pageData.content,
        databaseId: pageData.databaseId,
      },
      menuItems: menuItemsData,
    },
    revalidate: 3600, // Revalidate every hour in production
  };
}

export default function Blog({
  page,
  menuItems,
}: {
  page: { content: string; databaseId: number };
  menuItems: { label: string; url: string }[];
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
        <title>Blog</title>
      </Head>

      <div className={`home page page-id-${page.databaseId} ast-page-builder-template ast-no-sidebar`}>
        <main
          style={{
            color: "white",
            backgroundColor: 'black',
          }}
        >
          <div className={`elementor elementor-${page.databaseId}`}>
            <div className="elementor-inner">
              <div className="elementor-section-wrap">
                <div dangerouslySetInnerHTML={{ __html: page.content }} />
              </div>
            </div>
          </div>
          
          {/* Optional: Display menu items if you want to use them */}
          {process.env.NODE_ENV === 'development' && (
            <div style={{ padding: '20px', borderTop: '1px solid #333' }}>
              <h3>Menu Items (Development Only):</h3>
              <ul>
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <a href={item.url}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>
      </div>
    </>
  );
}