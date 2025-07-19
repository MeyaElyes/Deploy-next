import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import Header from '../../../components/header';
import Footer from '../../../components/footer';

export const getServerSideProps: GetServerSideProps<{
  post: { content: string; databaseId: number };
}> = async ({ params }) => {
  const slug = params?.slug;

  if (typeof slug !== 'string') {
    return { notFound: true };
  }

  const resPost = await fetch('http://kendrick-lamar-official-website.local/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query PostBySlug($slug: ID!) {
          post(id: $slug, idType: SLUG) {
            content
            databaseId
          }
        }
      `,
      variables: { slug },
    }),
  });

  const { data: postData } = await resPost.json();

  if (!postData?.post) {
    return { notFound: true };
  }

  return {
    props: {
      post: {
        content: postData.post.content,
        databaseId: postData.post.databaseId,
      },
    },
  };
};

export default function PostPage({
  post,
}: {
  post: { content: string; databaseId: number };
}) {
  useEffect(() => {
    const elementorCSS = document.createElement('link');
    elementorCSS.rel = 'stylesheet';
    elementorCSS.href = `http://kendrick-lamar-official-website.local/wp-content/uploads/elementor/css/post-${post.databaseId}.css`;
    document.head.appendChild(elementorCSS);

    return () => {
      document.head.removeChild(elementorCSS);
    };
  }, [post.databaseId]);

  return (
    <>
      <Head>
        <title>blog</title>
      </Head>

      <Header />

      <div className={`single-post postid-${post.databaseId} ast-page-builder-template ast-no-sidebar`}>
        <main style={{ maxWidth: 1500, margin: 'auto', padding: 32, background: 'black' ,color:"white"}}>
          <div className={`elementor elementor-${post.databaseId}`}>
            <div className="elementor-inner">
              <div className="elementor-section-wrap">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}
