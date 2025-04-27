import { BarcodeScan } from "@/service/OpenFoodFacts";
import { FoodItem } from "@/types/FoodTypes";

// This function processes a barcode by scanning it and inserting the food item into the database
const processBarcode = async (barcode: string) => {
  const data: FoodItem = await BarcodeScan(barcode);
  if (!data) {
    console.warn("processBarcode: No food was identified in the barcode.");
    throw new Error("Product not found.");
  }
  return data;
};

export default processBarcode;
