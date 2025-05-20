import { useState, useEffect } from "react";
import { View, Keyboard, TouchableWithoutFeedback, Image } from "react-native";
import NetInfo from "@react-native-community/netinfo";
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
import { isOnline } from "@/utils/network";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const { insertFoodItem, getAllFoodItems } = FoodDatabase();
  const { errorMessage, setError, clearError, addSearch, setLoading } =
    useAppState();

  // Check connectivity and set offline state
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const offline = !state.isConnected;
      setIsOffline(offline);

      if (offline) {
        setError("You are offline. Scan Food and Add an Image are disabled.");
      } else {
        // clear the offline error once we’re back online
        clearError();
      }
    });
    return unsubscribe;
  }, []);

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

      if (await isOnline()) {
        const result = await processData(searchQuery.toLowerCase());
        await insertFoodItem(result);
        router.push("/History");
      } else {
        // If offline, filter the local database for matching food items
        const allFoodItems = await getAllFoodItems();
        const filteredItems = allFoodItems.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (filteredItems.length === 0) {
          setError(
            "We're sorry, we couldn't find any food items matching your search. Please check your internet connection and try again later."
          );
        } else {
          // Route to the first matching food item's detail page
          router.push(`/History/${filteredItems[0].id}`);
        }
        return filteredItems;
      }

      setSearchQuery("");
    } catch (error) {
      console.error("Scan workflow error:", error);
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setSearching(false);
      setLoading(false);
    }
  };

  // Handles processing add image function
  const handleImage = async () => {
    try {
      setLoading(true);
      const data = await pickImage();
      if (data) {
        await insertFoodItem(data);
        router.push("/History");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
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
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        importantForAccessibility="no"
      >
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
                accessibilityHint="Performs a food search for the entered term"
                haptic="notificationSuccess"
              />
            </View>

            {/* Other Buttons */}
            <AppButton
              label="Scan Food"
              onPress={() => router.navigate("/camera")}
              className={`w-full mb-5 ${isOffline ? "bg-gray-600" : ""}`}
              icon={
                isOffline ? (
                  <Icon name="lock-closed-outline" size={24} className="mr-2" />
                ) : (
                  <Icon name="camera-outline" size={24} className="mr-2" />
                )
              }
              accessibilityHint="Opens the camera to scan a barcode or take a picture of your food"
              disabled={isOffline}
              haptic="impactMedium"
            />
            <AppButton
              label="Add An Image"
              onPress={() => handleImage()}
              className={`w-full mb-5 ${isOffline ? "bg-gray-600" : ""}`}
              icon={
                isOffline ? (
                  <Icon name="lock-closed-outline" size={24} className="mr-2" />
                ) : (
                  <Icon name="image-outline" size={24} className="mr-2" />
                )
              }
              accessibilityHint="Pick a photo from your library to analyse"
              disabled={isOffline}
              haptic="impactMedium"
            />

            {/* Footer Buttons */}
            <View className="flex-row justify-between w-full mt-36 gap-[10px] mb-5">
              <AppButton
                label="Food History"
                onPress={() => router.navigate("/History")}
                className="flex-1"
                variant="secondary"
                icon={<Icon name="time-outline" size={24} className="mr-2" />}
                accessibilityHint="View your food history"
                haptic="selection"
              />
              <AppButton
                label="Settings"
                onPress={() => router.navigate("/options")}
                className="flex-1"
                variant="secondary"
                icon={
                  <Icon name="settings-outline" size={24} className="mr-2" />
                }
                accessibilityHint="Open app settings and preferences"
                haptic="selection"
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
