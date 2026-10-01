import type { Meal } from "../types";
import HeartButton from "./HeartButton";

interface Props { meal: Meal; favorite: boolean; onOpen: () => void; onToggleFavorite: () => void }

export default function RecipeCard({ meal, favorite, onOpen, onToggleFavorite }: Props) {
  return (
    <article className="group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/10 transition hover:shadow-lg">
      <button type="button" onClick={onOpen} className="block w-full text-left">
        <div className="aspect-square overflow-hidden bg-ink/5">
          <img src={`${meal.thumb}/medium`} alt={meal.name} loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-105" />
        </div>
        <div className="p-4">
          <h3 className="line-clamp-2 text-lg leading-snug font-semibold">{meal.name}</h3>
          <p className="mt-1 text-sm text-ink/60">{[meal.category, meal.area].filter(Boolean).join(", ")}</p>
        </div>
      </button>
      <HeartButton active={favorite} onClick={onToggleFavorite} className="absolute top-3 right-3" />
    </article>
  );
}
