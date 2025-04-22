import AppButton from "@/components/AppButton";
import { View, Text } from "react-native";
import { useColorScheme } from "nativewind";
import { useRouter } from "expo-router";

const options = () => {
  const router = useRouter();
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
        <AppButton
          label={
            colorScheme == "light"
              ? "Switch to Dark Mode "
              : "Switch to Light Mode"
          }
          onPress={toggleTheme}
        />
        <AppButton
          label="Calculate BMI"
          onPress={() => router.navigate("/bmi")}
        />
      </View>
    </View>
  );
};

export default options;
