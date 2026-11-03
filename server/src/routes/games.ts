import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import type { Game } from "../../generated/prisma/client";

const router = Router();

// ---------- Validation ----------

const statusSchema = z.enum(["BACKLOG", "IN_PROGRESS", "COMPLETED"]);

const score = z
  .number()
  .int("La note doit être un nombre entier")
  .min(0, "La note doit être entre 0 et 20")
  .max(20, "La note doit être entre 0 et 20");

// Champs obligatoires pour un jeu terminé, avec leur libellé pour le message d'erreur
const requiredWhenCompleted = {
  playTimeHours: "Le temps de jeu",
  storyScore: "La note Histoire",
  gameplayScore: "La note Gameplay",
  artScore: "La note Direction artistique",
} as const;

const gameSchema = z
  .object({
    title: z.string().trim().min(1, "Le titre est obligatoire"),
    platform: z.enum(["XBOX", "PS5"]),
    status: statusSchema,
    playTimeHours: z
      .number()
      .int("Le temps de jeu doit être un nombre entier")
      .min(0, "Le temps de jeu ne peut pas être négatif")
      .nullish(),
    storyScore: score.nullish(),
    gameplayScore: score.nullish(),
    artScore: score.nullish(),
    review: z.string().max(5000).nullish(),
    coverUrl: z.url().nullish(),
    rawgId: z.number().int().nullish(),
    playedAt: z.coerce.date().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status !== "COMPLETED") return;

    for (const [field, label] of Object.entries(requiredWhenCompleted)) {
      const value = data[field as keyof typeof requiredWhenCompleted];
      if (value === null || value === undefined) {
        ctx.addIssue({
          code: "custom",
          path: [field],
          message: `${label} est obligatoire pour un jeu terminé`,
        });
      }
    }
  });

// ---------- Fonctions utilitaires ----------

// Note totale : moyenne sur 20, ou null si une note manque
function withTotal(game: Game) {
  const { storyScore, gameplayScore, artScore } = game;
  const hasAllScores = storyScore !== null && gameplayScore !== null && artScore !== null;

  const totalScore = hasAllScores
    ? Math.round(((storyScore + gameplayScore + artScore) / 3) * 10) / 10
    : null;

  return { ...game, totalScore };
}

// Transforme "12" (texte de l'URL) en 12, ou null si invalide
function parseId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// Met les erreurs Zod dans un format lisible
function formatErrors(error: z.ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}

// ---------- Routes ----------

// GET /api/games            : tous les jeux
// GET /api/games?status=... : seulement les jeux d'un statut
router.get("/", async (req, res) => {
  const filter = statusSchema.optional().safeParse(req.query.status);
  if (!filter.success) {
    res.status(400).json({ error: "Statut invalide" });
    return;
  }

  const games = await prisma.game.findMany({
    where: filter.data ? { status: filter.data } : {},
    orderBy: { updatedAt: "desc" },
  });

  const result = games.map(withTotal);

  // Les jeux terminés sont classés par note
  if (filter.data === "COMPLETED") {
    result.sort((a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0));
  }

  res.json(result);
});

// GET /api/games/:id : un seul jeu
router.get("/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Identifiant invalide" });
    return;
  }

  const game = await prisma.game.findUnique({ where: { id } });
  if (!game) {
    res.status(404).json({ error: "Jeu introuvable" });
    return;
  }

  res.json(withTotal(game));
});

// POST /api/games : ajouter un jeu
router.post("/", async (req, res) => {
  const result = gameSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: "Données invalides", details: formatErrors(result.error) });
    return;
  }

  const game = await prisma.game.create({ data: result.data });
  res.status(201).json(withTotal(game));
});

// PUT /api/games/:id : modifier un jeu
router.put("/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Identifiant invalide" });
    return;
  }

  const result = gameSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: "Données invalides", details: formatErrors(result.error) });
    return;
  }

  const existing = await prisma.game.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: "Jeu introuvable" });
    return;
  }

  const game = await prisma.game.update({ where: { id }, data: result.data });
  res.json(withTotal(game));
});

// DELETE /api/games/:id : supprimer un jeu
router.delete("/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Identifiant invalide" });
    return;
  }

  const existing = await prisma.game.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: "Jeu introuvable" });
    return;
  }

  await prisma.game.delete({ where: { id } });
  res.status(204).send();
});

export default router;