export default function getBestMeaningfulLabel(labels: any[]): string {
    const genericWords = [
      "Food", "Dish", "Cuisine", "Ingredient", "Snack", "Meal", "Fast food",
      "Comfort food", "Recipe", "Finger food", "Side dish", "Appetizer",
      "Main course", "Cooking", "Eat", "Eating", "Delicacy",
      "Tableware", "Table", "Plate", "Cutlery", "Fork", "Spoon", "Knife", "Bowl",
      "Tray", "Table setting", "Kitchenware",
      "Natural foods", "Produce", "Nutrition", "Garnish", "Vegetarian food",
      "Vegan nutrition", "Organic food",
      "Still life", "Photography", "Snapshot", "Image", "Art", "Photo",
      "Picture", "Macro photography", "Close-up",
    ];
  
    const threshold = 0.85;
  
    const filtered = labels.filter(
      (label) =>
        label.score >= threshold &&
        !genericWords.includes(label.description)
    );
  
    if (filtered.length > 0) {
      return filtered[0].description;
    }
  
    return labels.length > 0 ? labels[0].description : "Unknown food";
  }
  