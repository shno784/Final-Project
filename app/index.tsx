import { useState } from "react";
import {
  View,
  Text,
  Keyboard,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { useRouter } from "expo-router";
import AppButton from "@/components/AppButton";
import ImagePicker from "@/utils/ImagePicker";
import { fetchFoodData } from "@/service/Usda";
import { useFoodDatabase } from "@/utils/FoodDatabase";
import Test from "@/components/Test";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { insertFoodItem } = useFoodDatabase();

  const handleSearch = () => {
    try {
      if (searchQuery.trim() === "") {
        throw new Error("Search query cannot be empty");
      }
      fetchFoodData(searchQuery);
      console.log("Searching for:", searchQuery);
      // Empty the search input after searching
      setSearchQuery("");
    } catch (error) {
      console.error("Error:", (error as Error)?.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={true}>
      <View className="flex-1 bg-white dark:bg-black">
        <Test />
        {/* Main container: flex-1 with 24px padding (p-6), white background (dark: override) */}
        <View className="flex-1 p-6 bg-white dark:bg-black justify-start">
          {/* Header container with margin top 150px and margin bottom 80px, centered items */}
          <View className="mt-[150px] items-center mb-[80px]">
            <Text className="text-[28px] font-bold text-center mb-1 text-base text-black dark:text-white">
              My Nutrition App
            </Text>
            <Text className="text-base text-center text-black dark:text-white">
              Scan, Search, and Compare Foods
            </Text>
          </View>

          {/* Search container: row, full width, centered items, margin bottom 50px */}
          <View className="flex-row w-full items-center mb-[50px]">
            <TextInput
              className="flex-1 bg-[#f0f0f0] rounded-[8px] py-[14px] px-[12px] text-base text-[#333333]"
              placeholder="Search Food"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            <AppButton
              label="Search"
              onPress={handleSearch}
              className="ml-[10px] bg-[#007bff] py-[10px] px-[20px] rounded-[5px]"
            />
          </View>

          {/* Full width buttons */}
          <AppButton
            label="Scan Food"
            onPress={() => router.navigate("/camera")}
            className={"w-full bg-[#1abc9c] mb-5"}
            textStyle="text-black dark:text-white font-medium"
          />
          <AppButton
            label="Add An Image"
            onPress={() => ImagePicker(insertFoodItem)}
            className="w-full bg-[#1abc9c] mb-5"
            variant="secondary"
          />

          {/* Row for two half-width buttons */}
          <View className="flex-row justify-between w-full gap-[10px] mb-5">
            <AppButton
              label="Food History"
              onPress={() => router.navigate("/History")}
              className="flex-1"
              variant="tertiary"
            />
            <AppButton
              label="Settings"
              onPress={() => router.navigate("/options")}
              className="flex-1"
              variant="tertiary"
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
