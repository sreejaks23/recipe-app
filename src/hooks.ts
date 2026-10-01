import { useEffect, useState } from "react";
import type { Meal } from "./types";

export function useDebounce<T>(value: T, delay = 400): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

const KEY = "recipe-app:favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Meal[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) ?? "[]") as Meal[];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = (id: string) => favorites.some((m) => m.id === id);
  const toggle = (meal: Meal) =>
    setFavorites((f) => (f.some((m) => m.id === meal.id) ? f.filter((m) => m.id !== meal.id) : [meal, ...f]));

  return { favorites, isFavorite, toggle };
}
