import type { Game, GameInput, GameStatus } from "./types";

export function formatScore(score: number) {
  return score.toLocaleString("fr-FR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

// Style commun à tous les champs du formulaire
export const inputClass =
  "rounded-lg bg-slate-700 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-emerald-400";

// L'ordre des colonnes, et les libellés affichés
export const STATUS_ORDER: GameStatus[] = ["BACKLOG", "IN_PROGRESS", "COMPLETED"];

export const STATUS_LABELS: Record<GameStatus, string> = {
  BACKLOG: "À faire",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminé",
};

// Transforme un jeu reçu de l'API en données à renvoyer à l'API
export function toGameInput(game: Game): GameInput {
  return {
    title: game.title,
    platform: game.platform,
    status: game.status,
    playTimeHours: game.playTimeHours,
    storyScore: game.storyScore,
    gameplayScore: game.gameplayScore,
    artScore: game.artScore,
    review: game.review,
    rawgId: game.rawgId,
    coverUrl: game.coverUrl,
  };
}