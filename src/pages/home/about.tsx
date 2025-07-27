import { useEffect } from 'react';
import Head from 'next/head';

export async function getStaticProps() {
  // Use environment variable for the API URL
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://default-api-url.local/graphql';

  const resPage = await fetch(apiUrl, {
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

  const { data: pageData } = await resPage.json();

  return {
    props: {
      page: {
        content: pageData.page.content,
        databaseId: pageData.page.databaseId,
      },
    },
  };
}

export default function About({
  page,
}: {
  page: { content: string; databaseId: number };
}) {
  useEffect(() => {
    // Use the same API URL from env for loading styles
    const elementorCSS = document.createElement('link');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://default-api-url.local';  // Fallback URL

    elementorCSS.rel = 'stylesheet';
    elementorCSS.href = `${apiUrl.replace('/graphql', '')}/wp-content/uploads/elementor/css/post-${page.databaseId}.css`;
    document.head.appendChild(elementorCSS);

    return () => {
      document.head.removeChild(elementorCSS);
    };
  }, [page.databaseId]);

  return (
    <>
      <Head>
        <title>About</title>
      </Head>

      <main style={{ background: 'black', color: 'white', padding: '20px 0' }}>
        <div className="max-w-[1500px] mt-10 box-border w-full">
          <div
            className={`page-content elementor elementor-${page.databaseId}`}
            style={{ margin: 0, padding: 0 }}
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </main>
    </>
  );
}
