import type { Game, GameInput, GameStatus, RawgResult } from "../types";

// Extrait un message lisible d'une réponse en erreur
async function errorMessage(response: Response, fallback: string) {
  const data = await response.json().catch(() => null);
  const messages = data?.details?.map((d: { message: string }) => d.message);
  return messages?.join(" · ") ?? data?.error ?? fallback;
}

export async function fetchGames(status?: GameStatus): Promise<Game[]> {
  const url = status ? `/api/games?status=${status}` : "/api/games";
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Impossible de charger les jeux");
  }
  return response.json();
}

export async function fetchGame(id: number): Promise<Game> {
  const response = await fetch(`/api/games/${id}`);
  if (response.status === 404) {
    throw new Error("Ce jeu n'existe pas.");
  }
  if (!response.ok) {
    throw new Error("Impossible de charger le jeu.");
  }
  return response.json();
}

export async function createGame(input: GameInput): Promise<Game> {
  const response = await fetch("/api/games", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw new Error(await errorMessage(response, "Impossible d'ajouter le jeu"));
  }
  return response.json();
}

export async function updateGame(id: number, input: GameInput): Promise<Game> {
  const response = await fetch(`/api/games/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw new Error(await errorMessage(response, "Impossible de modifier le jeu"));
  }
  return response.json();
}

export async function searchRawg(query: string): Promise<RawgResult[]> {
  const response = await fetch(`/api/rawg/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error("Recherche RAWG impossible");
  }
  return response.json();
}

export async function deleteGame(id: number): Promise<void> {
  const response = await fetch(`/api/games/${id}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error(await errorMessage(response, "Impossible de supprimer le jeu"));
  }
}