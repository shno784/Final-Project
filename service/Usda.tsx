import axios from "axios";
import axiosClient from "./Reconnect";
import { capitaliseWords } from "@/utils/capitaliseWords";

const usdaKey = process.env.EXPO_PUBLIC_USDA_API_KEY;
const usdaBaseURL = "https://api.nal.usda.gov/fdc/v1";
const unsplashKey = process.env.EXPO_PUBLIC_UNSPLASH_ACCESS_KEY;
const unsplashBaseURL = "https://api.unsplash.com";

// Composite function: given a query, it fetches search results then details.
export async function fetchFoodData(query: string) {
  query = capitaliseWords(query);
  try {
    // Search USDA foods
    const searchResponse = await axiosClient.get(
      `${usdaBaseURL}/foods/search`,
      {
        params: {
          api_key: usdaKey,
          query,
        },
      }
    );
    const foods = searchResponse.data.foods;
    if (!foods || foods.length === 0) {
      throw new Error("No food found for the query.");
    }

    // Pick the first result
    const firstFood = foods[0];
    // Fetch food details from USDA
    const detailsResponse = await axiosClient.get(
      `${usdaBaseURL}/food/${firstFood.fdcId}`,
      {
        params: {
          api_key: usdaKey,
        },
      }
    );

    // USDA doesn’t provide an image URL so we do a separate request to Unsplash.
    const unsplashResponse = await axiosClient.get(
      `${unsplashBaseURL}/search/photos`,
      {
        params: {
          query: firstFood.description,
          client_id: unsplashKey,
          per_page: 1,
        },
      }
    );
    // If we got at least one result, pick the first
    let imageUrl = null;
    if (
      unsplashResponse.data &&
      unsplashResponse.data.results &&
      unsplashResponse.data.results.length > 0
    ) {
      imageUrl = unsplashResponse.data.results[0].urls.regular;
    }
    // Assuming nutrients is the array you provided:
    const nutrients = detailsResponse.data.labelNutrients;
    if (!nutrients) {
      throw new Error("No nutrients found for the food item.");
    }
    function extractNutrients(nutrientData: any) {
      if (nutrientData === null || typeof nutrientData !== "object") {
        throw new Error("Provided nutrientData is not an object.");
      }
      return Object.keys(nutrientData).map((key) => {
        // Ensure the nutrient for the key is an object with a "value" property.
        const nutrientValue = nutrientData[key]?.value;
        return {
          name: key,
          value: nutrientValue,
        };
      });
    }
    console.log("Extracted nutrients from USDA API:", nutrients);
    const nutrientAndValues = extractNutrients(nutrients);
    // Construct returned object
    const detailedFoodData = {
      name: capitaliseWords(firstFood.description),
      imageUri: imageUrl, // from Unsplash
      nutrients: JSON.stringify(nutrientAndValues), // Nutrients from USDA
    };
    return detailedFoodData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === "ERR_NETWORK") {
        console.error("No internet connection.");
        throw new Error("No internet connection. Please check your network.");
      }
      const code = error.response?.status;
      const message = error.response?.data?.error?.message || error.message;
      console.error("Axios Error Details: ", { code, message });
      throw new Error(`Request failed with status ${code}: ${message}`);
    } else {
      throw error;
    }
  }
}
