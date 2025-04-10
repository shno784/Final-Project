import { ReactNode } from "react";
import { ViewStyle, ImageStyle } from "react-native";

export interface AppButtonProps {
  label: string | ReactNode;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "tertiary" | "danger" | "back";
  style?: ViewStyle;
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
