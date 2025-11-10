// backEnd/server.js
import express from "express";
import cors from "cors";
import "dotenv/config";
import { PrismaClient } from "@prisma/client"; // Importuj klienta Prismy

const app = express();
const port = process.env.PORT || 5000;

const prisma = new PrismaClient(); // Stwórz instancję klienta

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Wciąż potrzebne dla deweloperki
  })
);
app.use(express.json());

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
