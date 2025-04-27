import React, { useState } from "react";
import { View, Text } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import type { ICarouselInstance } from "react-native-reanimated-carousel";
import { PieChart } from "react-native-chart-kit";
import { NutritionCarouselProps } from "@/types/FoodTypes";
import { PanGesture } from "react-native-gesture-handler";

// This component is used to display a carousel of nutrition information.
const NutritionCarousel = ({
  screenWidth,
  macroData,
  micronutrients,
  tags,
  chartConfig,
}: NutritionCarouselProps) => {
  const ref = React.useRef<ICarouselInstance>(null);
  // Define your carousel items
  const carouselItems = [
    {
      key: "macros",
      title: "Macronutrients",
      content: (
        <View className="flex items-center justify-center h-full">
          <Text className="text-[24px] font-semibold mb-2 text-text-head dark:text-text-d-head">
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
          <Text className="text-[24px] font-semibold mb-2 text-text-head dark:text-text-d-head">
            Micronutrient Progress
          </Text>
          {micronutrients.map((nutrient, index) => {
            const percent = Math.min((nutrient.value / nutrient.dv) * 100, 100);
            return (
              <View key={index} className="mb-4">
                <Text className="mb-1 text-base text-text-main dark:text-text-d-main">
                  {nutrient.name}: {nutrient.value} ({percent.toFixed(0)}%)
                </Text>
                <View className="w-full h-3 bg-white dark:bg-black rounded">
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
          <Text className="text-[24px] font-semibold mb-16 mt-5 text-center text-text-head dark:text-text-d-head">
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

  // Track the current slide index using onProgressChange
  const [currentIndex, setCurrentIndex] = useState(0);

  // Render each carousel slide item
  const renderCarouselItem = ({
    item,
  }: {
    item: (typeof carouselItems)[0];
  }) => {
    return (
      <View
        className="dark:bg-card-dark bg-card-light rounded-lg mb-8 self-center"
        style={{
          width: screenWidth * 0.9,
          height: screenWidth * 0.7,
          padding: 16,
        }}
      >
        {item.content}
      </View>
    );
  };

  return (
    <View className="flex justify-center items-center">
      <Carousel
        ref={ref}
        loop={true}
        pagingEnabled={true}
        snapEnabled={true}
        width={screenWidth}
        onConfigurePanGesture={(panGesture: PanGesture) => {
          panGesture.activeOffsetX([-10, 10]);
        }}
        height={screenWidth * 0.7}
        data={carouselItems}
        renderItem={({ item }) => renderCarouselItem({ item })}
        mode={"horizontal-stack"}
        modeConfig={{
          snapDirection: "left",
          stackInterval: 18,
        }}
        // onProgressChange updates the logical index as the carousel swipes
        onProgressChange={(_, absoluteProgress) => {
          const idx = Math.round(absoluteProgress);
          setCurrentIndex(idx);
        }}
      />

      {/* Pagination Dots */}
      <View className="flex flex-row justify-center items-center mt-4">
        {carouselItems.map((_, idx) => (
          <View
            key={idx}
            className={`w-3 h-3 mx-1 mb-2  rounded-full ${
              currentIndex === idx ? "bg-primary" : "bg-gray-300"
            }`}
          />
        ))}
      </View>
    </View>
  );
};

export default NutritionCarousel;
