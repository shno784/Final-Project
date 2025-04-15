import * as ImagePicker from "expo-image-picker";
import { processData } from "@/utils/ProcessData";

const pickImage = async () => {
  console.log("pickImage function is running...");

  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      const newResult = result.assets[0].uri;
      await processData(newResult);
    }
  } catch (error) {
    console.error("Error picking image:", error);
  } finally {
  }
};

export default pickImage;
