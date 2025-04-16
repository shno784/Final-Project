import { ReactNode } from "react";
import { ViewStyle, ImageStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface AppButtonProps {
  label?: string;
  icon?: ReactNode; // Optional icon to show next to label
  onPress?: () => void;
  variant?: "primary" | "secondary" | "danger";
  style?: ViewStyle;
  disabled?: boolean;
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
export interface TipProps {
  tipKey: string;
  title?: string;
  message: string;
  showSwitch?: boolean;
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

export interface AppState {
  // State
  recentSearches: string[];
  errorMessage: string;
  hasSeenOnboarding: boolean;
  isLoading: boolean;

  // Actions
  addSearch: (query: string) => void;

  setError: (message: string) => void;
  clearError: () => void;

  setOnboardingSeen: () => void;

  setLoading: (loading: boolean) => void;
}
