import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Score = {
  name: string;
  score: number;
  date: string;
};

export default function LeaderboardPage() {
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("quiz-scores");
      if (!raw) return;
      const parsed: Score[] = JSON.parse(raw);
      // Sortuj malejąco po wyniku
      const sorted = parsed.sort((a, b) => b.score - a.score);
      setScores(sorted.slice(0, 20)); // pokaż top 20
    } catch (e) {
      setScores([]);
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 py-12 px-6 md:px-12 dark:text-white transition">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-12">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Tablica wyników
          </h1>
          <nav className="flex items-center gap-4">
            <a href="/" className="text-sm opacity-80">
              Home
            </a>
          </nav>
        </header>

        {scores.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400">
            Brak zapisanych wyników — rozwiąż quiz, aby zobaczyć swoją pozycję.
          </p>
        ) : (
          <motion.ol
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {scores.map((s, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex items-center justify-between bg-white dark:bg-slate-900 rounded-2xl p-4 border shadow"
              >
                <div>
                  <div className="text-sm font-medium">{s.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(s.date).toLocaleString()}
                  </div>
                </div>
                <div className="text-lg font-bold">{s.score} pkt</div>
              </motion.li>
            ))}
          </motion.ol>
        )}

        <footer className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
          Wyniki przechowywane lokalnie (LocalStorage). <br />©{" "}
          {new Date().getFullYear()} Quiz Wygral
        </footer>
      </div>
    </main>
  );
}
