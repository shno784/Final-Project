import * as ImagePicker from "expo-image-picker";
import ProcessImage from "@/utils/ProcessImage";

const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });
  console.log(result);

  if (!result.canceled) {
    const newResult = result.assets[0].uri;
    ProcessImage({ uri: newResult });
  }
};

export default pickImage;
