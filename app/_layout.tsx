import { useFonts } from "expo-font";
import { Stack } from "expo-router/stack";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Asset } from "expo-asset";
import "@/app/global.css";
import { useAppState } from "@/utils/Globalstates";
import { useFoodDatabase } from "@/utils/FoodDatabase";
import LoadingScreen from "@/components/LoadingScreen";
import { useColorScheme } from "nativewind";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const [ready, setReady] = useState(false);
  const { setLoading, isLoading } = useAppState();
  const { createTable } = useFoodDatabase();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  //create the database table when the app starts
  useEffect(() => {
    const createDBTable = async () => {
      await createTable();
      console.log("Table created or already exists.");
    };
    createDBTable();
  }, []);

  // Preload all images (local)
  useEffect(() => {
    const prepare = async () => {
      try {
        // Preload all images (local)
        await Asset.loadAsync([require("@/assets/images/placeholder.jpg")]);
      } catch (e) {
        console.warn("Asset preload failed", e);
      } finally {
        // Set to false when the app starts just incase
        setLoading(false);
        setReady(true);
      }
    };

    prepare();
  }, []);

  useEffect(() => {
    if (ready && loaded) {
      SplashScreen.hideAsync();
    }
  }, [ready, loaded]);

  if (!ready || !loaded) return null;

  return (
    <ActionSheetProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <Stack screenOptions={{ headerShown: false }} />
        {isLoading && <LoadingScreen />}
      </GestureHandlerRootView>
    </ActionSheetProvider>
  );
}
