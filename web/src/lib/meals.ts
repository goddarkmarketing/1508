export type MealStatus = "included" | "own" | "none";

export type MealPlan = {
  B: MealStatus;
  L: MealStatus;
  D: MealStatus;
};

function detect(
  text: string,
  keywords: string[],
): MealStatus {
  const lower = text.toLowerCase();

  for (const key of keywords) {
    const ownBefore = new RegExp(`own\\s+${key}\\b`, "i");
    const ownAfter = new RegExp(`\\b${key}\\s+own\\b`, "i");
    if (ownBefore.test(lower) || ownAfter.test(lower)) return "own";
    if (new RegExp(`\\b${key}\\b`, "i").test(lower)) return "included";
  }

  return "none";
}

export function parseMealPlan(meals: string): MealPlan {
  const text = meals.trim();
  const lower = text.toLowerCase();

  if (/no\s*meals?/.test(lower)) {
    return { B: "none", L: "none", D: "none" };
  }

  if (/^own(\s+meals?)?$/i.test(text)) {
    return { B: "own", L: "own", D: "own" };
  }

  if (/^own\s+dinner$/i.test(text)) {
    return { B: "none", L: "none", D: "own" };
  }

  // Compact codes: B/L/D, B/L, etc.
  const compact = text.toUpperCase().replace(/\s+/g, "");
  if (/^[BLD/]+$/.test(compact)) {
    return {
      B: compact.includes("B") ? "included" : "none",
      L: compact.includes("L") ? "included" : "none",
      D: compact.includes("D") ? "included" : "none",
    };
  }

  return {
    B: detect(text, ["breakfast", "b"]),
    L: detect(text, ["lunch", "l"]),
    D: detect(text, ["dinner", "d"]),
  };
}

export function mealLegend() {
  return [
    { code: "B" as const, label: "Breakfast" },
    { code: "L" as const, label: "Lunch" },
    { code: "D" as const, label: "Dinner" },
  ];
}

export function mealStatusLabel(status: MealStatus) {
  if (status === "included") return "Included";
  if (status === "own") return "Own expense";
  return "Not included";
}
