import { useState } from "react";
import { View, Keyboard, TouchableWithoutFeedback, Image } from "react-native";
import { useRouter } from "expo-router";
import AppButton from "@/components/AppButton";
import pickImage from "@/utils/pickImage";
import OnboardingModal from "@/components/OnboardingModal";
import { processData } from "@/utils/ProcessData";
import Icon from "@/components/Icon";
import USDAFoodSearch from "@/components/USDAFoodSearch";
import ErrorCard from "@/components/ErrorCard";
import { useAppState } from "@/utils/Globalstates";
import { StatusBar } from "expo-status-bar";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false); // New state for tracking search submissions

  const { errorMessage, setError, clearError, addSearch, setLoading } =
    useAppState();

  const handleSearch = async () => {
    // Prevent multiple submissions by checking the state
    if (searching) return;

    // Set searching flag to true
    setSearching(true);

    try {
      if (searchQuery === "") {
        console.log("Search query cannot be empty");
        setError("Search query cannot be empty");
        return;
      }
      addSearch(searchQuery);
      setLoading(true);

      await processData(searchQuery.toLowerCase());
      router.push("/History");

      // Clear the search input after the search
      setSearchQuery("");
    } catch (error: any) {
      console.error("Error:", (error as Error)?.message);
      setError("Error processing search");
    } finally {
      // Reset the flag regardless of success or failure
      setSearching(false);
      setLoading(false);
    }
  };
  // Set the search query when a suggestion is selected
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
          <View className="mt-24 items-center mb-[80px]">
            <View className="items-center mb-24 max-h-[100px] ">
              <Image
                source={require("@/assets/images/logo.png")}
                className="w-80 h-80 rounded-lg"
                resizeMode="contain"
              />
            </View>
          </View>
          {errorMessage !== "" && (
            <ErrorCard message={errorMessage} onDismiss={clearError} />
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
            onPress={() => pickImage()}
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
