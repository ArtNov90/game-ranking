import { useEffect, useState } from "react";
import type { RawgResult } from "../types";
import { searchRawg } from "../api/games";
import { inputClass } from "../utils";

type Props = {
  onSelect: (result: RawgResult) => void;
};

export function RawgSearch({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<RawgResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Lance la recherche 400 ms après la dernière frappe
  useEffect(() => {
    if (query.trim().length < 2) return;

    const timer = setTimeout(() => {
      setLoading(true);
      searchRawg(query)
        .then(setResults)
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  function handleSelect(result: RawgResult) {
    onSelect(result);
    setQuery("");
    setResults([]);
  }

  const showResults = query.trim().length >= 2;

  return (
    <div className="flex flex-col gap-2">
      <label className="flex flex-col gap-1">
        <span className="text-sm text-slate-400">Rechercher sur RAWG</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ex : Elden Ring"
          className={inputClass}
        />
      </label>

      {showResults && loading && <p className="text-sm text-slate-400">Recherche…</p>}

      {showResults && !loading && results.length > 0 && (
        <ul className="flex flex-col gap-1 rounded-lg bg-slate-900 p-2">
          {results.map((result) => (
            <li key={result.rawgId}>
              <button
                type="button"
                onClick={() => handleSelect(result)}
                className="flex w-full items-center gap-3 rounded-md p-2 text-left hover:bg-slate-700"
              >
                {result.coverUrl ? (
                  <img src={result.coverUrl} alt="" className="h-10 w-16 rounded object-cover" />
                ) : (
                  <div className="h-10 w-16 rounded bg-slate-700" />
                )}
                <span>{result.title}</span>
                {result.released && (
                  <span className="text-sm text-slate-400">({result.released.slice(0, 4)})</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}