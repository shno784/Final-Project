import { Text, StyleSheet } from "react-native";
import { PacmanIndicator } from "react-native-indicators";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

// This component is used to display a loading screen with a Pacman indicator.
const LoadingScreen = () => {
  return (
    <SafeAreaProvider style={styles.absolute} className="absolute inset-0 z-50">
      <SafeAreaView className="flex-1 justify-center items-center bg-white dark:bg-black">
        <Text className="mb-1 text-3xl absolute top-80 text-text-head dark:text-text-d-head">
          Loading...
        </Text>
        <PacmanIndicator size={102} color="#14B8A6" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  absolute: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default LoadingScreen;
