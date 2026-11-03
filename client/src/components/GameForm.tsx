import { useState } from "react";
import type { FormEvent } from "react";
import type { Game, GameInput, GameStatus, Platform, RawgResult } from "../types";
import { createGame, updateGame } from "../api/games";
import { STATUS_LABELS, STATUS_ORDER, formatScore, inputClass, toGameInput } from "../utils";
import { RawgSearch } from "./RawgSearch";

type Props = {
  game?: Game;          // présent = modification, absent = ajout
  status: GameStatus;   // statut de départ du formulaire
  onSaved: (game: Game) => void;
  onCancel: () => void;
};

function emptyForm(status: GameStatus): GameInput {
  return {
    title: "",
    platform: "PS5",
    status,
    playTimeHours: null,
    storyScore: null,
    gameplayScore: null,
    artScore: null,
    review: null,
    rawgId: null,
    coverUrl: null,
  };
}

export function GameForm({ game, status, onSaved, onCancel }: Props) {
  const [form, setForm] = useState<GameInput>(() =>
    game ? { ...toGameInput(game), status } : emptyForm(status)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof GameInput>(field: K, value: GameInput[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSelect(result: RawgResult) {
    setForm((current) => ({
      ...current,
      title: result.title,
      rawgId: result.rawgId,
      coverUrl: result.coverUrl,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const saved = game ? await updateGame(game.id, form) : await createGame(form);
      onSaved(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSaving(false);
    }
  }

  const isCompleted = form.status === "COMPLETED";
  const { storyScore, gameplayScore, artScore } = form;
  const average =
    storyScore !== null && gameplayScore !== null && artScore !== null
      ? (storyScore + gameplayScore + artScore) / 3
      : null;

  return (
    <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-5 rounded-xl bg-slate-800 p-6">
      <h2 className="text-xl font-semibold">
        {game ? `Modifier « ${game.title} »` : "Ajouter un jeu"}
      </h2>

      {!game && <RawgSearch onSelect={handleSelect} />}

      <div className="flex items-end gap-4">
        {form.coverUrl && (
          <img src={form.coverUrl} alt={form.title} className="h-20 w-32 rounded-lg object-cover" />
        )}
        <label className="flex flex-1 flex-col gap-1">
          <span className="text-sm text-slate-400">Titre</span>
          <input
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            className={inputClass}
          />
        </label>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-slate-400">Plateforme</span>
          <select
            value={form.platform}
            onChange={(e) => updateField("platform", e.target.value as Platform)}
            className={inputClass}
          >
            <option value="PS5">PS5</option>
            <option value="XBOX">Xbox</option>
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-slate-400">Statut</span>
          <select
            value={form.status}
            onChange={(e) => updateField("status", e.target.value as GameStatus)}
            className={inputClass}
          >
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </label>

        <NumberField
          label="Temps de jeu (heures)"
          value={form.playTimeHours}
          onChange={(v) => updateField("playTimeHours", v)}
        />
      </div>

      {isCompleted && (
        <>
          <div className="grid grid-cols-3 gap-4">
            <NumberField label="Histoire /20" max={20} value={form.storyScore} onChange={(v) => updateField("storyScore", v)} />
            <NumberField label="Gameplay /20" max={20} value={form.gameplayScore} onChange={(v) => updateField("gameplayScore", v)} />
            <NumberField label="Direction artistique /20" max={20} value={form.artScore} onChange={(v) => updateField("artScore", v)} />
          </div>

          <p className="text-slate-300">
            Note totale :{" "}
            <span className="text-2xl font-bold text-emerald-400">
              {average !== null ? formatScore(average) : "–"}
            </span>
            /20
          </p>
        </>
      )}

      <label className="flex flex-col gap-1">
        <span className="text-sm text-slate-400">Mon avis</span>
        <textarea
          rows={4}
          value={form.review ?? ""}
          onChange={(e) => updateField("review", e.target.value || null)}
          className={inputClass}
        />
      </label>

      {error && <p className="text-red-400">{error}</p>}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-slate-300 hover:bg-slate-700"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={saving || !form.title.trim()}
          className="rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-slate-900 hover:bg-emerald-400 disabled:opacity-50"
        >
          {saving ? "Enregistrement…" : game ? "Enregistrer" : "Ajouter"}
        </button>
      </div>
    </form>
  );
}

type NumberFieldProps = {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  max?: number;
};

// Champ numérique qui accepte d'être vide (null)
function NumberField({ label, value, onChange, max }: NumberFieldProps) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-slate-400">{label}</span>
      <input
        type="number"
        min={0}
        max={max}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
        className={inputClass}
      />
    </label>
  );
}