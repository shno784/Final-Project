import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Text,
  AccessibilityInfo,
} from "react-native";
import * as Speech from "expo-speech";
import { useLocalSearchParams } from "expo-router";
import { FoodDatabase } from "@/utils/foodDatabase";
import { FoodRow, Macronutrient, Micronutrient } from "@/types/FoodTypes";
import NutritionCarousel from "@/components/NutritionCarousel";
import { useColorScheme } from "nativewind";
import AppButton from "@/components/AppButton";
import Icon from "@/components/Icon";
import AppText from "@/components/AppText";

const { width: screenWidth } = Dimensions.get("window");

// Define chart configuration for the carousel
const chartConfig = {
  backgroundColor: "#fff",
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 2, // adjust here for the chart if needed
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
};

export default function FoodDetailPage() {
  const { id } = useLocalSearchParams();
  const { getFoodItemById } = FoodDatabase();
  const [foodItem, setFoodItem] = useState<FoodRow | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedGrams, setSelectedGrams] = useState<number>(100);
  const { colorScheme } = useColorScheme();

  // Function to handle text-to-speech
  const speak = (text: string) => {
    Speech.speak(text, {
      rate: 0.8,
      onStart: () => setIsSpeaking(true),
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };
  // Function to stop text-to-speech
  const stop = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  // Fetch food item details based on the ID from the URL parameters
  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      const item = await getFoodItemById(parseInt(id as string));
      console.log(item?.nutrients);
      setFoodItem(item || null);
      AccessibilityInfo.announceForAccessibility(
        `Loaded details for ${item?.name}`
      );
    };
    fetchItem();
  }, [id]);

  if (!foodItem) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#333" />
        <AppText className="mt-2">Loading food item...</AppText>
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

  // Return nutrient value (ignoring case)
  const getValue = (name: string) => {
    const found = nutrients.find(
      (n) => n.name.toLowerCase() === name.toLowerCase()
    );
    return found ? found.value : 0;
  };

  // Calculate multiplier based on the serving size
  const multiplier = selectedGrams / 100;

  // Calculate and round macronutrient values to 2dp
  const proteinRounded = parseFloat(
    (getValue("Protein") * multiplier).toFixed(2)
  );
  const carbsRounded = parseFloat(
    (getValue("Carbohydrates") * multiplier).toFixed(2)
  );
  const fatRounded = parseFloat((getValue("fat") * multiplier).toFixed(2));

  // Generate macronutrient data for the carousel
  const macroData: Macronutrient[] = [
    {
      name: "PROTEIN",
      population: proteinRounded,
      color: "#f39c12",
      legendFontColor: colorScheme === "dark" ? "#E0E0E0" : "#333333",
      legendFontSize: 16,
    },
    {
      name: "CARBS",
      population: carbsRounded,
      color: "#27ae60",
      legendFontColor: colorScheme === "dark" ? "#E0E0E0" : "#333333",
      legendFontSize: 16,
    },
    {
      name: "FAT",
      population: fatRounded,
      color: "#c0392b",
      legendFontColor: colorScheme === "dark" ? "#E0E0E0" : "#333333",
      legendFontSize: 16,
    },
  ];

  // Calculate and round micronutrient values to 2dp
  const sodiumRounded = parseFloat(
    (getValue("Sodium") * multiplier).toFixed(2)
  );
  const sugarsRounded = parseFloat(
    (getValue("sugars") * multiplier).toFixed(2)
  );
  const fiberRounded = parseFloat((getValue("Fiber") * multiplier).toFixed(2));

  // Generate micronutrient data for the carousel
  const micronutrients: Micronutrient[] = [
    {
      name: "Sodium, Na",
      value: sodiumRounded,
      dv: 2300,
    },
    {
      name: "Sugars, total",
      value: sugarsRounded,
      dv: 50,
    },
    {
      name: "Fiber, total dietary",
      value: fiberRounded,
      dv: 28,
    },
  ];

  // 1) extract per‑100g baselines
  const baseProtein = getValue("Protein");
  const baseCarbs = getValue("Carbohydrates");
  const baseFat = getValue("Fat");
  const baseSodium = getValue("Sodium");
  const baseSugars = getValue("Sugars");
  const baseFiber = getValue("Fiber");

  // 2) generate tags once
  const tags: string[] = [];
  if (baseProtein >= 15) tags.push("💪 High Protein");
  if (baseSugars <= 5) tags.push("🍬 Low Sugar");
  if (baseSugars > 22) tags.push("🍭 High Sugar");
  if (baseFiber >= 5) tags.push("🌾 High Fiber");
  if (baseFiber < 3) tags.push("🌿 Low Fiber");
  if (baseFat <= 5) tags.push("🥗 Low Fat");
  if (baseFat >= 20) tags.push("🥑 High Fat");
  if (baseCarbs < 15) tags.push("🥔 Low Carbs");
  if (baseCarbs >= 30) tags.push("🍞 High Carbs");
  if (baseSodium <= 0.12) tags.push("🧂 Low Sodium");
  if (baseSodium >= 0.6) tags.push("🧂 High Sodium");
  if (baseCarbs < 15 && baseFat > 10) tags.push("🥩 Keto‑Friendly");

  return (
    <ScrollView
      nestedScrollEnabled
      directionalLockEnabled
      className="pt-20 p-4 dark:bg-black bg-white"
      accessible={true}
    >
      {/* Card Container */}
      <View className="dark:bg-black rounded-xl shadow-lg p-4">
        <View className="relative w-full">
          <View className="mt-2 w-full">
            <AppText className="text-[28px] font-bold text-center text-text-main dark:text-text-d-main">
              {foodItem.name}
            </AppText>
          </View>
        </View>

        <Image
          source={{ uri: foodItem.imageUri }}
          className="w-full h-[200px] rounded-[12px] my-5"
          resizeMode="cover"
        />

        {/* Carousel Section */}
        <View className="mb-5 bg-card-light dark:bg-card-dark overflow-hidden rounded-xl">
          <NutritionCarousel
            screenWidth={screenWidth}
            macroData={macroData}
            micronutrients={micronutrients}
            tags={tags}
            chartConfig={chartConfig}
          />
        </View>
        {/* Read Nutrients Button */}
        <AppButton
          label={isSpeaking ? "Stop Reading" : "Read Nutrients"}
          icon={
            isSpeaking ? (
              <Icon name="volume-mute-outline" size={24} className="mr-2" />
            ) : (
              <Icon name="volume-high-outline" size={24} className="mr-2" />
            )
          }
          onPress={() => {
            if (isSpeaking) stop();
            else {
              const lines = nutrients
                .map(
                  (n) => `${n.name}: ${(n.value * multiplier).toFixed(1)} grams`
                )
                .join(", ");
              speak(`Here are the nutrients for ${foodItem.name}: ${lines}`);
            }
          }}
          variant="secondary"
        />
        {/* Nutrients Title with Serving Size Selector */}
        <View className="flex-row justify-between items-center mt-4 mb-2">
          <Text className="text-[20px] font-semibold text-text-head dark:text-text-d-head">
            Nutrients
          </Text>
          <View className="flex-row flex-wrap gap-1">
            {[50, 100, 150, 200].map((gram) => (
              <AppText
                key={gram}
                onPress={() => setSelectedGrams(gram)}
                className={`px-3 py-1 rounded-full text-sm text-text-main font-semibold ${
                  selectedGrams === gram
                    ? "bg-primary text-white"
                    : "bg-card-light text-gray-800"
                }`}
                style={{ maxWidth: "100%" }}
              >
                {gram}g
              </AppText>
            ))}
          </View>
        </View>

        {/* List of Nutrients with Adjusted and Rounded Values */}
        {nutrients.map((nutrient, index) => {
          const value =
            (parseFloat((nutrient.value * multiplier).toFixed(2)) || 0).toFixed(
              1
            ) + "g";

          return (
            <View
              key={index}
              className="flex-row items-center justify-between py-1 border-b border-b-gray-300"
            >
              {/* 1️⃣ Left column: flexes and wraps up to 2 lines */}
              <View className="flex-1 pr-2">
                <AppText
                  className="text-[16px] text-text-main dark:text-text-d-main"
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {nutrient.name}
                </AppText>
              </View>

              {/* 2️⃣ Right column: fixed width, right-aligned */}
              <View className="w-16">
                <AppText className="text-right text-[16px] text-text-main dark:text-text-d-main">
                  {value}
                </AppText>
              </View>
            </View>
          );
        })}
        {/* Recipe Section */}
        {foodItem.recipe && (
          <>
            <AppText className="text-[20px] font-semibold mt-4 mb-2">
              Recipe
            </AppText>
            <AppText className="text-[16px] text-[#333] mt-2 leading-[22px]">
              {foodItem.recipe}
            </AppText>
          </>
        )}
      </View>
    </ScrollView>
  );
}
