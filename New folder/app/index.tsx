import { useState } from "react";
import { View, Keyboard, TouchableWithoutFeedback, Image } from "react-native";
import { useRouter } from "expo-router";
import AppButton from "@/components/AppButton";
import pickImage from "@/utils/pickImage";
import OnboardingModal from "@/components/OnboardingModal";
import { processData } from "@/utils/processData";
import Icon from "@/components/Icon";
import USDAFoodSearch from "@/components/USDAFoodSearch";
import ErrorCard from "@/components/ErrorCard";
import { useAppState } from "@/utils/globalstates";
import { FoodDatabase } from "@/utils/foodDatabase";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);

  const { insertFoodItem } = FoodDatabase();
  const { errorMessage, setError, clearError, addSearch, setLoading } =
    useAppState();

  const handleSearch = async () => {
    if (searching) return;
    setSearching(true);

    try {
      if (searchQuery === "") {
        setError("Search query cannot be empty");
        return;
      }
      addSearch(searchQuery);
      setLoading(true);

      const result = await processData(searchQuery.toLowerCase());
      await insertFoodItem(result);
      router.push("/History");

      setSearchQuery("");
    } catch (error: any) {
      console.error("Scan workflow error:", error);
      // err.message now contains exactly the string you threw
      setError(error.message);
    } finally {
      setSearching(false);
      setLoading(false);
    }
  };
  //Handles processing add image function
  const handleImage = async () => {
    const data = await pickImage();
    if (data) {
      await insertFoodItem(data);
      router.push("/History");
    } else {
      setError("No image data found");
    }
  };
  const handleSuggestionSelect = (foodItem: any) => {
    if (foodItem?.description) {
      setSearchQuery(foodItem.description);
    }
  };

  return (
    <>
      {/* Main screen content */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={true}>
        <View className="flex-1">
          <OnboardingModal />
          <View className="flex-1 p-6 bg-white dark:bg-black justify-start">
            {/* Logo */}
            <View className="mt-24 items-center mb-[80px]">
              <View className="items-center mb-24 max-h-[100px]">
                <Image
                  source={require("@/assets/images/logo.png")}
                  className="w-80 h-80 rounded-lg"
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Search bar */}
            <View className="flex-row w-full items-center mb-8">
              <USDAFoodSearch
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSuggestionSelect={handleSuggestionSelect}
                placeholder="Search Food"
                inputClassName="border-[2px] border-primary rounded-lg py-3 px-5 text-xl text-text-head dark:text-text-d-head placeholder:font-medium placeholder:text-text-head dark:placeholder:text-text-d-head"
              />
              <AppButton
                label="Search"
                onPress={() => {
                  Keyboard.dismiss();
                  handleSearch();
                }}
                disabled={searching}
                className="ml-3"
                icon={<Icon name="search-outline" size={24} className="mr-2" />}
              />
            </View>

            {/* Other Buttons */}
            <AppButton
              label="Scan Food"
              onPress={() => router.navigate("/camera")}
              className="w-full mb-5"
              icon={<Icon name="camera-outline" size={24} className="mr-2" />}
            />
            <AppButton
              label="Add An Image"
              onPress={() => handleImage()}
              className="w-full mb-5"
              icon={<Icon name="image-outline" size={24} className="mr-2" />}
            />

            {/* Footer Buttons */}
            <View className="flex-row justify-between w-full mt-36 gap-[10px] mb-5">
              <AppButton
                label="Food History"
                onPress={() => router.navigate("/History")}
                className="flex-1"
                variant="secondary"
                icon={<Icon name="time-outline" size={24} className="mr-2" />}
              />
              <AppButton
                label="Settings"
                onPress={() => router.navigate("/options")}
                className="flex-1"
                variant="secondary"
                icon={
                  <Icon name="settings-outline" size={24} className="mr-2" />
                }
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* Error overlay */}
      {errorMessage !== "" && (
        <View className="absolute inset-0 z-50 justify-center items-center">
          <ErrorCard message={errorMessage} onDismiss={clearError} />
        </View>
      )}
    </>
  );
}
