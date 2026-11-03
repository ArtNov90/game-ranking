import { Link } from "react-router";
import type { Game } from "../types";
import { formatScore } from "../utils";

type Props = {
  game: Game;
  rank: number;
};

export function GameCard({ game, rank }: Props) {
  return (
    <Link
      to={`/jeux/${game.id}`}
      className="flex items-center gap-4 rounded-xl bg-slate-800 p-4 transition hover:bg-slate-700"
    >
      <span className="w-10 text-2xl font-bold text-slate-500">#{rank}</span>

      {game.coverUrl ? (
        <img
          src={game.coverUrl}
          alt={game.title}
          className="h-24 w-40 rounded-lg object-cover"
        />
      ) : (
        <div className="flex h-24 w-40 items-center justify-center rounded-lg bg-slate-700 text-sm text-slate-400">
          Pas d'image
        </div>
      )}

      <div className="flex-1">
        <h2 className="text-lg font-semibold">{game.title}</h2>
        <p className="text-sm text-slate-400">
          {game.platform}
          {game.playTimeHours !== null && ` · ${game.playTimeHours} h`}
        </p>
        {game.totalScore !== null && (
          <p className="mt-2 text-sm text-slate-300">
            Histoire {game.storyScore} · Gameplay {game.gameplayScore} · DA {game.artScore}
          </p>
        )}
      </div>

      {game.totalScore !== null && (
        <div className="text-right">
          <span className="text-3xl font-bold text-emerald-400">
            {formatScore(game.totalScore)}
          </span>
          <span className="text-slate-400">/20</span>
        </div>
      )}
    </Link>
  );
}