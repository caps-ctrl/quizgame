import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Score = {
  name: string;
  score: number;
  date: string;
};

const API_URL = import.meta.env.VITE_API_URL;

export default function LeaderboardPage() {
  const [scores, setScores] = useState<Score[]>([]);
  // 1. Dodajemy stan 'isLoading'
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      // Ustawiamy ładowanie na true (na wypadek odświeżania w przyszłości)
      setIsLoading(true);
      try {
        if (!API_URL) {
          throw new Error("VITE_API_URL is not defined");
        }

        const res = await fetch(`${API_URL}/api/scores`);

        if (!res.ok) {
          throw new Error("Error fetching scores");
        }

        const parsed: Score[] = await res.json();
        setScores(parsed);
      } catch (e) {
        console.error("Error loading scores:", e);
        setScores([]);
      } finally {
        // 2. Kończymy ładowanie niezależnie od wyniku
        setIsLoading(false);
      }
    };

    fetchScores();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 py-12 px-6 md:px-12 dark:text-white transition">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-12">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Leaderboard
          </h1>
          <nav className="flex items-center gap-4">
            <a href="/" className="text-sm opacity-80">
              Home
            </a>
          </nav>
        </header>

        {/* 3. Zaktualizowana logika renderowania */}
        {isLoading ? (
          <p className="text-slate-500 dark:text-slate-400">
            Loading scores...
          </p>
        ) : scores.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400">
            No saved scores — take the quiz to see your ranking.
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
                className="flex items-center justify-between bg-white dark:bg-slate-900 rounded-2xl p-4 border shadow dark:border-slate-700"
              >
                <div>
                  <div className="text-sm font-medium">{s.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(s.date).toLocaleString()}
                  </div>
                </div>
                <div className="text-lg font-bold">{s.score} pts</div>
              </motion.li>
            ))}
          </motion.ol>
        )}
        {/* Koniec aktualizacji */}

        <footer className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
          Scores stored in database. <br />© {new Date().getFullYear()} Quiz Win
        </footer>
      </div>
    </main>
  );
}
