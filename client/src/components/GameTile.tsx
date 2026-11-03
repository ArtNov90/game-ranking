import type { Game, GameStatus } from "../types";
import { Link } from "react-router";
import { STATUS_LABELS, STATUS_ORDER, formatScore } from "../utils";

type Props = {
  game: Game;
  onStatusChange: (game: Game, status: GameStatus) => void;
  onEdit: (game: Game) => void;
};

export function GameTile({ game, onStatusChange, onEdit }: Props) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg bg-slate-800">
      {game.coverUrl ? (
        <img src={game.coverUrl} alt={game.title} className="h-28 w-full object-cover" />
      ) : (
        <div className="flex h-28 items-center justify-center bg-slate-700 text-sm text-slate-400">
          Pas d'image
        </div>
      )}

      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/jeux/${game.id}`} className="font-semibold leading-tight hover:underline">
          {game.title}
          </Link>
          {game.totalScore !== null && (
            <span className="font-bold text-emerald-400">{formatScore(game.totalScore)}</span>
          )}
        </div>

        <p className="text-sm text-slate-400">
          {game.platform}
          {game.playTimeHours !== null && ` · ${game.playTimeHours} h`}
        </p>

        <div className="flex gap-2">
          <select
            value={game.status}
            onChange={(e) => onStatusChange(game, e.target.value as GameStatus)}
            className="flex-1 rounded-md bg-slate-700 px-2 py-1 text-sm"
          >
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => onEdit(game)}
            className="rounded-md px-2 py-1 text-sm text-slate-300 hover:bg-slate-700"
          >
            Modifier
          </button>
        </div>
      </div>
    </article>
  );
}