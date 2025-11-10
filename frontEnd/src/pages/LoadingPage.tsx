export default function LoadingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 transition">
      <div className="flex flex-col items-center gap-6">
        {/* Tytuł */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-sky-600 dark:text-sky-400">
          Quiz Win
        </h1>

        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>

        {/* Podpis */}
        <p className="text-slate-600 dark:text-slate-300 text-sm animate-pulse">
          Loading...
        </p>
      </div>
    </main>
  );
}
