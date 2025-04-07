import { TextStyle, ViewStyle } from "react-native";

export interface AppButtonProps {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "back";
  style?: ViewStyle;
  textStyle?: TextStyle;
}
