// app/components/CustomBackButton.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { AppButtonProps } from "@/types/globalTypes";
import { useRouter } from "expo-router";

export default function AppButton({
  label,
  onPress,
  variant = "primary",
  style,
  textStyle,
}: AppButtonProps) {
  const router = useRouter();

  // Handle back button press
  const handlePress = () => {
    if (variant === "back") {
      router.back();
    } else {
      onPress?.();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, styles[variant], style]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 6,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100,
  },
  text: {
    fontSize: 16,
    color: "#fff",
  },
  primary: {
    backgroundColor: "#3498db",
  },
  secondary: {
    backgroundColor: "#2ecc71",
  },
  back: {
    backgroundColor: "#777",
    position: "absolute",
    top: -5,
    left: 20,
    zIndex: 10,
  },
});
