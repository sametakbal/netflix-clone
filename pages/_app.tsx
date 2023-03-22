import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Netflix</title>
        <meta
          name='description'
          content={'Neftlix Clone'}
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
