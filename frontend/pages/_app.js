import Page from '../components/Page';

export default function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Page>
        <Component {...pageProps} />
      </Page>
    </div>
  );
}
