import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  Modal,
  TextInput,
  Image,
  Alert,
} from "react-native";
import AppButton from "@/components/AppButton";
import FoodCard from "@/components/FoodCard";
import { useFoodDatabase } from "@/utils/FoodDatabase";
import { FoodRow } from "@/types/DatabaseTypes";
import { useRouter } from "expo-router";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as ImagePicker from "expo-image-picker";
import OneTimeTip from "@/components/OneTimeTip";

const History = () => {
  const [foodItems, setFoodItems] = useState<FoodRow[]>([]);
  const [ismodalVisible, setIsModalVisible] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodRow | null>(null);
  const [newName, setNewName] = useState<string>("");
  const [newImageUri, setNewImageUri] = useState<string>("");

  const { updateFoodItem, deleteFoodItem, getAllFoodItems } = useFoodDatabase();
  const { showActionSheetWithOptions } = useActionSheet();

  const router = useRouter();

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const items = await getAllFoodItems();
        setFoodItems(items);
      } catch (error) {
        console.error("Failed to fetch food items:", error);
      }
    };
    fetchFoodItems();
  }, []);

  // Function to handle the action sheet options
  const handleLongPress = (food: FoodRow) => {
    showActionSheetWithOptions(
      {
        options: ["Edit", "Delete", "Cancel"],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 2,
        title: food.name,
      },
      async (selectIndex) => {
        if (selectIndex === 0) {
          // Edit option selected
          setEditingFood(food);
          setNewName(food.name);
          setNewImageUri(food.imageUri);
          setIsModalVisible(true);
        } else if (selectIndex === 1) {
          Alert.alert(
            "Delete Food",
            `Are you sure you want to delete "${food.name}"?`,
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                  await deleteFoodItem(food.id);
                  const updated = await getAllFoodItems();
                  setFoodItems(updated);
                },
              },
            ],
            { cancelable: true }
          );
        }
      }
    );
  };

  const pickNewImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setNewImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!editingFood) return;

    const updatedFood = {
      ...editingFood,
      name: newName,
      imageUri: newImageUri,
      recipe: editingFood.recipe ?? undefined,
    };

    await updateFoodItem(updatedFood);
    const updatedList = await getAllFoodItems();
    setFoodItems(updatedList);
    setIsModalVisible(false);
    setEditingFood(null);
  };

  return (
    <View className="flex-1">
      <Modal visible={ismodalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-center bg-black/50 p-5">
          <View className="bg-white rounded-xl p-5">
            <Text className="text-xl font-semibold mb-3">Edit Food</Text>
            <TextInput
              className="border border-gray-300 rounded-md p-2.5 mb-2.5"
              placeholder="Food name"
              value={newName}
              onChangeText={setNewName}
            />

            <Image
              source={{ uri: newImageUri }}
              className="w-full h-[150px] rounded-md my-2.5"
            />

            <AppButton label="Change Image" onPress={pickNewImage} />
            <AppButton label="Save" onPress={handleSave} />
            <Button
              title="Cancel"
              color="red"
              onPress={() => setIsModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
      <OneTimeTip
        tipKey="history"
        title="View History"
        message={
          "Tap a card to view details.\nHold a card to edit or delete it."
        }
      />
      <ScrollView className="flex-1 p-[15px] bg-white dark:bg-black">
        <Text className="text-2xl mb-4 text-center">History</Text>
        <AppButton label="Back" variant="back" />

        <View className="flex flex-row flex-wrap justify-between">
          {foodItems.map((food) => (
            <FoodCard
              key={food.id}
              name={food.name}
              imageUri={food.imageUri}
              onLongPress={() => handleLongPress(food)}
              onPress={() => {
                router.push(`/History/${food.id}`);
              }}
              className="w-[45%] my-2.5"
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default History;
