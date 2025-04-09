import { FoodCardProps } from "@/types/globalTypes";
import React from "react";
import { TouchableOpacity, Text, Image, StyleSheet } from "react-native";

const FoodCard = ({
  name,
  imageUri,
  onPress,
  onLongPress,
  className,
  imageStyle,
}: FoodCardProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-white dark:bg-black rounded-lg shadow-md shadow-slate-600 p-4 ${className}`}
      onLongPress={onLongPress}
    >
      <Image
        source={{ uri: imageUri }}
        style={[{ width: "100%", height: 150, borderRadius: 8 }, imageStyle]}
      />
      <Text
        className={`text-[15.5px] text-center dark:text-text-dark text-text-light font-bold uppercase pt-3`}
        numberOfLines={1}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
};

export default FoodCard;
