import { FoodCardProps } from "@/types/globalTypes";
import { TouchableOpacity, Text, Image, StyleSheet } from "react-native";

// This component is used to display a food item in a card format.
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
      className={`bg-card-light dark:bg-card-dark border-[2px] border-primary rounded-xl shadow p-2 m-2 items-center w-44 ${className}`}
      onLongPress={onLongPress}
    >
      <Image
        source={{ uri: imageUri }}
        className={`w-full h-32 rounded-lg overflow-hidden ${imageStyle}`}
      />
      <Text
        className={`text-md text-center dark:text-text-d-main text-text-main font-bold uppercase mt-3`}
        numberOfLines={1}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
};

export default FoodCard;
