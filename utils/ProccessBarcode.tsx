import { BarcodeScan } from "@/service/OpenFoodFacts";
import { FoodItem } from "@/types/FoodTypes";

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
    console.error("Error processing barcode:", error);
  }
};

export default ProcessBarcode;
