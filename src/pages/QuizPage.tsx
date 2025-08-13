import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

export default function QuizPage() {
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
          console.log("cji");
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

    const timeout = setTimeout(fetchData, 5000); // opóźnienie 1 sekundy
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      const current = questions[currentIndex];
      const all = [...current.incorrect_answers, current.correct_answer];
      setAnswers(shuffle(all));
    }
  }, [questions, currentIndex]);

  function saveScore() {
    const playerName = localStorage.getItem("quiz-player-name") || "Gracz";
    const existing = JSON.parse(localStorage.getItem("quiz-scores") || "[]");
    const newScore = {
      name: playerName,
      score,
      date: new Date().toISOString(),
    };
    localStorage.setItem(
      "quiz-scores",
      JSON.stringify([newScore, ...existing])
    );
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
        Ładowanie pytań...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-700 p-6 text-center bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 ">
        <div>
          <h2 className="text-2xl font-bold mb-4">Błąd</h2>
          <p>{error}</p>
        </div>
      </div>
    );

  if (finished)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 p-6 text-center">
        <h2 className="text-4xl font-bold mb-4 text-slate-800 dark:text-slate-100">
          Koniec!
        </h2>
        <p className="text-2xl mb-6 text-slate-700 dark:text-slate-200">
          Twój wynik: {score} / {questions.length}
        </p>

        <NavLink to={"/"}>
          <button
            className="
        bg-gradient-to-r dark:from-slate-500 dark:to-gray-800 from-blue-500 to-blue-900
        text-white font-semibold
        py-3 px-6
        rounded-xl
        shadow-lg
        transform transition-transform duration-200
        hover:scale-105 hover:shadow-2xl
        active:scale-95
      "
          >
            Zakończ quiz
          </button>
        </NavLink>
      </div>
    );

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 p-6 flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-100 text-center">
          Pytanie {currentIndex + 1} z {questions.length}
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
