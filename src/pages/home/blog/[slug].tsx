import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';

// Fetch data for the post using the environment variable
export const getServerSideProps: GetServerSideProps<{
  post: { content: string; databaseId: number };
}> = async ({ params }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://default-api-url.local/graphql'; // Fallback URL
  const slug = params?.slug;

  if (typeof slug !== 'string') {
    return { notFound: true };
  }

  const resPost = await fetch(apiUrl, {
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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://default-api-url.local'; // Fallback URL
  const elementorCSS = `${apiUrl}/wp-content/uploads/elementor/css/post-${post.databaseId}.css`;

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
        <title>Blog Post</title>
      </Head>

      {/* <Header /> */}

      <div className={`single-post postid-${post.databaseId} ast-page-builder-template ast-no-sidebar`}>
        <main
          style={{
            background: 'black',
            color: 'white',
            maxWidth: '1800px',
            margin: '40px auto',
          }}
        >
          <div className={`elementor elementor-${post.databaseId}`}>
            <div className="elementor-inner">
              <div className="elementor-section-wrap">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* <Footer /> */}
    </>
  );
}
