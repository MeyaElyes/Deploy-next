// 
import Head from 'next/head';
import Script from 'next/script'; // what is this import ?  
import Header from '../../components/header';   // header component
import Footer from '../../components/footer';   // footer component


export async function getStaticProps() {
  // Fetch page content + data base ID for CSS 
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
  const { data: pageData } = await resPage.json();

  // Fetch menu, logo 
  // TO DO I NEED TO FECTCH IT FUCKING CSS ALSO 
  const resMenu = await fetch('http://kendrick-lamar-official-website.local/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        {
          siteLogo
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
      siteLogo: menuData.siteLogo || '', // logo 
      menuItems: menuData.menuItems.nodes || [], // menu items ? 
      footerItems: menuData.menuItems.nodes || [],  // footer items ?? TO DO work fix this cause i don't think it's working 
    },
  };
}

export default function Home({
  page,
  siteLogo,
  menuItems,
  footerItems,
}: {
  page: { content: string; databaseId: number };
  siteLogo: string;
  menuItems: { label: string; url: string }[];
  footerItems: { label: string; url: string }[];
}) {
  const elementorCSS = `http://kendrick-lamar-official-website.local/wp-content/uploads/elementor/css/post-${page.databaseId}.css`;
  const elementorJS = `http://kendrick-lamar-official-website.local/wp-content/plugins/elementor/assets/js/frontend.min.js`;

  return (
    <>
     <Head>
        <title>Home</title>
      </Head>


      {/* Elementor JS what is this ? exactly ???  */}
      <Script src={elementorJS} strategy="afterInteractive" />

      {/* Header  this is the menu header*/}
      <Header />
      {/* i guess this is tailwind css for home page */}
      <div className="home page page-id-10 ast-page-builder-template ast-no-sidebar">
      {/*container for the main page */}
      
        <main
          style={{
            maxWidth: 1900,
            margin: '40px auto',
            padding: '40px 24px',
            backgroundColor: 'black',
          }}
        >
          {/*explain what this is please*/}
          <div className={`elementor elementor-${page.databaseId}`}>
            <div className="elementor-inner">
              <div className="elementor-section-wrap">
                <div className="elementor-wrapper" suppressHydrationWarning>
                  <div dangerouslySetInnerHTML={{ __html: page.content }} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer this is just the footer*/}
      <Footer />
    </>
  );
}
