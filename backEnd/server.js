// backEnd/server.js
import express from "express";
import cors from "cors";
import "dotenv/config";
import { PrismaClient } from "@prisma/client"; // Importuj klienta Prismy

const app = express();
const port = process.env.PORT || 5000;

const prisma = new PrismaClient(); // Stwórz instancję klienta

// Konfiguracja CORS gotowa na produkcję
const allowedOrigins = [
  "http://localhost:5173", // Dla developmentu
  "https://quizgame-flax.vercel.app", // WAŻNE: Wstaw tu swój prawdziwy adres z Vercel
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Zezwól na żądania bez 'origin' (np. Postman lub testy serwera)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "Polityka CORS dla tej strony nie zezwala na dostęp z tego adresu.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

app.use(express.json());

// ... reszta kodu API ...
// --- API z użyciem PRISMY ---

// 1. Endpoint do POBIERANIA wyników
app.get("/api/scores", async (req, res) => {
  try {
    // Zamiast SQL -> czyste API Prismy!
    const scores = await prisma.scores.findMany({
      take: 20, // Weź 20 najlepszych
      orderBy: [
        { score: "desc" }, // Sortuj po wyniku malejąco
        { date: "desc" }, // Potem po dacie malejąco
      ],
    });
    res.json(scores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd serwera przy pobieraniu wyników" });
  }
});

// 2. Endpoint do ZAPISYWANIA nowego wyniku
app.post("/api/scores", async (req, res) => {
  try {
    const { name, score } = req.body;

    if (!name || typeof score !== "number") {
      return res.status(400).json({ error: "Nieprawidłowe dane" });
    }

    // Zamiast INSERT INTO... -> czyste API Prismy!
    const newScore = await prisma.scores.create({
      data: {
        name: name,
        score: score,
        // 'date' ustawi się automatycznie dzięki @default(now()) w schemacie
      },
    });

    res.status(201).json(newScore);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd serwera przy zapisywaniu wyniku" });
  }
});

// Uruchomienie serwera
app.listen(port, () => {
  console.log(`Serwer backendu działa na http://localhost:${port}`);
});
