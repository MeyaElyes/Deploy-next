// pages/_document.tsx
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Global WordPress theme CSS */}
          <link
            rel="stylesheet"
            href="https://kendrick-lamar-official-website.local/wp-content/themes/astra/style.css"
            type="text/css"
            media="all"
          />
          {/* Global Elementor plugin CSS */}
          <link
            rel="stylesheet"
            href="https://kendrick-lamar-official-website.local/wp-content/plugins/elementor/assets/css/frontend.min.css"
            type="text/css"
            media="all"
          />
          {/* You can add fonts or other global CSS here */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
