import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

interface question {
  question: String;
  correct: String;
  chossen: String;
}

const API_URL = import.meta.env.VITE_API_URL;
export default function QuizPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [ans, setAns] = useState<question[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      fetch("https://opentdb.com/api.php?amount=10&type=multiple")
        .then((data) => {
          if (!data.ok) {
            throw new Error(`Blad HTTP: ${data.status}`);
          }

          return data.json();
        })
        .then((r) => {
          if (!r.results || r.results.length === 0) {
            throw new Error(`blad HTTP:${r.status}`);
          }
          setQuestions(r.results);
          setLoading(false);
        })
        .catch((err) => {
          console.log(`blad ${err}`);
          setError("Blad pobrania danych z API. Spróbuj ponownie pózniej");
          setLoading(false);
        });
    };

    const timeout = setTimeout(fetchData, 3000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      const current = questions[currentIndex];
      const all = [...current.incorrect_answers, current.correct_answer];
      setAnswers(shuffle(all));
    }
  }, [questions, currentIndex]);

  // PODMIENIONA FUNKCJA
  async function saveScore() {
    const playerName = localStorage.getItem("quiz-player-name") || "Gracz";
    const newScore = {
      name: playerName,
      score: score, // Pobiera 'score' ze stanu komponentu
    };

    try {
      await fetch(`${API_URL}api/scores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newScore),
      });
    } catch (err) {
      console.error("Nie udało się zapisać wyniku do API:", err);
    }
  }

  function shuffle(array: string[]) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function handleAnswer(answer: string) {
    const currentQuestion = questions[currentIndex];
    setAns((prev) => [
      ...prev,
      {
        question: currentQuestion.question,
        correct: currentQuestion.correct_answer,
        chossen: answer,
      },
    ]);

    if (answer === currentQuestion.correct_answer) {
      setScore((prev) => prev + 1);
    }

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setFinished(true);
      saveScore();
    }
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
        Loading questions...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-700 p-6 text-center bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 ">
        <div>
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );

  if (finished)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 p-6 text-center">
        {/* Modal */}
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Tło przyciemnione */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            ></div>

            {/* Okno */}
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 max-w-2xl w-full z-10 overflow-y-auto max-h-[80vh]">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                Your answers
              </h2>
              <div className="space-y-4">
                {ans.map((a, idx) => (
                  <div
                    key={idx}
                    className="border rounded-lg p-4 shadow-sm bg-slate-50 dark:bg-slate-800"
                  >
                    <h3
                      className="font-semibold text-slate-700 dark:text-slate-200"
                      dangerouslySetInnerHTML={{ __html: a.question }}
                    />
                    <p className="mt-2 text-green-600 dark:text-green-400">
                      ✅ Correct: {a.correct}
                    </p>
                    <p
                      className={`mt-1 ${
                        a.chossen === a.correct
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {a.chossen === a.correct
                        ? "✔️ Your answers was correct"
                        : `❌ You chosse: ${a.chossen}`}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="mt-6 px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-800 text-white font-semibold shadow hover:scale-105 transition-transform"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Podsumowanie */}
        <h2 className="text-4xl font-bold mb-4 text-slate-800 dark:text-slate-100">
          End!
        </h2>
        <p className="text-2xl mb-6 text-slate-700 dark:text-slate-200">
          Your score: {score} / {questions.length}
        </p>

        <div className="flex justify-between">
          <NavLink to={"/"}>
            <button
              className="mr-2 bg-gradient-to-r dark:from-slate-500 dark:to-gray-800 from-blue-500 to-blue-900
          text-white font-semibold py-3 px-6 rounded-xl shadow-lg
          transform transition-transform duration-200 hover:scale-105 hover:shadow-2xl active:scale-95"
            >
              Zakończ quiz
            </button>
          </NavLink>

          <button
            onClick={() => setIsOpen(true)}
            className="ml-2 bg-gradient-to-r dark:from-blue-500 dark:to-indigo-800 from-blue-500 to-blue-900
          text-white font-semibold py-3 px-6 rounded-xl shadow-lg
          transform transition-transform duration-200 hover:scale-105 hover:shadow-2xl active:scale-95"
          >
            check answers
          </button>
        </div>
      </div>
    );

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 p-6 flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-100 text-center">
          Question {currentIndex + 1} z {questions.length}
        </h2>

        <p
          className="mb-10 text-lg text-slate-700 dark:text-slate-300 text-center"
          dangerouslySetInnerHTML={{ __html: questions[currentIndex].question }}
        />

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {answers.map((ans, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(ans)}
              className="px-6 py-3 border border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-sky-100 dark:hover:bg-sky-900 transition-colors duration-200 shadow-sm  "
              dangerouslySetInnerHTML={{ __html: ans }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
