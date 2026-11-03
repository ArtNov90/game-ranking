import { useEffect, useState } from "react";
import type { Game } from "../types";
import { fetchGames } from "../api/games";
import { GameCard } from "../components/GameCard";

export function RankingPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGames("COMPLETED")
      .then(setGames)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-3xl font-bold">Classement</h1>

      {loading && <p>Chargement…</p>}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && !error && games.length === 0 && (
        <p className="text-slate-400">Aucun jeu terminé pour l'instant.</p>
      )}

      <div className="flex flex-col gap-4">
        {games.map((game, index) => (
          <GameCard key={game.id} game={game} rank={index + 1} />
        ))}
      </div>
    </div>
  );
}