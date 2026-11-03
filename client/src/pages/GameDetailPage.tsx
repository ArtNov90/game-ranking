import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { Game } from "../types";
import { fetchGame } from "../api/games";
import { STATUS_LABELS, formatScore } from "../utils";

export function GameDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchGame(Number(id))
      .then(setGame)
      .catch((err: Error) => setError(err.message));
  }, [id]);

  return (
    <div className="mx-auto max-w-3xl">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 text-sm text-slate-400 hover:text-white"
      >
        ← Retour
      </button>

      {error && <p className="text-red-400">{error}</p>}
      {!game && !error && <p>Chargement…</p>}

      {game && (
        <article className="overflow-hidden rounded-xl bg-slate-800">
          {game.coverUrl ? (
            <img src={game.coverUrl} alt={game.title} className="h-72 w-full object-cover" />
          ) : (
            <div className="flex h-40 items-center justify-center bg-slate-700 text-slate-400">
              Pas d'image
            </div>
          )}

          <div className="flex flex-col gap-6 p-6">
            <header className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">{game.title}</h1>
                <p className="mt-1 text-slate-400">
                  {game.platform} · {STATUS_LABELS[game.status]}
                  {game.playTimeHours !== null && ` · ${game.playTimeHours} h`}
                </p>
              </div>

              {game.totalScore !== null && (
                <div className="shrink-0 text-right">
                  <span className="text-4xl font-bold text-emerald-400">
                    {formatScore(game.totalScore)}
                  </span>
                  <span className="text-slate-400">/20</span>
                </div>
              )}
            </header>

            {game.totalScore !== null && (
              <div className="grid grid-cols-3 gap-4">
                <ScoreBlock label="Histoire" score={game.storyScore} />
                <ScoreBlock label="Gameplay" score={game.gameplayScore} />
                <ScoreBlock label="Direction artistique" score={game.artScore} />
              </div>
            )}

            <section>
              <h2 className="mb-2 text-lg font-semibold">Mon avis</h2>
              {game.review ? (
                <p className="whitespace-pre-line leading-relaxed text-slate-300">{game.review}</p>
              ) : (
                <p className="text-slate-500">Pas encore d'avis.</p>
              )}
            </section>
          </div>
        </article>
      )}
    </div>
  );
}

type ScoreBlockProps = {
  label: string;
  score: number | null;
};

function ScoreBlock({ label, score }: ScoreBlockProps) {
  return (
    <div className="rounded-lg bg-slate-900 p-4 text-center">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold">
        {score ?? "–"}
        <span className="text-base text-slate-500">/20</span>
      </p>
    </div>
  );
}