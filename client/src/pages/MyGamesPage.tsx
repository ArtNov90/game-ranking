import { useEffect, useState } from "react";
import type { Game, GameStatus } from "../types";
import { fetchGames, updateGame } from "../api/games";
import { GameForm } from "../components/GameForm";
import { GameTile } from "../components/GameTile";
import { STATUS_LABELS, STATUS_ORDER, toGameInput } from "../utils";

// Ce que le formulaire doit afficher, ou null s'il est fermé
type FormConfig = {
  game?: Game;
  status: GameStatus;
};

export function MyGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null);

  useEffect(() => {
    fetchGames()
      .then(setGames)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Remplace (ou ajoute) un jeu dans la liste, en le plaçant en tête
  function replaceGame(saved: Game) {
    setGames((current) => [saved, ...current.filter((g) => g.id !== saved.id)]);
  }

  function openForm(config: FormConfig) {
    setFormConfig(config);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSaved(saved: Game) {
    replaceGame(saved);
    setFormConfig(null);
  }

    function handleDeleted(id: number) {
    setGames((current) => current.filter((g) => g.id !== id));
    setFormConfig(null);
  }

  async function handleStatusChange(game: Game, status: GameStatus) {
    // Passer en "Terminé" demande des notes : on ouvre le formulaire
    if (status === "COMPLETED") {
      openForm({ game, status });
      return;
    }

    try {
      const saved = await updateGame(game.id, { ...toGameInput(game), status });
      replaceGame(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mes jeux</h1>
        {!formConfig && (
          <button
            onClick={() => openForm({ status: "BACKLOG" })}
            className="rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-slate-900 hover:bg-emerald-400"
          >
            + Ajouter un jeu
          </button>
        )}
      </div>

      {formConfig && (
        <GameForm
          key={formConfig.game?.id ?? "new"}
          game={formConfig.game}
          status={formConfig.status}
          onSaved={handleSaved}
           onDeleted={handleDeleted}
          onCancel={() => setFormConfig(null)}
        />
      )}

      {loading && <p>Chargement…</p>}
      {error && <p className="mb-4 text-red-400">{error}</p>}

      {!loading && (
        <div className="grid grid-cols-3 gap-6">
          {STATUS_ORDER.map((status) => {
            const columnGames = games.filter((g) => g.status === status);

            return (
              <section key={status} className="flex flex-col gap-3 rounded-xl bg-slate-800/50 p-4">
                <h2 className="flex items-center justify-between font-semibold">
                  {STATUS_LABELS[status]}
                  <span className="rounded-full bg-slate-700 px-2 text-sm">{columnGames.length}</span>
                </h2>

                {columnGames.length === 0 && (
                  <p className="text-sm text-slate-500">Aucun jeu</p>
                )}

                {columnGames.map((game) => (
                  <GameTile
                    key={game.id}
                    game={game}
                    onStatusChange={handleStatusChange}
                    onEdit={(g) => openForm({ game: g, status: g.status })}
                  />
                ))}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}