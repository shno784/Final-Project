// app/components/CustomBackButton.tsx
import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { AppButtonProps } from "@/types/globalTypes";
import { useRouter } from "expo-router";

export default function AppButton({
  label,
  onPress,
  variant = "primary",
  style,
  className,
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
      variantClasses = "bg-button-primary dark:bg-button-d-primary";
      break;
    case "secondary":
      variantClasses = "bg-button-secondary dark:bg-button-d-secondary";
      break;
    case "tertiary":
      // Adjust the absolute positioning values as needed
      variantClasses = "bg-button-tertiary dark:bg-button-d-tertiary";
      break;
    case "back":
      // Adjust the absolute positioning values as needed
      variantClasses =
        "bg-button-back dark:bg-button-d-backabsolute top-0 left-0 w-1/3";
      break;
    case "danger":
      variantClasses = "bg-button-danger dark:bg-button-d-danger";
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
        className={`text-[15.5px] text-center text-text-head dark:text-text-d-head font-bold uppercase`}
        numberOfLines={1}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
