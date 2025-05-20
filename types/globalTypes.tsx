import { ReactNode } from "react";
import { ViewStyle, ImageStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TextSize } from "@/utils/textSize";

export interface AppButtonProps {
  label?: string;
  icon?: ReactNode;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "danger";
  style?: ViewStyle;
  disabled?: boolean;
  className?: string;
  testID?: string;
  accessibilityHint?: string; // For screen readers
  accessible?: boolean; // For accessibility
  haptic?: "selection" | "impactMedium" | "notificationSuccess";
}

export interface FoodCardProps {
  name: string;
  imageUri: string;
  onPress?: () => void;
  onLongPress?: () => void;
  className?: string;
  imageStyle?: ImageStyle;
  accessibilityHint?: string;
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
  userData: UserFormInputProps | null;
  textSize: TextSize;

  // Actions
  addSearch: (query: string) => void;
  setError: (message: string) => void;
  clearError: () => void;
  setOnboardingSeen: () => void;
  setLoading: (loading: boolean) => void;
  setUserData: (data: UserFormInputProps) => void;
  reset: () => void;
  setTextSize: (size: TextSize) => void;
}

export interface UserFormInputProps {
  gender: "male" | "female" | "";
  age: number;
  height: number;
  weight: number;
  activityMultiplier: number;
  unitType: "metric" | "imperial";
}
