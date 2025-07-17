// explain all this please

import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            rel="stylesheet"
            href="https://kendrick-lamar-official-website.local/wp-content/themes/astra/style.css"
          />
          <link
            rel="stylesheet"
            href="https://kendrick-lamar-official-website.local/wp-content/plugins/elementor/assets/css/frontend.css"
          />
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
