import axios from "axios";
import axiosClient from "./Reconnect";

export async function BarcodeScan(barcode: string) {
  try {
    const endpoint = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;

    const response = await axiosClient.get(endpoint, {
      headers: {
        "User-Agent": "Food app - Version 1.0",
        Accept: "application/json",
      },
    });

    if (response.data.status === 1) {
      const product = response.data.product;

      //extract allergens
      const allergens = product.allergens || "";

      // Check if allergens is a non-empty string and clean it
      let allergensList: string[] = [];
      if (typeof allergens === "string" && allergens) {
        allergensList = allergens
          .split(",")
          .map((allergen) => allergen.replace("en:", ""));
      }

      //extract ingredients
      const ingredients = product.ingredients_text || "";
      let ingredientsList = ingredients.split(",").map((ingredient: string) =>
        ingredient
          .trim()
          .replace(/\(.*?\)/g, "")
          .trim()
      );

      // Extract required fields
      const productName = product.product_name || "Unknown product";
      const mainImage = product.image_url || "No image available";
      const nutrients = product.nutriments || {};
      const servingSize = product.serving_size || "N/A";
      const foodScore = product.nutrition_grades || "Not graded";
      const novaScore = product.nova_group || "Not graded";
      const greenScore = product.ecoscore_grade || "Not graded";

      // If there are missing nutrients, add them to the returned data
      const foodDetails = {
        foodName: productName,
        details: {
          mainImage,
          servingSize,
          foodScore,
          novaScore,
          greenScore,
          allergensList,
          ingredientsList,
          nutrients: {
            calories: nutrients["energy-kcal"] || undefined,
            fatCalories: nutrients["fat_energy"] || undefined,
            totalFat: nutrients["fat"] || undefined,
            saturatedFat: nutrients["saturated-fat"] || undefined,
            transFat: nutrients["trans-fat"] || undefined,
            monounsaturatedFat: nutrients["monounsaturated-fat"] || undefined,
            polyunsaturatedFat: nutrients["polyunsaturated-fat"] || undefined,
            cholesterol: nutrients["cholesterol"] || undefined,
            sodium: nutrients["sodium"] || undefined,
            potassium: nutrients["potassium"] || undefined,
            carbohydrates: nutrients["carbohydrates"] || undefined,
            fiber: nutrients["fiber"] || undefined,
            sugar: nutrients["sugar"] || undefined,
            protein: nutrients["proteins"] || undefined,
            vitaminA: nutrients["vitamin-a"] || undefined,
            vitaminC: nutrients["vitamin-c"] || undefined,
            vitaminD: nutrients["vitamin-d"] || undefined,
            vitaminE: nutrients["vitamin-e"] || undefined,
            vitaminK: nutrients["vitamin-k"] || undefined,
            thiamin: nutrients["thiamin"] || undefined,
            riboflavin: nutrients["riboflavin"] || undefined,
            niacin: nutrients["niacin"] || undefined,
            vitaminB6: nutrients["vitamin-b6"] || undefined,
            vitaminB12: nutrients["vitamin-b12"] || undefined,
            folate: nutrients["folate"] || undefined,
            pantothenicAcid: nutrients["pantothenic-acid"] || undefined,
            biotin: nutrients["biotin"] || undefined,
            choline: nutrients["choline"] || undefined,
            calcium: nutrients["calcium"] || undefined,
            iron: nutrients["iron"] || undefined,
            phosphorus: nutrients["phosphorus"] || undefined,
            magnesium: nutrients["magnesium"] || undefined,
            zinc: nutrients["zinc"] || undefined,
            copper: nutrients["copper"] || undefined,
            manganese: nutrients["manganese"] || undefined,
            selenium: nutrients["selenium"] || undefined,
          },
        },
      };

      // Return detailed structure including the name and data
      console.log("Getting food details)");
      console.log("Product details: ", foodDetails);
    } else {
      console.error("Product not found.");
      throw new Error("Product not found.");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const code = error.response?.status;
      const message =
        error.response?.data?.status?.description || error.message;
      throw new Error(`Request failed with status ${code}: ${message}`);
    } else {
      throw error;
    }
  }
}
