export type Platform = "XBOX" | "PS5";
export type GameStatus = "BACKLOG" | "IN_PROGRESS" | "COMPLETED";

export type Game = {
  id: number;
  rawgId: number | null;
  title: string;
  coverUrl: string | null;
  platform: Platform;
  status: GameStatus;
  playTimeHours: number | null;
  storyScore: number | null;
  gameplayScore: number | null;
  artScore: number | null;
  review: string | null;
  playedAt: string;
  createdAt: string;
  updatedAt: string;
  totalScore: number | null;
};

// Ce qu'on envoie à l'API pour créer ou modifier un jeu
export type GameInput = {
  title: string;
  platform: Platform;
  status: GameStatus;
  playTimeHours: number | null;
  storyScore: number | null;
  gameplayScore: number | null;
  artScore: number | null;
  review: string | null;
  rawgId: number | null;
  coverUrl: string | null;
};

// Un résultat de recherche RAWG
export type RawgResult = {
  rawgId: number;
  title: string;
  coverUrl: string | null;
  released: string | null;
};