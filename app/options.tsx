import AppButton from "@/components/AppButton";
import { View, Text, StyleSheet } from "react-native";
import { useColorScheme } from "nativewind";

const options = () => {
  const { colorScheme, setColorScheme } = useColorScheme();
  const toggleTheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  return (
    <View style={{ flex: 1 }} className="bg-white dark:bg-black">
      <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
        <Text className="text-base text-text-main dark:text-text-d-main mb-4">
          Options
        </Text>
        <AppButton label="A button" onPress={toggleTheme} />
        <Text className="text-base text-black dark:text-white mb-4">
          MUSTARDDDDDDDDDDDDDDDDD
        </Text>
      </View>
    </View>
  );
};

export default options;
