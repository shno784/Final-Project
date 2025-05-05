import { BarcodeScan } from "@/service/OpenFoodFacts";
import { FoodItem } from "@/types/FoodTypes";

// This function processes a barcode by scanning it and inserting the food item into the database
const processBarcode = async (barcode: string) => {
  try {
    const data: FoodItem = await BarcodeScan(barcode);
    return data;
  } catch (error) {
    console.error("Error processing barcode:", error);
    throw new Error((error as Error).message || "Error processing barcode.");
  }
};

export default processBarcode;
