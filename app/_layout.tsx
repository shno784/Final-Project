import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SQLiteProvider } from "expo-sqlite";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

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
      <Stack screenOptions={{ headerShown: false }} />
    </SQLiteProvider>
  );
}
