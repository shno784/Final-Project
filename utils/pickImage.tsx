import * as ImagePicker from "expo-image-picker";
import { processData } from "@/utils/processData";
import { FoodItem } from "@/types/FoodTypes";

// This function is responsible for picking an image from the device's library and processing it.
const pickImage = async () => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      const newResult = result.assets[0].uri;
      const data: FoodItem = await processData(newResult);
      if (!data) {
        console.error("pickImage: No food data was fetched.");
        throw new Error("Cannot find food.");
      }
      return data;
    }
  } catch (error) {
    console.error("Error picking image:", error);
  }
};

export default pickImage;
