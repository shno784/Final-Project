import { TextStyle, ViewStyle, ImageStyle } from "react-native";

export interface AppButtonProps {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "tertiary" | "back";
  style?: ViewStyle;
  textStyle?: string;
  className?: string;
}

export interface FoodCardProps {
  name: string;
  imageUri: string;
  onPress?: () => void;
  onLongPress?: () => void;
  className?: string;
  imageStyle?: ImageStyle;
}
