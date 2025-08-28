import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@900&f[]=clash-display@400&f[]=clash-grotesk@1&f[]=panchang@1&f[]=nippo@1&f[]=boska@400&f[]=aktura@400&f[]=melodrama@400&f[]=supreme@400&f[]=technor@1&display=swap"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300&family=Jacquard+12&family=Jacquard+24&family=Manufacturing+Consent&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Pirata+One&family=Roboto:ital,wght@0,100..900;1,100..900&family=UnifrakturMaguntia&display=swap" rel="stylesheet" />
        <link href="https://fonts.cdnfonts.com/css/druk-wide-bold" rel="stylesheet" />
                
        <meta name="description" content="Art portfolio" />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
