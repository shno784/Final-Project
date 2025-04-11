import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useFoodDatabase } from "@/utils/FoodDatabase";
import { FoodRow, Macronutrient, Micronutrient } from "@/types/FoodTypes";
import AppButton from "@/components/AppButton";
import NutritionCarousel from "@/components/NutritionCarousel";
import { useColorScheme } from "nativewind";

// Get device width for carousel sizing
const { width: screenWidth } = Dimensions.get("window");

// Configuration for react-native-chart-kit
const chartConfig = {
  backgroundColor: "#fff",
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
};

export default function FoodDetailPage() {
  const { id } = useLocalSearchParams();
  const { getFoodItemById } = useFoodDatabase();
  const [foodItem, setFoodItem] = useState<FoodRow | null>(null);
  const [selectedGrams, setSelectedGrams] = useState<number>(100);
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      const item = await getFoodItemById(parseInt(id as string));
      setFoodItem(item || null);
    };
    fetchItem();
  }, [id]);

  if (!foodItem) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#333" />
        <Text className="mt-2">Loading food item...</Text>
      </View>
    );
  }

  // Parse nutrients from string to array
  let nutrients: { name: string; value: number }[] = [];
  try {
    nutrients = JSON.parse(foodItem.nutrients);
  } catch (err) {
    console.warn("Failed to parse nutrients JSON", err);
  }

  // Helper: Return nutrient value (ignoring case)
  const getValue = (name: string) => {
    const found = nutrients.find(
      (n) => n.name.toLowerCase() === name.toLowerCase()
    );
    return found ? found.value : 0;
  };

  // ----------------------------
  // Prepare Data for Carousel
  // ----------------------------
  const protein = getValue("Protein");
  const carbs = getValue("Carbohydrates");
  const fat = getValue("fat");

  const macroData: Macronutrient[] = [
    {
      name: "PROTEIN",
      population: protein,
      color: "#f39c12",
      legendFontColor: colorScheme === "dark" ? "#E0E0E0" : "#333333",
      legendFontSize: 16,
    },
    {
      name: "CARBS",
      population: carbs,
      color: "#27ae60",
      legendFontColor: colorScheme === "dark" ? "#E0E0E0" : "#333333",
      legendFontSize: 16,
    },
    {
      name: "FAT",
      population: fat,
      color: "#c0392b",
      legendFontColor: colorScheme === "dark" ? "#E0E0E0" : "#333333",
      legendFontSize: 16,
    },
  ];

  const micronutrients: Micronutrient[] = [
    {
      name: "Sodium, Na",
      value: getValue("Sodium"),
      dv: 2300,
    },
    {
      name: "Sugars, total",
      value: getValue("sugars"),
      dv: 50,
    },
    {
      name: "Fiber, total dietary",
      value: getValue("Fiber"),
      dv: 28,
    },
  ];

  // Generate nutrient-based tags
  let tags: string[] = [];
  if (protein >= 15) tags.push("💪 High Protein");
  if (getValue("Sugars") <= 5) tags.push("🍬 Low Sugar");
  if (getValue("Fiber") >= 5) tags.push("🌾 High Fiber");
  if (getValue("fat") <= 5) tags.push("🥗 Low Fat");
  if (carbs < 15 && fat > 10) tags.push("🥩 Keto-Friendly");

  return (
    <ScrollView
      nestedScrollEnabled
      directionalLockEnabled
      className="pt-20 p-4 dark:bg-body-dark bg-body-light"
    >
      {/* Card Container */}
      <View className="bg-card-light dark:bg-card-dark rounded-xl shadow-lg p-4">
        {/* Header row: Back button and title */}
        <View className="relative w-full">
          {/* Absolutely positioned button with one third width */}
          <AppButton label="Back" variant="back" />
          {/* Container for text placed below the button */}
          <View className="mt-2 w-full">
            <Text className="text-[28px] font-bold text-center text-text-main dark:text-text-d-main">
              {foodItem.name}
            </Text>
          </View>
        </View>

        <Image
          source={{ uri: foodItem.imageUri }}
          className="w-full h-[200px] rounded-[12px] my-5"
          resizeMode="cover"
        />

        {/* Carousel Section */}
        <View className="mb-5">
          <NutritionCarousel
            screenWidth={screenWidth}
            macroData={macroData}
            micronutrients={micronutrients}
            tags={tags}
            chartConfig={chartConfig}
          />
        </View>

        {/* Nutrients Title with Serving Size Selector */}
        <View className="flex-row justify-between items-center mt-4 mb-2">
          <Text className="text-[20px] font-semibold text-text-head dark:text-text-d-head">
            Nutrients
          </Text>
          <View className="flex-row gap-2">
            {[50, 100, 150, 200].map((gram) => (
              <Text
                key={gram}
                onPress={() => setSelectedGrams(gram)}
                className={`px-3 py-1 rounded-full text-sm text-text-main font-semibold ${
                  selectedGrams === gram
                    ? "bg-button-primary text-white"
                    : "bg-card-light text-gray-800"
                }`}
              >
                {gram}g
              </Text>
            ))}
          </View>
        </View>

        {/* List of Nutrients with Adjusted Values */}
        {nutrients.map((nutrient, index) => (
          <View
            key={index}
            className="flex-row justify-between py-1 border-b border-b-gray-300"
          >
            <Text className="text-[16px] text-text-main dark:text-text-d-main">
              {nutrient.name}
            </Text>
            <Text className="text-[16px] text-text-main dark:text-text-d-main">
              {(nutrient.value * (selectedGrams / 100)).toFixed(1)}
            </Text>
          </View>
        ))}

        {/* Recipe Section */}
        {foodItem.recipe && (
          <>
            <Text className="text-[20px] font-semibold mt-4 mb-2">Recipe</Text>
            <Text className="text-[16px] text-[#333] mt-2 leading-[22px]">
              {foodItem.recipe}
            </Text>
          </>
        )}
      </View>
    </ScrollView>
  );
}
