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
        .filter(([key, _]) => key.endsWith("_100g"))
        .reduce((obj: Record<string, any>, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {} as Record<string, any>);

      //Extract nutrients per serving
      const nutrientsString = JSON.stringify(nutrientsPer100g, null, 2);
      const productName =
        response.data.product.product_name || "Unknown Product";
      const productImage = response.data.product.image_url || null;

      const productDetails = {
        name: productName,
        imageUri: productImage,
        nutrients: nutrientsString,
      };
      return productDetails;
      console.log("Nutrients: ", nutrientsString);
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
