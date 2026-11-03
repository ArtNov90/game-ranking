import { Router } from "express";

const router = Router();

const RAWG_URL = "https://api.rawg.io/api/games";

// Ce que RAWG nous renvoie (uniquement les champs qui nous intéressent)
type RawgGame = {
  id: number;
  name: string;
  released: string | null;
  background_image: string | null;
};

type RawgResponse = {
  results: RawgGame[];
};

// GET /api/rawg/search?q=elden
router.get("/search", async (req, res) => {
  const query = typeof req.query.q === "string" ? req.query.q.trim() : "";
  if (query.length < 2) {
    res.status(400).json({ error: "Tape au moins 2 caractères" });
    return;
  }

  const apiKey = process.env.RAWG_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Clé RAWG manquante dans le fichier .env" });
    return;
  }

  // Construction de l'URL : https://api.rawg.io/api/games?key=...&search=...&page_size=5
  const url = new URL(RAWG_URL);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("search", query);
  url.searchParams.set("page_size", "5");

  try {
    const response = await fetch(url);
    if (!response.ok) {
      res.status(502).json({ error: "RAWG a renvoyé une erreur" });
      return;
    }

    const data = (await response.json()) as RawgResponse;

    // On ne garde que ce dont l'appli a besoin
    const results = data.results.map((game) => ({
      rawgId: game.id,
      title: game.name,
      coverUrl: game.background_image,
      released: game.released,
    }));

    res.json(results);
  } catch {
    res.status(502).json({ error: "Impossible de joindre RAWG" });
  }
});

export default router;