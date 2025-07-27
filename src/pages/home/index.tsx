  import Head from 'next/head';
  //import Header from '../../components/header';
  //import Footer from '../../components/footer';
  import { useEffect } from 'react';

  export async function getStaticProps() {
    const resPage = await fetch('http://kendrick-lamar-official-website.local/graphql', {
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
    const elementorCSS = `http://kendrick-lamar-official-website.local/wp-content/uploads/elementor/css/post-${page.databaseId}.css`;

    useEffect(() => {
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

        {/*<Header />*/}

        <main>
          <div
            className="page-content"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </main>

       {/*<Footer />*/}
      </>
    );
  }
