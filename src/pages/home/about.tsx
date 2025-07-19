import { useEffect } from 'react';
import Head from 'next/head';
import Header from '../../components/header';
import Footer from '../../components/footer';

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

      <Header />

      <div
        className={`home page page-id-${page.databaseId} ast-page-builder-template ast-no-sidebar`}
      >
        <main
          style={{
            maxWidth: 1500,
            margin: 'auto',
            padding: 40,
            background: 'black',
            color: 'white',
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

      <Footer />
    </>
  );
}
