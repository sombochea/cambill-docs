import Link from 'next/link';

const paths = [
  {
    title: 'Quickstart',
    body: 'A customer, a product and an invoice your customer can pay, in five minutes.',
    href: '/docs/quickstart',
  },
  {
    title: 'Node SDK',
    body: '@cubis/cambill: typed, zero dependencies, retries and idempotency built in.',
    href: '/docs/sdk',
  },
  {
    title: 'API reference',
    body: 'Every endpoint, from the same OpenAPI file the server is tested against.',
    href: '/docs/api-reference',
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center gap-10 px-4 py-16">
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium text-fd-primary">CamBill documentation</p>
        <h1 className="text-4xl font-semibold tracking-tight">Get paid, in minutes.</h1>
        <p className="max-w-2xl text-lg text-fd-muted-foreground">
          Accept KHQR and Bakong payments, invoice customers, sell from a catalogue and bill
          subscriptions. One API key, one webhook, a test mode that behaves like the real thing.
        </p>
        <div className="flex gap-3">
          <Link
            href="/docs/quickstart"
            className="rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            Quickstart
          </Link>
          <Link href="/docs" className="rounded-lg border bg-fd-card px-4 py-2 text-sm font-medium transition-colors hover:bg-fd-accent">
            Read the docs
          </Link>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {paths.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="rounded-xl border bg-fd-card p-5 shadow-sm transition-colors hover:border-fd-primary/40"
          >
            <h2 className="font-medium">{p.title}</h2>
            <p className="mt-1 text-sm text-fd-muted-foreground">{p.body}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
