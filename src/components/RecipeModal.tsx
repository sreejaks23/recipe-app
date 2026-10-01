import { useEffect } from "react";
import type { Meal } from "../types";

interface Props { meal: Meal; favorite: boolean; onClose: () => void; onToggleFavorite: () => void }

export default function RecipeModal({ meal, favorite, onClose, onToggleFavorite }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/60 sm:p-6" onClick={onClose} role="dialog" aria-modal="true" aria-label={meal.name}>
      <div className="mx-auto max-w-5xl bg-paper p-5 sm:rounded-3xl sm:p-8" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="mb-5 font-semibold text-leaf underline">Back to recipes</button>

        <div className="grid gap-8 md:grid-cols-[320px_minmax(0,1fr)] md:items-start">
          {/* Left: image + quick facts */}
          <div className="md:sticky md:top-0">
            <img src={meal.thumb} alt={meal.name} className="aspect-square w-full max-w-xs rounded-2xl object-cover shadow-md ring-1 ring-ink/10 md:max-w-none" />
            <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
              <div className="rounded-xl bg-white p-3 ring-1 ring-ink/10"><dt className="text-ink/60">Category</dt><dd className="font-semibold">{meal.category || "-"}</dd></div>
              <div className="rounded-xl bg-white p-3 ring-1 ring-ink/10"><dt className="text-ink/60">Cuisine</dt><dd className="font-semibold">{meal.area || "-"}</dd></div>
              <div className="rounded-xl bg-white p-3 ring-1 ring-ink/10"><dt className="text-ink/60">Items</dt><dd className="font-semibold">{meal.ingredients.length}</dd></div>
            </dl>
          </div>

          {/* Right: details */}
          <div>
            <h2 className="text-3xl font-extrabold sm:text-4xl">{meal.name}</h2>
            {meal.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                {meal.tags.map((t) => <span key={t} className="rounded-full bg-ink/10 px-3 py-1">{t}</span>)}
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={onToggleFavorite}
                aria-pressed={favorite}
                className={`rounded-full px-6 py-3 font-semibold transition ${favorite ? "bg-saffron text-ink" : "bg-leaf text-white hover:bg-leaf/90"}`}
              >
                {favorite ? "Saved to favorites" : "Save to favorites"}
              </button>
              {meal.youtube && (
                <a href={meal.youtube} target="_blank" rel="noreferrer" className="rounded-full border-2 border-leaf px-6 py-3 font-semibold text-leaf hover:bg-leaf/5">
                  Watch video
                </a>
              )}
            </div>

            <section className="mt-8">
              <h3 className="mb-3 text-xl font-semibold">Ingredients</h3>
              <ul className="grid gap-x-6 sm:grid-cols-2">
                {meal.ingredients.map((i) => (
                  <li key={i.name} className="flex justify-between gap-3 border-b border-ink/10 py-2 text-sm">
                    <span>{i.name}</span>
                    <span className="text-ink/60">{i.measure}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-8">
              <h3 className="mb-3 text-xl font-semibold">Instructions</h3>
              <div className="max-w-prose space-y-3 leading-relaxed">
                {meal.instructions.split(/\r?\n/).filter((p) => p.trim()).map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
