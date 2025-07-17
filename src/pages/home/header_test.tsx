import React from 'react';
import Head from 'next/head';
import Header from '../../components/header';  
import Footer from '../../components/footer';  

export async function getStaticProps() {

  return {
    props: {}, // no need to pass CSS URLs or menus if components fetch themselves
    revalidate: 60,
  };
}

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Your Site Title</title>
      </Head>

      {/* Header fetches and injects its own CSS and HTML */}
      <Header />

      <main>
        <h1>Welcome to the Site!</h1>
        {/* Your page content */}
      </main>

      {/* Footer fetches and injects its own CSS and HTML */}
      <Footer />
    </>
  );
}

