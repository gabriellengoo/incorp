import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          rel="stylesheet"
          type="text/css"
          href="/assets/css/bootstrap.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="/assets/css/jquery-ui.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="/assets/css/styles.css?v6"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
        <script src="/assets/js/jquery-3.5.1.min.js"></script>
        <script src="/assets/js/bootstrap.bundle.min.js"></script>
        <script src="/assets/js/jquery-ui.min.js"></script>
        <script src="/assets/js/gsap.min.js"></script>
        <script src="/assets/js/app.js?v6" type="module"></script>
      </body>
    </Html>
  );
}
