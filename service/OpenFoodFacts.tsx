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
      const product = response.data.product.nutriments;

      //Extract nutrients per 100g
      const nutrientsPer100g = Object.entries(product)
        .filter(([key]) => key.endsWith("_100g"))
        .reduce((obj: Record<string, number>, [key, value]) => {
          // Remove the last 5 characters ("_100g") by slicing
          const newKey = key.slice(0, -5);
          // value is already a number, so store it directly
          obj[newKey] = value as number;
          return obj;
        }, {});
      function extractNutrients(
        nutrients: Record<string, number>
      ): { name: string; value: number }[] {
        return Object.entries(nutrients).map(([name, value]) => ({
          name,
          value,
        }));
      }
      //Extract nutrients per serving
      const nutrientsString = extractNutrients(nutrientsPer100g);
      console.log("Extracted nutrients:", nutrientsString);
      const productName =
        response.data.product.product_name || "Unknown Product";
      const productImage = response.data.product.image_url || null;

      const productDetails = {
        name: productName,
        imageUri: productImage,
        nutrients: JSON.stringify(nutrientsString),
      };
      return productDetails;
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
