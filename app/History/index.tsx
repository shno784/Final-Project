import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import AppButton from "@/components/AppButton";
import FoodCard from "@/components/FoodCard";
import { useFoodDatabase } from "@/utils/FoodDatabase";
import { FoodRow } from "@/types/DatabaseTypes";
import { useRouter } from "expo-router";

const History = () => {
  const [imageUri, setImageUri] = useState<string>("");
  const [foodItems, setFoodItems] = useState<FoodRow[]>([]);
  const { getAllFoodItems } = useFoodDatabase();
  const router = useRouter();

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const items = await getAllFoodItems();
        setFoodItems(items); // Save to state
      } catch (error) {
        console.error("Failed to fetch food items:", error);
      }
    };
    fetchFoodItems();
  }, []); // runs only on component mount

  return (
    <ScrollView style={{ flex: 1, padding: 15 }}>
      <Text style={styles.header}>History</Text>
      <AppButton label="Back" variant="back" />

      {/* Grid container */}
      <View style={styles.cardsContainer}>
        {foodItems.map((food) => (
          <FoodCard
            key={food.id}
            name={food.name}
            imageUri={food.imageUri}
            onPress={() => {
              router.push(`/History/${food.id}`);
            }}
            style={styles.cardOverride}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  // This style overrides the card and forces it to be about half the available width.
  cardOverride: {
    width: "45%",
    marginVertical: 10,
  },
});

export default History;
