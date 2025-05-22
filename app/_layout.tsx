import "expo-dev-client";
import { useFonts } from "expo-font";
import { Stack } from "expo-router/stack";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Asset } from "expo-asset";
import { useAppState } from "../utils/globalstates";
import { FoodDatabase } from "../utils/foodDatabase";
import LoadingScreen from "../components/LoadingScreen";
import { useColorScheme } from "nativewind";
import { StatusBar } from "expo-status-bar";
import { initTailwindTextSize } from "../utils/textSize";
import AsyncStorage from "@react-native-async-storage/async-storage";

import "./global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const [ready, setReady] = useState(false);
  const { setLoading, isLoading } = useAppState();
  const { createTable } = FoodDatabase();
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
        await Asset.loadAsync([require("../assets/images/onboardwelcome.png")]);
        await Asset.loadAsync([require("../assets/images/onboardscan.png")]);
        await Asset.loadAsync([require("../assets/images/onboardchart.png")]);
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

  // Initialize text size settings
  useEffect(() => {
    const loadTextSize = async () => {
      try {
        const savedSize = await AsyncStorage.getItem("text-size");
        initTailwindTextSize((savedSize as any) || "text-base");
      } catch (error) {
        console.error("Failed to load text size", error);
        initTailwindTextSize("text-base");
      }
    };

    loadTextSize();
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
