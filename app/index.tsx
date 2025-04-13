// pages/index.tsx (or Home.tsx)
import { useState } from "react";
import { View, Text, Keyboard, TouchableWithoutFeedback } from "react-native";
import { useRouter } from "expo-router";
import AppButton from "@/components/AppButton";
import ImagePicker from "@/utils/ImagePicker";
import { useFoodDatabase } from "@/utils/FoodDatabase";
import OnboardingModal from "@/components/OnboardingModal";
import { processData } from "@/utils/ProcessData";
import Icon from "@/components/Icon";
import USDAFoodSearch from "@/components/USDAFoodSearch";
import ErrorCard from "@/components/ErrorCard";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { insertFoodItem } = useFoodDatabase();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = async () => {
    try {
      if (searchQuery == "") {
        console.log("Search query cannot be empty");
        setErrorMessage("Search query cannot be empty");
        return;
      }
      await processData(searchQuery.toLowerCase(), insertFoodItem);
      router.push("/History");
      // Clear the search input after the search
      setSearchQuery("");
    } catch (error: any) {
      console.error("Error:", (error as Error)?.message);
      setErrorMessage("Error processing search");
    }
  };

  const handleSuggestionSelect = (foodItem: any) => {
    if (foodItem?.description) {
      setSearchQuery(foodItem.description);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={true}>
      <View className="flex-1">
        <OnboardingModal />
        <View className="flex-1 p-6 bg-white dark:bg-black justify-start">
          <View className="mt-[150px] items-center mb-[80px]">
            <Text className="text-3xl font-bold text-center mb-1 text-text-head dark:text-text-d-head">
              My Nutrition App
            </Text>
            <Text className="text-base text-center text-text-main dark:text-text-d-main">
              Scan, Search, and Compare Foods
            </Text>
          </View>
          {errorMessage !== "" && (
            <ErrorCard
              message={errorMessage}
              onDismiss={() => setErrorMessage("")}
            />
          )}
          {/* Search bar and button container */}
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
              onPress={handleSearch}
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
            onPress={() => ImagePicker(insertFoodItem)}
            className="w-full mb-5"
            icon={<Icon name="image-outline" size={24} className="mr-2" />}
          />
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
              icon={<Icon name="settings-outline" size={24} className="mr-2" />}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
