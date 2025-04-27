// Excludes generic labels from the list of labels returned by the Google Vision API
export default function getBestMeaningfulLabel(labels: any[]): string {
  const genericWords = [
    "food", "dish", "cuisine", "ingredient", "snack", "meal", "fast food",
    "comfort food", "recipe", "finger food", "side dish", "appetizer",
    "main course", "cooking", "eat", "eating", "delicacy",
    "tableware", "table", "plate", "cutlery", "fork", "spoon", "knife", "bowl",
    "tray", "table setting", "kitchenware",
    "natural foods", "produce", "nutrition", "garnish", "vegetarian food",
    "vegan nutrition", "organic food",
    "still life", "photography", "snapshot", "image", "art", "photo",
    "photograph", "picture", "still life photography", "object",
    "still life", "still life image", "still life photo",
    "picture", "macro photography", "close-up",
    "cooked", "raw", "prepared", "fresh, roasted", "grilled", "baked",
    "roast", "grill", "bake", "fry", "boil", "produce"
  ];

  const threshold = 0.85;

  const filtered = labels.filter((label) => {
    const desc = label.description.toLowerCase();

    const isGeneric = genericWords.some((word) =>
      desc.includes(word.toLowerCase())
    );

    return label.score >= threshold && !isGeneric;
  });

  if (filtered.length > 0) {
    return filtered[0].description;
  }

  return labels.length > 0 ? labels[0].description : "Unknown food";
}
