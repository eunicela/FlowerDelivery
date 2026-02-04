import Head from 'next/head';

export default function Layout({ children, title = 'Valentine\'s Flower Delivery' }) {
  const handleSecretClick = async () => {
    const password = prompt('Password:');
    if (!password) return;

    const email = prompt('Email for test confirmation:');
    if (!email) return;

    try {
      const response = await fetch('/api/test-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || 'Failed');
        return;
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Send beautiful Valentine's Day flowers with a personalized letter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className="min-h-screen w-full relative"
        style={{
          backgroundImage: `url('/wood-bg.png')`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {children}
        {/* Secret test transaction button */}
        <button
          onClick={handleSecretClick}
          className="fixed bottom-4 left-4 w-3 h-3 rounded-full bg-black opacity-30 hover:opacity-60 transition-opacity"
          aria-hidden="true"
        />
      </div>
    </>
  );
}
