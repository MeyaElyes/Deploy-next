import Head from 'next/head';
import { useEffect } from 'react';

// Fetch data for the page using the environment variable
export async function getStaticProps() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://default-api-url.local/graphql'; // Fallback URL

  const resPage = await fetch(apiUrl, {
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

  return {
    props: {
      page: {
        content: data.page.content,
        databaseId: data.page.databaseId,
      },
    },
  };
}

export default function Home({
  page,
}: {
  page: { content: string; databaseId: number };
}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://default-api-url.local'; // Fallback URL
  const elementorCSS = `${apiUrl}/wp-content/uploads/elementor/css/post-${page.databaseId}.css`;

  useEffect(() => {
    // Function to load CSS dynamically
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
  }, [elementorCSS]);

  return (
    <>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <Header /> */}

      <main>
        <div
          className="page-content"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </main>

      {/* <Footer /> */}
    </>
  );
}
