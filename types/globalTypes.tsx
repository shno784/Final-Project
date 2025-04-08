import { TextStyle, ViewStyle, ImageStyle } from "react-native";

export interface AppButtonProps {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "back";
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export interface FoodCardProps {
  name: string;
  imageUri: string;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  imageStyle?: ImageStyle;
}
