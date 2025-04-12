import { ReactNode } from "react";
import { ViewStyle, ImageStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface AppButtonProps {
  label?: string;
  icon?: ReactNode; // Optional icon to show next to label
  onPress?: () => void;
  variant?: "primary" | "secondary" | "danger";
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

export interface IconProps {
  name: keyof typeof Ionicons.glyphMap;
  size: number;
  className?: string;
}

export interface ErrorCardProps {
  message: string;
  onDismiss: () => void;
}
