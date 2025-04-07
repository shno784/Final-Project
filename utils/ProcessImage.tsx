import { ProcessImageProps } from "@/types/CameraTypes";

const ProcessImage = async ({ uri }: ProcessImageProps) => {
  //   setIsModelReady(false); // Start loading
  const fileName = uri.split("/").pop();
  console.log("File name:", uri);

  //Get the name from the ai model
  //   try {
  //     // Create a permanent copy of the image
  //     const fileName = photo.uri.split('/').pop();
  //     const newUri = FileSystem.documentDirectory + fileName;

  //     // Copy the file to a permanent location
  //     await FileSystem.copyAsync({
  //       from: photo.uri,
  //       to: newUri
  //     });

  //     // Now use this permanent URI
  //     console.log("Permanent image URI:", newUri);

  //     // Convert photo to Base64
  //     const base64 = await FileSystem.readAsStringAsync(newUri, {
  //       encoding: FileSystem.EncodingType.Base64,
  //     });

  //     // Identify the food
  //     const foodName = await identifyFood(base64);

  //     // Fetch nutrient data
  //     const foodInfo = await getNutritionalInfo(foodName);

  //     // Add the permanent photo URI to be the image of the food
  //     const details = { ...foodInfo?.details, mainImage: newUri };

  //     console.log("Details with permanent URI:", details);

  //     // Save food data in the database with the permanent URI
  //     await insertFoodData(foodName, JSON.stringify(details));

  //     // Navigate to the details screen
  //     router.push({
  //       pathname: "/(tabs)/history/History",
  //       params: { foodName },
  //     });
  //   } catch (error) {
  //     console.error("Error processing photo:", error);
  //   } finally {
  //     setIsModelReady(true); // Stop loading
  //   }
};

export default ProcessImage;
