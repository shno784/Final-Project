// app/components/CustomBackButton.tsx
import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { AppButtonProps } from "@/types/globalTypes";
import { useRouter } from "expo-router";

export default function AppButton({
  label,
  onPress,
  variant = "primary",
  style, // Additional inline style if needed
  textStyle, // Tailwind classes for the text (renamed from textStyle)
  className, // Tailwind classes for the container
}: AppButtonProps) {
  const router = useRouter();

  // Handle back button press if variant is "back"
  const handlePress = () => {
    if (variant === "back") {
      router.back();
    } else {
      onPress?.();
    }
  };

  // Choose variant-specific classes for background color and position
  let variantClasses = "";
  switch (variant) {
    case "primary":
      variantClasses = "bg-primary-light dark:bg-primary-dark";
      break;
    case "secondary":
      variantClasses = "bg-secondary-light dark:bg-secondary-dark";
      break;
    case "tertiary":
      // Adjust the absolute positioning values as needed
      variantClasses = "bg-tertiary-light dark:bg-tertiary-dark";
      break;
    case "back":
      // Adjust the absolute positioning values as needed
      variantClasses = "bg-back-light dark:bg-back-dark";
      break;
    default:
      break;
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      // Tailwind classes for padding, margin, min-width, rounded corners, etc.
      className={`py-[14px] px-[16px] rounded-[8px] my-[6px] min-w-[100px] items-center justify-center ${variantClasses} ${
        className ?? ""
      }`}
      style={style} // Optional inline style override if desired
    >
      <Text
        className={`text-[15.5px] text-center text-text-light dark:text-text-dark font-bold uppercase`}
        numberOfLines={1}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
