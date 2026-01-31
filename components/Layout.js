import Head from 'next/head';

export default function Layout({ children, title = 'Valentine\'s Flower Delivery' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Send beautiful Valentine's Day flowers with a personalized letter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className="min-h-screen w-full"
        style={{
          backgroundImage: `url('/wood-bg.png')`,
          backgroundRepeat: 'repeat',
          backgroundSize: '100px auto',
        }}
      >
        {children}
      </div>
    </>
  );
}
