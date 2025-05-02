import { View, Text } from "react-native";
import { useColorScheme } from "nativewind";
import { useRouter } from "expo-router";
import { setTailwindTextSize, TextSize } from "@/utils/textSize";
import Icon from "@/components/Icon";
import { useEffect } from "react";
import AppText from "@/components/AppText";
import AppButton from "@/components/AppButton";
import { useAppState } from "@/utils/globalstates";

// Define text size options
const SIZES: { label: string; value: TextSize; icon: string }[] = [
  { label: "Small", value: "text-base", icon: "text" },
  { label: "Medium", value: "text-lg", icon: "text" },
  { label: "Large", value: "text-xl", icon: "text" },
];

// Map each TextSize option to an icon size in number
const iconSizes: Record<TextSize, number> = {
  "text-base": 16,
  "text-lg": 20,
  "text-xl": 24,
};

const Options = () => {
  const router = useRouter();
  const { colorScheme, setColorScheme } = useColorScheme();

  // Now get textSize and setter from your Zustand store
  const { textSize, setTextSize } = useAppState();

  // When the store textSize changes, update the tailwind text size
  useEffect(() => {
    setTailwindTextSize(textSize);
  }, [textSize]);

  const toggleTheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  // Instead of using AsyncStorage, update the global state
  const changeTextSize = (size: TextSize) => {
    setTextSize(size);
    setTailwindTextSize(size);
  };

  return (
    <View
      style={{ flex: 1 }}
      accessible
      accessibilityRole="none"
      className="bg-white dark:bg-black"
    >
      <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
        <Text className="text-[28px] font-bold text-text-main dark:text-text-d-main mb-6">
          Options
        </Text>

        {/* Theme toggle */}
        <AppButton
          label={
            colorScheme === "light"
              ? "Switch to Dark Mode "
              : "Switch to Light Mode"
          }
          accessibilityHint="Toggles between light and dark themes"
          onPress={toggleTheme}
          className="mb-6"
          icon={
            <Icon
              name={colorScheme === "dark" ? "sunny-outline" : "moon-outline"}
              size={24}
              className="mr-2"
            />
          }
        />

        {/* Text Size Options */}
        <AppText className="text-lg font-semibold text-text-main dark:text-text-d-main mb-3">
          Text Size
        </AppText>

        <View className="mb-6">
          {SIZES.map((size) => (
            <AppButton
              key={size.value}
              label={size.label}
              icon={
                <Icon
                  // Use a fixed icon based solely on the current color scheme instead of the size option
                  name="text"
                  size={iconSizes[size.value]}
                  className="mr-2"
                />
              }
              onPress={() => changeTextSize(size.value)}
              variant={textSize === size.value ? "primary" : "secondary"}
              className="mb-2"
              accessibilityHint={`Set text size to ${size.label}`}
            />
          ))}
        </View>

        <AppButton
          label="Calculate BMI"
          onPress={() => router.navigate("/bmi")}
          accessibilityHint="Navigate to BMI calculator"
          icon={<Icon name="calculator-outline" size={24} className="mr-2" />}
        />
      </View>
    </View>
  );
};

export default Options;
