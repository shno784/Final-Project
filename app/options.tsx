import AppButton from "@/components/AppButton";
import { useState } from "react";
import { View, Text, Button } from "react-native";
import { useColorScheme } from "nativewind";

const options = () => {
  const { colorScheme, setColorScheme } = useColorScheme();
  console.log(colorScheme);
  const toggleTheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  // Replace "dark" with "light" or "system" as needed
  return (
    <View className="flex-1 bg-body-light dark:bg-body-dark p-4 justify-center">
      <Text className="text-base text-text-main dark:text-text-d-main mb-4">
        Options
      </Text>
      <AppButton label="A button" onPress={toggleTheme} />
      <Text className="text-base text-black dark:text-white mb-4">
        "MUSTARDDDDDDDDDDDDDDDDD"
      </Text>
      <AppButton label="Back" variant="back" />
    </View>
  );
};

export default options;
