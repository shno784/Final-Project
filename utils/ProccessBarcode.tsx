import { BarcodeScan } from "@/service/OpenFoodFacts";
import { FoodItem } from "@/types/FoodTypes";

// This function processes a barcode by scanning it and inserting the food item into the database
const ProcessBarcode = async (
  barcode: string,
  insertFoodItem: (food: FoodItem) => Promise<void>
) => {
  try {
    const data: FoodItem = await BarcodeScan(barcode);
    console.log("Data from barcode:", data);

    insertFoodItem(data);
    return null;
  } catch (error) {
    return "Error processing barcode";
  }
};

export default ProcessBarcode;
