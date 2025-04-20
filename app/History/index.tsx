import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Modal,
  TextInput,
  Image,
  Alert,
} from "react-native";
import AppButton from "@/components/AppButton";
import FoodCard from "@/components/FoodCard";
import { FoodDatabase } from "@/utils/foodDatabase";
import { FoodRow } from "@/types/FoodTypes";
import { useRouter } from "expo-router";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as ImagePicker from "expo-image-picker";
import OneTimeTip from "@/components/OneTimeTip";
import { useAppState } from "@/utils/globalstates";

const History = () => {
  const [foodItems, setFoodItems] = useState<FoodRow[]>([]);
  const [ismodalVisible, setIsModalVisible] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodRow | null>(null);
  const [newName, setNewName] = useState<string>("");
  const [newImageUri, setNewImageUri] = useState<string>("");

  const { updateFoodItem, deleteFoodItem, getAllFoodItems } = FoodDatabase();
  const { showActionSheetWithOptions } = useActionSheet();
  const { errorMessage, setError, clearError } = useAppState();

  const router = useRouter();

  // Fetch food items from the database when the component mounts
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

  // Handle the action sheet options
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

  // Handle saving the edited food item
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
      {/* Edit modal */}
      <Modal visible={ismodalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-center bg-black/60 p-5">
          <View className="bg-card-light dark:bg-card-dark rounded-xl p-5">
            <TextInput
              className="border-[2px] border-primary rounded-md p-2.5 mb-2.5 text-text-head dark:text-text-d-head placeholder:text-text-head dark:placeholder:text-text-d-head"
              placeholder="Food name"
              value={newName}
              onChangeText={setNewName}
            />

            <Image
              source={{ uri: newImageUri }}
              className="w-full h-[200px] rounded-md my-2.5"
            />

            <AppButton label="Change Image" onPress={pickNewImage} />
            <AppButton label="Save" onPress={handleSave} variant="secondary" />
            <AppButton
              label="Cancel"
              variant="danger"
              onPress={() => setIsModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
      {/* One time tip */}
      <OneTimeTip
        tipKey="history"
        title="Tip"
        message={
          "Tap a card to view details.\nHold a card to edit or delete it."
        }
      />
      {/* Main Content */}
      <ScrollView className="flex-1 p-[15px] pt-20 bg-white  dark:bg-black">
        <View className="relative w-full">
          <View className="mt-2 w-full">
            <Text className="text-[28px] font-bold mb-3 text-center text-text-head dark:text-text-d-head">
              History
            </Text>
          </View>
        </View>

        <>
          {foodItems.length === 0 ? (
            <View className="flex-1 justify-center items-center">
              <Text className="text-3xl font-bold mt-56 text-text-head dark:text-text-d-head">
                No items scanned yet
              </Text>
            </View>
          ) : (
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
          )}
        </>
      </ScrollView>
    </View>
  );
};

export default History;
