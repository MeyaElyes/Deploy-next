import { useEffect } from 'react';
import Head from 'next/head';

type MenuItem = {
  label: string;
  url: string;
};

export async function getStaticProps() {
  const resPage = await fetch('http://kendrick-lamar-official-website.local/graphql', {
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
  menuItems: MenuItem[]; // kept to match your structure but unused now what do u mean unused what the fuck
}) {
  useEffect(() => {
    const elementorCSS = document.createElement('link');
    elementorCSS.rel = 'stylesheet';
    elementorCSS.href = `http://kendrick-lamar-official-website.local/wp-content/uploads/elementor/css/post-${page.databaseId}.css`;
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
{/*add header and footer please i forgot */}
      <div
        className={`home page page-id-${page.databaseId} ast-page-builder-template ast-no-sidebar`}
      >
        <main style={{ maxWidth: 1200, margin: 'auto', padding: 32 }}>
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
