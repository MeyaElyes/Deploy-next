import { useEffect } from 'react';
import Head from 'next/head';

export async function getStaticProps() {
  // Use the environment variable for the API URL
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'kendrick-lamar-official-website.local/graphql';

  const res = await fetch(apiUrl, {
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

  if (!data?.page) return { notFound: true };

  return {
    props: {
      page: {
        content: data.page.content,
        databaseId: data.page.databaseId,
      },
      menuItems: data.menuItems.nodes,
    },
  };
}

export default function Blog({
  page,
  menuItems,
}: {
  page: { content: string; databaseId: number };
  menuItems: { label: string; url: string }[];  // Adjusted the type for clarity
}) {
  useEffect(() => {
    const elementorCSS = document.createElement('link');
    elementorCSS.rel = 'stylesheet';
    elementorCSS.href = `http://kendrick-lamar-official-website.local/wp-content/uploads/elementor/css/post-${page.databaseId}.css`;
    elementorCSS.type = 'text/css';
    elementorCSS.media = 'all';
    document.head.appendChild(elementorCSS);

    return () => {
      if (document.head.contains(elementorCSS)) {
        document.head.removeChild(elementorCSS);
      }
    };
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
        </main>
      </div>
    </>
  );
}
