import AppButton from "@/components/AppButton";
import { View, Text, StyleSheet } from "react-native";
import { useColorScheme } from "nativewind";
import { LinearGradient } from "expo-linear-gradient";

const options = () => {
  const { colorScheme, setColorScheme } = useColorScheme();
  const toggleTheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[
          "#c2410c", // orange-700
          "#f97316", // orange-500
          colorScheme === "dark" ? "#000000" : "#ffffff",
        ]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.5 }}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
        <Text className="text-base text-text-main dark:text-text-d-main mb-4">
          Options
        </Text>
        <AppButton label="A button" onPress={toggleTheme} />
        <Text className="text-base text-black dark:text-white mb-4">
          MUSTARDDDDDDDDDDDDDDDDD
        </Text>
        <AppButton label="Back" variant="back" />
      </View>
    </View>
  );
};

export default options;
