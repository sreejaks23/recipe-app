import { useEffect, useState } from "react";
import { fetchOptions, searchMeals } from "./api";
import { useDebounce, useFavorites } from "./hooks";
import type { Filters, Meal } from "./types";
import RecipeCard from "./components/RecipeCard";
import RecipeModal from "./components/RecipeModal";

const empty: Filters = { q: "", category: "", area: "", ingredient: "" };
const selectCls = "w-full rounded-xl border border-ink/15 bg-white px-3 py-2.5";

export default function App() {
  const [filters, setFilters] = useState<Filters>(empty);
  const [options, setOptions] = useState({ categories: [] as string[], areas: [] as string[], ingredients: [] as string[] });
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Meal | null>(null);
  const [showFavs, setShowFavs] = useState(false);
  const { favorites, isFavorite, toggle } = useFavorites();

  const q = useDebounce(filters.q);
  const { category, area, ingredient } = filters;

  useEffect(() => { fetchOptions().then(setOptions).catch(() => setError("Could not load filter options.")); }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    searchMeals({ q, category, area, ingredient })
      .then((r) => !cancelled && setMeals(r))
      .catch(() => !cancelled && setError("Could not load recipes. Check your connection and try again."))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [q, category, area, ingredient]);

  const set = (k: keyof Filters) => (v: string) => setFilters((f) => ({ ...f, [k]: v }));
  const visible = showFavs ? favorites : meals;
  const goHome = () => { setShowFavs(false); setSelected(null); setFilters(empty); window.scrollTo({ top: 0 }); };
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="min-h-screen">
      <header className="bg-leaf text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-4 py-10 sm:px-6">
          <div>
            <h1>
              <button onClick={goHome} className="text-4xl font-extrabold tracking-tight sm:text-6xl">RecipeHub</button>
            </h1>
            <p className="mt-2 text-white/80">Search by dish, then narrow by category, cuisine or ingredient.</p>
          </div>
          <nav aria-label="Main" className="flex gap-2">
            <button
              onClick={goHome}
              aria-current={!showFavs ? "page" : undefined}
              className={`rounded-full px-5 py-2.5 font-semibold transition ${!showFavs ? "bg-saffron text-ink" : "bg-white/15 hover:bg-white/25"}`}
            >
              Home
            </button> 
            <button
              onClick={() => setShowFavs(true)}
              aria-current={showFavs ? "page" : undefined}
              className={`rounded-full px-5 py-2.5 font-semibold transition ${showFavs ? "bg-saffron text-ink" : "bg-white/15 hover:bg-white/25"}`}
            >
              Favorites ({favorites.length})
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {!showFavs && (
          <section aria-label="Search and filters" className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">
            <input
              type="search"
              value={filters.q}
              onChange={(e) => set("q")(e.target.value)}
              placeholder="Search recipes, e.g. chicken, pasta"
              aria-label="Search recipes"
              className={`${selectCls} sm:col-span-2 lg:col-span-1`}
            />
            <select aria-label="Category" value={category} onChange={(e) => set("category")(e.target.value)} className={selectCls}>
              <option value="">All categories</option>
              {options.categories.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select aria-label="Cuisine" value={area} onChange={(e) => set("area")(e.target.value)} className={selectCls}>
              <option value="">All cuisines</option>
              {options.areas.map((a) => <option key={a}>{a}</option>)}
            </select>
            <select aria-label="Ingredient" value={ingredient} onChange={(e) => set("ingredient")(e.target.value)} className={selectCls}>
              <option value="">Any ingredient</option>
              {options.ingredients.map((i) => <option key={i}>{i}</option>)}
            </select>
            <button onClick={() => setFilters(empty)} disabled={!hasFilters} className="rounded-xl px-4 py-2.5 font-semibold text-leaf underline disabled:opacity-40">
              Clear
            </button>
          </section>
        )}

        {error && <p role="alert" className="mb-6 rounded-xl bg-red-100 p-4 text-red-800">{error}</p>}

        {loading && !showFavs ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-busy="true">
            {Array.from({ length: 8 }, (_, i) => <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-ink/10" />)}
          </div>
        ) : visible.length === 0 ? (
          <p className="py-20 text-center text-lg text-ink/60">
            {showFavs ? "No favorites yet. Tap the heart on a recipe to save it." : "No recipes match. Try a different keyword or clear a filter."}
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((m) => (
              <RecipeCard key={m.id} meal={m} favorite={isFavorite(m.id)} onOpen={() => setSelected(m)} onToggleFavorite={() => toggle(m)} />
            ))}
          </div>
        )}
      </main>

      {selected && (
        <RecipeModal meal={selected} favorite={isFavorite(selected.id)} onClose={() => setSelected(null)} onToggleFavorite={() => toggle(selected)} />
      )}
    </div>
  );
}
