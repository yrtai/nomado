export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 py-24 text-center">
      <h1 className="text-5xl font-bold tracking-tight">Nomado</h1>
      <p className="text-xl text-gray-600">
        Stays, cars and tours in Kyrgyzstan — one open-source platform, built
        in public by junior developers.
      </p>
      <div className="flex gap-4">
        <a
          href="https://github.com/yrtai/nomado"
          className="rounded-lg bg-gray-900 px-5 py-2.5 font-medium text-white hover:bg-gray-700"
        >
          GitHub
        </a>
        <a
          href="https://github.com/yrtai/nomado/blob/main/CONTRIBUTING.md"
          className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium hover:bg-gray-50"
        >
          Contribute
        </a>
      </div>
      <p className="text-sm text-gray-400">
        Phase 0 — project setup. The booking platform starts at Phase 1.
      </p>
    </main>
  );
}
