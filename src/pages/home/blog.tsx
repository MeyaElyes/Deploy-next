// pages/home/blog.tsx

import { useEffect } from 'react';
import Head from 'next/head';
import Header from '../../components/header';
import Footer from '../../components/footer';

type MenuItem = {
  label: string;
  url: string;
};

export async function getStaticProps() {
  const res = await fetch('http://kendrick-lamar-official-website.local/graphql', {
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
  menuItems: MenuItem[];
}) {
  useEffect(() => {
    // ✅ Inject Elementor CSS dynamically based on post ID
    const elementorCSS = document.createElement('link');
    elementorCSS.rel = 'stylesheet';
    elementorCSS.href = `http://kendrick-lamar-official-website.local/wp-content/uploads/elementor/css/post-${page.databaseId}.css`;
    elementorCSS.type = 'text/css';
    elementorCSS.media = 'all';
    document.head.appendChild(elementorCSS);

    // Cleanup on unmount
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

      <Header />

      <div className={`home page page-id-${page.databaseId} ast-page-builder-template ast-no-sidebar`}>
        <main
          style={{
            color:"white",
            maxWidth: 1900,
            margin: '40px auto',
            padding: '40px 24px',
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

      <Footer />
    </>
  );
}
