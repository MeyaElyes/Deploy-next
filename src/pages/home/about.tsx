import { useEffect } from 'react';
import Head from 'next/head';
// import Header from '../../components/header';
// import Footer from '../../components/footer';

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

      {/* <Header /> */}

      <main style={{ background: 'black', color: 'white', padding: '20px 0' }}>
 {/*tailwind css for the component that holds the main page */ }
    <div className="max-w-[1500px] mt-10 box-border w-full">

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
