import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

type Score = {
  name: string;
  score: number;
  date: string;
};
const API_URL = import.meta.env.VITE_API_URL;
export default function QuizHomePage() {
  const [recentScores, setRecentScores] = useState<Score[]>([]);
  const [name, setName] = useState("Player");

  useEffect(() => {
    const fetchRecentScores = async () => {
      try {
        const res = await fetch(`${API_URL}/api/scores`);

        if (!res.ok) {
          throw new Error("Error fetching scores");
        }

        const parsed: Score[] = await res.json();

        setRecentScores(parsed.slice(0, 5));
      } catch (e) {
        console.error("Error loading scores:", e);
        setRecentScores([]);
      }
    };

    fetchRecentScores();
  }, []);

  function handleStart() {
    localStorage.setItem("quiz-player-name", name || "Player");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 py-12 px-6 md:px-12 dark:text-white  transition">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-12">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight ">
            Quiz Win
          </h1>
          <nav className="flex items-center gap-4">
            <NavLink to={"/"}>
              {" "}
              <h2>Home</h2>
            </NavLink>
            <NavLink to={"/quiz"}>
              {" "}
              <h2 onClick={handleStart}>Start</h2>
            </NavLink>
            <NavLink to={"/leaderboard"}>
              {" "}
              <h2>Leaderboard</h2>
            </NavLink>
          </nav>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="p-6 rounded-2xl shadow-md bg-white dark:bg-slate-900"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready for challenge?
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Take the quiz, aim for the high score, and fight for your place on
              the leaderboard. You'll get a new set of questions every time you
              play!
            </p>

            <div className="flex gap-3 items-center mb-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="border rounded-lg px-3 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <NavLink to={"/quiz"}>
                {" "}
                <button
                  onClick={handleStart}
                  className="px-5 py-2 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 transition"
                >
                  Start
                </button>
              </NavLink>
              <ThemeToggle />
            </div>

            <ul className="text-sm text-slate-500 dark:text-slate-400 space-y-2">
              <li>• Various categories and difficulty levels</li>
              <li>• Scores saved to database</li>
            </ul>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="p-6 rounded-2xl bg-gradient-to-b from-sky-50 to-white dark:from-slate-800 dark:to-slate-900 shadow-md"
          >
            <h3 className="text-xl font-semibold mb-3">Recent scores</h3>
            {recentScores.length === 0 ? (
              <p className="text-sm text-slate-500">
                No saved scores — take the quiz to see your ranking.
              </p>
            ) : (
              <ol className="space-y-3">
                {recentScores.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-lg p-3 border"
                  >
                    <div>
                      <div className="text-sm font-medium">{s.name}</div>
                      <div className="text-xs text-slate-500">
                        {new Date(s.date).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-lg font-bold">{s.score} pts</div>
                  </li>
                ))}
              </ol>
            )}

            <div className="mt-6 text-xs text-slate-500">
              Scores stored in database.
            </div>
          </motion.aside>
        </section>

        <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.article
            whileHover={{ y: -6 }}
            className="p-6 rounded-xl bg-white dark:bg-slate-900 shadow"
          >
            <h4 className="font-semibold mb-2">Quick Mode</h4>
            <p className="text-sm text-slate-500">
              Short 10-question quiz — perfect for a quick knowledge check.
            </p>
          </motion.article>

          <motion.article
            whileHover={{ y: -6 }}
            className="p-6 rounded-xl bg-white dark:bg-slate-900 shadow"
          >
            <h4 className="font-semibold mb-2">Training Mode (planned)</h4>
            <p className="text-sm text-slate-500">
              No time limit, with hints and explanations after each question.
            </p>
          </motion.article>

          <motion.article
            whileHover={{ y: -6 }}
            className="p-6 rounded-xl bg-white dark:bg-slate-900 shadow"
          >
            <h4 className="font-semibold mb-2">Multiplayer (planned)</h4>
            <p className="text-sm text-slate-500">
              Compete with friends — real-time implementation coming next.
            </p>
          </motion.article>
        </section>

        <footer className="mt-12 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Quiz Win — built with React and Tailwind.
          Code on GitHub:
          <a href="https://github.com/caps-ctrl" className="hover:underline">
            https://github.com/caps-ctrl
          </a>
        </footer>
      </div>
    </main>
  );
}
