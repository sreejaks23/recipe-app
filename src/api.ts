import type { Filters, Meal } from "./types";

const BASE = "https://www.themealdb.com/api/json/v1/1";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(BASE + path);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json() as Promise<T>;
}

type Raw = Record<string, string | null>;

function normalize(r: Raw): Meal {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const name = r[`strIngredient${i}`]?.trim();
    if (name) ingredients.push({ name, measure: r[`strMeasure${i}`]?.trim() ?? "" });
  }
  return {
    id: r.idMeal!,
    name: r.strMeal!,
    thumb: r.strMealThumb!,
    category: r.strCategory ?? "",
    area: r.strArea ?? "",
    instructions: r.strInstructions ?? "",
    youtube: r.strYoutube ?? "",
    tags: r.strTags ? r.strTags.split(",").filter(Boolean) : [],
    ingredients,
  };
}

async function searchByName(q: string): Promise<Meal[]> {
  const data = await get<{ meals: Raw[] | null }>(`/search.php?s=${encodeURIComponent(q)}`);
  return (data.meals ?? []).map(normalize);
}

async function getMeal(id: string): Promise<Meal> {
  const data = await get<{ meals: Raw[] }>(`/lookup.php?i=${id}`);
  return normalize(data.meals[0]);
}

async function idsBy(param: "c" | "a" | "i", value: string): Promise<string[]> {
  const v = param === "i" ? value.replace(/ /g, "_") : value;
  const data = await get<{ meals: Raw[] | null }>(`/filter.php?${param}=${encodeURIComponent(v)}`);
  return (data.meals ?? []).map((m) => m.idMeal!);
}

export async function fetchOptions() {
  const list = async (p: string, key: string) =>
    (await get<{ meals: Raw[] }>(`/list.php?${p}=list`)).meals.map((m) => m[key]!).sort();
  const [categories, areas, ingredients] = await Promise.all([
    list("c", "strCategory"),
    list("a", "strArea"),
    list("i", "strIngredient"),
  ]);
  return { categories, areas, ingredients };
}

/** Search text + category + area + ingredient can all be combined. */
export async function searchMeals({ q, category, area, ingredient }: Filters): Promise<Meal[]> {
  const text = q.trim();

  if (text) {
    const meals = await searchByName(text);
    return meals.filter(
      (m) =>
        (!category || m.category === category) &&
        (!area || m.area === area) &&
        (!ingredient || m.ingredients.some((i) => i.name.toLowerCase() === ingredient.toLowerCase()))
    );
  }

  if (!category && !area && !ingredient) return searchByName("");

  // The filter endpoints return only ids, so intersect them and load full details.
  const lists = await Promise.all([
    category ? idsBy("c", category) : null,
    area ? idsBy("a", area) : null,
    ingredient ? idsBy("i", ingredient) : null,
  ]);
  const active = lists.filter((l): l is string[] => l !== null);
  const ids = active.reduce((a, b) => a.filter((id) => b.includes(id))).slice(0, 24);
  return Promise.all(ids.map(getMeal));
}
