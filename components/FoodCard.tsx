import { FoodCardProps } from "@/types/globalTypes";
import React from "react";
import { TouchableOpacity, Text, Image, StyleSheet } from "react-native";

const FoodCard = ({
  name,
  imageUri,
  onPress,
  style,
  textStyle,
  imageStyle,
}: FoodCardProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.card, style]}>
      <Image source={{ uri: imageUri }} style={[styles.image, imageStyle]} />
      <Text style={[styles.text, textStyle]}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3, // for Android shadow
    padding: 10,
    margin: 5,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default FoodCard;
