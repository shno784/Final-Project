import { TouchableOpacity, Text, View } from "react-native";
import { AppButtonProps } from "@/types/globalTypes";
import AppText from "./AppText";

// This component is a customisable button that can be used throughout the app.
export default function AppButton({
  label,
  onPress,
  variant = "primary",
  style,
  className,
  icon,
  testID,
  accessibilityHint,
  disabled = false,
  accessible,
}: AppButtonProps) {
  // Choose variant-specific classes for background color
  let variantClasses = "";
  switch (variant) {
    case "primary":
      variantClasses = "border-[2px] border-black dark:border-white bg-primary";
      break;
    case "secondary":
      variantClasses =
        "border-[2px] border-black dark:border-white bg-secondary";
      break;
    case "danger":
      variantClasses = "border-[2px] border-black dark:border-white bg-danger";
      break;
    default:
      break;
  }
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      accessible={accessible}
      activeOpacity={0.7}
      accessibilityHint={accessibilityHint}
      className={`py-[14px] px-[16px] rounded-[8px] my-[6px] min-w-[100px] items-center justify-center ${variantClasses} ${
        className ?? ""
      }`}
      style={style}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {icon && <View>{icon}</View>}
        <AppText
          className={`text-center text-text-head dark:text-text-d-head font-bold uppercase`}
          numberOfLines={1}
        >
          {label}
        </AppText>
      </View>
    </TouchableOpacity>
  );
}
