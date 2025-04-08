import * as ImagePicker from "expo-image-picker";
import { ProcessImage } from "@/utils/ProcessImage";
import { FoodItem } from "@/types/DatabaseTypes";

const pickImage = async (insertFoodItem: (food: FoodItem) => Promise<void>) => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });
  console.log(result);

  if (!result.canceled) {
    const newResult = result.assets[0].uri;
    ProcessImage(newResult, insertFoodItem);
  }
};

export default pickImage;
