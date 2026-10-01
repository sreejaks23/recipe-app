import { useEffect } from "react";
import type { Meal } from "../types";
import HeartButton from "./HeartButton";

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/60 p-0 sm:p-6" onClick={onClose} role="dialog" aria-modal="true" aria-label={meal.name}>
      <div className="mx-auto max-w-4xl overflow-hidden bg-paper sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <img src={meal.thumb} alt={meal.name} className="h-64 w-full object-cover sm:h-80" />
          <button onClick={onClose} className="absolute top-4 left-4 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold shadow hover:bg-white">
            Back to recipes
          </button>
          <HeartButton active={favorite} onClick={onToggleFavorite} className="absolute top-4 right-4" />
        </div>

        <div className="p-6 sm:p-10">
          <h2 className="text-3xl font-extrabold sm:text-4xl">{meal.name}</h2>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            {meal.category && <span className="rounded-full bg-leaf px-3 py-1 text-white">{meal.category}</span>}
            {meal.area && <span className="rounded-full bg-saffron px-3 py-1 font-semibold">{meal.area}</span>}
            {meal.tags.map((t) => <span key={t} className="rounded-full bg-ink/10 px-3 py-1">{t}</span>)}
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            z<section>
              <h3 className="mb-3 text-xl font-semibold">Ingredients</h3>
              <ul className="divide-y divide-ink/10 rounded-xl bg-white ring-1 ring-ink/10">
                {meal.ingredients.map((i) => (
                  <li key={i.name} className="flex justify-between gap-3 px-4 py-2 text-sm">
                    <span>{i.name}</span>
                    <span className="text-ink/60">{i.measure}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className="mb-3 text-xl font-semibold">Instructions</h3>
              <div className="max-w-prose space-y-3 leading-relaxed">
                {meal.instructions.split(/\r?\n/).filter((p) => p.trim()).map((p, i) => <p key={i}>{p}</p>)}
              </div>
              {meal.youtube && (
                <a href={meal.youtube} target="_blank" rel="noreferrer" className="mt-6 inline-block rounded-full bg-leaf px-5 py-2.5 font-semibold text-white hover:bg-leaf/90">
                  Watch the video
                </a>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
