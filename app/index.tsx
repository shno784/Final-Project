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
import { useFoodDatabase } from "@/utils/FoodDatabase";
import OnboardingModal from "@/components/OnboardingModal";
import { ProcessText } from "@/utils/ProcessText";
import Icon from "@/components/Icon";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { insertFoodItem } = useFoodDatabase();

  const handleSearch = async () => {
    try {
      if (searchQuery.trim() === "") {
        throw new Error("Search query cannot be empty");
      }
      await ProcessText(searchQuery.toLowerCase(), insertFoodItem);
      router.push("/History");
      // Empty the search input after searching
      setSearchQuery("");
    } catch (error) {
      console.error("Error:", (error as Error)?.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={true}>
      <View className="flex-1">
        <OnboardingModal />
        {/* Main container: flex-1 with 24px padding (p-6), white background (dark: override) */}
        <View className="flex-1 p-6 bg-white dark:bg-black justify-start">
          {/* Header container with margin top 150px and margin bottom 80px, centered items */}
          <View className="mt-[150px] items-center mb-[80px]">
            <Text className="text-3xl font-bold text-center mb-1 text-text-head dark:text-text-d-head">
              My Nutrition App
            </Text>
            <Text className="text-base text-center text-text-main dark:text-text-d-main">
              Scan, Search, and Compare Foods
            </Text>
          </View>

          {/* Search container: row, full width, centered items, margin bottom 50px */}
          <View className="flex-row w-full items-center mb-8">
            <TextInput
              className="flex-1 border-[2px] border-primary rounded-lg py-3 px-5 text-xl placeholder:font-medium placeholder:text-text-head dark:placeholder:text-text-d-head"
              placeholder="Search Food"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            <AppButton
              label="Search"
              onPress={handleSearch}
              className="ml-3"
              icon={<Icon name="search-outline" size={24} className="mr-2" />}
            />
          </View>

          {/* Full width buttons */}
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

          {/* Row for two half-width buttons */}
          <View className="flex-row justify-between w-full gap-[10px] mb-5">
            <AppButton
              label="Food History"
              onPress={() => router.navigate("/History")}
              className="flex-1"
              icon={<Icon name="time-outline" size={24} className="mr-2" />}
            />
            <AppButton
              label="Settings"
              icon={<Icon name="settings-outline" size={24} className="mr-2" />}
              onPress={() => router.navigate("/options")}
              className="flex-1"
              variant="secondary"
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
