import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useFoodDatabase } from "@/utils/FoodDatabase";
import { FoodRow } from "@/types/DatabaseTypes";
import AppButton from "@/components/AppButton";

export default function FoodDetailPage() {
  const { id } = useLocalSearchParams();
  const { getFoodItemById } = useFoodDatabase();
  const [foodItem, setFoodItem] = useState<FoodRow | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      const item = await getFoodItemById(parseInt(id as string));
      setFoodItem(item || null);
    };

    fetchItem();
  }, [id]);

  if (!foodItem) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#333" />
        <Text>Loading food item...</Text>
      </View>
    );
  }

  // Parse nutrients from string to array
  let nutrients: { name: string; value: number }[] = [];

  try {
    nutrients = JSON.parse(foodItem.nutrients);
  } catch (err) {
    console.warn("Failed to parse nutrients JSON", err);
  }

  return (
    <ScrollView style={styles.container}>
      <AppButton label="Back" variant="back" />
      <Text style={styles.title}>{foodItem.name}</Text>

      <Image
        source={{ uri: foodItem.imageUri }}
        style={styles.image}
        resizeMode="cover"
      />

      <Text style={styles.sectionTitle}>Nutrients</Text>
      {nutrients.map((nutrient, index) => (
        <View key={index} style={styles.nutrientRow}>
          <Text style={styles.nutrientName}>{nutrient.name}</Text>
          <Text style={styles.nutrientValue}>{nutrient.value}</Text>
        </View>
      ))}

      {foodItem.recipe && (
        <>
          <Text style={styles.sectionTitle}>Recipe</Text>
          <Text style={styles.recipeText}>{foodItem.recipe}</Text>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  nutrientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  nutrientName: {
    fontSize: 16,
    color: "#555",
  },
  nutrientValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  recipeText: {
    fontSize: 16,
    color: "#333",
    marginTop: 8,
    lineHeight: 22,
  },
});
