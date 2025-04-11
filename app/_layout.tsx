import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SQLiteProvider } from "expo-sqlite";
import { useEffect, useState } from "react";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Asset } from "expo-asset";
import "@/app/global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    const prepare = async () => {
      try {
        // Preload all images (local)
        await Asset.loadAsync([require("@/assets/images/placeholder.jpg")]);
      } catch (e) {
        console.warn("Asset preload failed", e);
      } finally {
        setReady(true);
      }
    };

    prepare();
  }, []);

  useEffect(() => {
    if (ready && loaded) {
      SplashScreen.hideAsync();
    }
  }, [ready, loaded]); // ✅ wait until both are ready

  if (!ready || !loaded) return null;

  return (
    <SQLiteProvider
      databaseName={"food.db"}
      onInit={async (db) => {
        try {
          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS foods (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT,
              imageUri TEXT,
              recipe TEXT,
              nutrients TEXT
            );
          `);
          console.log("✅ Food table has been created or already exists.");
        } catch (error) {
          console.error("❌ Error during table creation:", error);
        }
      }}
    >
      <ActionSheetProvider>
        <GestureHandlerRootView>
          <Stack screenOptions={{ headerShown: false }} />
        </GestureHandlerRootView>
      </ActionSheetProvider>
    </SQLiteProvider>
  );
}
