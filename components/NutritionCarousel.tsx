import React from "react";
import { View, Text, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { PieChart } from "react-native-chart-kit";
import { NutritionCarouselProps } from "@/types/FoodTypes";

const { width: screenWidth } = Dimensions.get("window");

const NutritionCarousel = ({
  screenWidth,
  macroData,
  micronutrients,
  tags,
  chartConfig,
}: NutritionCarouselProps) => {
  // Create carousel items array for the three cards
  const carouselItems = [
    {
      key: "macros",
      title: "Macronutrients",
      content: (
        <View className="flex items-center justify-center h-full">
          <Text className="text-[24px] font-semibold mb-2">
            Macronutrient Breakdown
          </Text>
          <PieChart
            data={macroData}
            width={screenWidth * 0.8}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
      ),
    },
    {
      key: "micros",
      title: "Micronutrients",
      content: (
        <View className="px-4 justify-center h-full">
          <Text className="text-[24px] font-semibold mb-2">
            Micronutrient Progress
          </Text>
          {micronutrients.map((nutrient, index) => {
            const percent = Math.min((nutrient.value / nutrient.dv) * 100, 100);
            return (
              <View key={index} className="mb-4">
                <Text className="mb-1 text-base">
                  {nutrient.name}: {nutrient.value} ({percent.toFixed(0)}%)
                </Text>
                <View className="w-full h-3 bg-gray-300 rounded">
                  <View
                    className="h-3 rounded"
                    style={{
                      width: `${percent}%`,
                      backgroundColor:
                        percent < 50
                          ? "#27ae60"
                          : percent < 100
                          ? "#f39c12"
                          : "#c0392b",
                    }}
                  />
                </View>
              </View>
            );
          })}
        </View>
      ),
    },
    {
      key: "tags",
      title: "Highlights",
      content: (
        <View className="px-4 justify-start h-full">
          <Text className="text-[24px] font-semibold mb-16 mt-5 text-center">
            Highlights
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {tags.length > 0 ? (
              tags.map((tag, idx) => (
                <Text
                  key={idx}
                  className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-base"
                >
                  {tag}
                </Text>
              ))
            ) : (
              <Text className="text-base">No highlights available</Text>
            )}
          </View>
        </View>
      ),
    },
  ];

  const renderCarouselItem = ({
    item,
  }: {
    item: (typeof carouselItems)[0];
  }) => {
    return (
      <View
        className="bg-gray-100 rounded-lg mb-8 self-center"
        style={{
          width: screenWidth * 0.9,
          height: screenWidth * 0.7, // Consistent height for all cards
          padding: 16,
        }}
      >
        {item.content}
      </View>
    );
  };

  return (
    <View className="flex justify-center items-center shadow-md shadow-slate-600">
      <Carousel
        loop={true}
        width={screenWidth}
        height={screenWidth * 0.7}
        data={carouselItems}
        renderItem={({ item }) => renderCarouselItem({ item })}
        mode="horizontal-stack"
        modeConfig={{
          snapDirection: "left",
        }}
      />
    </View>
  );
};

export default NutritionCarousel;
