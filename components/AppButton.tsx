// app/components/CustomBackButton.tsx
import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { AppButtonProps } from "@/types/globalTypes";

export default function AppButton({
  label,
  onPress,
  variant = "primary",
  style,
  className,
  icon,
  disabled = false,
}: AppButtonProps) {
  // Choose variant-specific classes for background color and position
  let variantClasses = "";
  switch (variant) {
    case "primary":
      variantClasses = "border-[2px] border-primary";
      break;
    case "secondary":
      variantClasses = "border-[2px] border-secondary";
      break;
    case "danger":
      variantClasses = "border-[2px] border-danger";
      break;
    default:
      break;
  }
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      className={`py-[14px] px-[16px] rounded-[8px] my-[6px] min-w-[100px] items-center justify-center ${variantClasses} ${
        className ?? ""
      }`}
      style={style}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {icon && <View>{icon}</View>}
        <Text
          className={`text-[15.5px] text-center text-text-head dark:text-text-d-head font-bold uppercase`}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
