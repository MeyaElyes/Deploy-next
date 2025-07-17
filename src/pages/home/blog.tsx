import { useEffect } from 'react';
import Head from 'next/head';
import Header from '../../components/header';
import Footer from '../../components/footer';

type MenuItem = {
  label: string;
  url: string;
};

export async function getStaticProps() {
  // Fetch the page content including databaseId
  const resPage = await fetch('http://kendrick-lamar-official-website.local/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        {
          page(id: "/home/blog", idType: URI) {
            content
            databaseId
          }
        }
      `,
    }),
  });

  const { data: pageData } = await resPage.json();

  if (!pageData.page) {
    return { notFound: true };
  }

  // Fetch the menu items PS need to fetch it CSS also idk where to find it but i will
  const resMenu = await fetch('http://kendrick-lamar-official-website.local/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        {
          menuItems(where: {location: PRIMARY}) {
            nodes {
              label
              url
            }
          }
        }
      `,
    }),
  });

  const { data: menuData } = await resMenu.json();

  return {
    props: {
      page: {
        content: pageData.page.content,
        databaseId: pageData.page.databaseId,
      },
      menuItems: menuData.menuItems.nodes,
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
    // idk what is this please explain it 
    const elementorCSS = document.createElement('link');
    elementorCSS.rel = 'stylesheet';
    elementorCSS.href = `http://kendrick-lamar-official-website.local/wp-content/uploads/elementor/css/post-${page.databaseId}.css`;
    document.head.appendChild(elementorCSS);
// also this 
    return () => {
      document.head.removeChild(elementorCSS);
    };
  }, [page.databaseId]);

  return (
    //this is the page i return under html 
    <>
    {/*head that contain title */}
      <Head>
        <title>Blog</title>
      </Head>
      {/*header which is the page menu */}
      <Header/>
      {/*this need to be explained*/}
      <div className={`home page page-id-${page.databaseId} ast-page-builder-template ast-no-sidebar`}>
        <main
          style={{
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
      {/*footer */}
            <Footer/>

    </>
  );
}
