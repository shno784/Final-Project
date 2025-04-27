import * as ImagePicker from "expo-image-picker";
import { processData } from "@/utils/processData";
import { FoodItem } from "@/types/FoodTypes";

// This function is responsible for picking an image from the device's library and processing it.
const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });
  // User cancelled the image picker
  if (result.canceled) {
    return null;
  }
  if (!result.canceled && result.assets?.[0]?.uri) {
    const newResult = result.assets[0].uri;
    try {
      // Process the image data and get the food item details
      const data: FoodItem = await processData(newResult);
      return data;
    } catch (error) {
      console.error("Error picking image:", error);
      throw new Error((error as Error).message || "Unknown error occurred");
    }
  }
  return null;
};

export default pickImage;
