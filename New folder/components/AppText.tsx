import React, { JSX } from "react";
import { Text as RNText, TextProps } from "react-native";
import { useColorScheme } from "nativewind";

// Cast RNText so TypeScript knows about defaultProps
const TextComponent = RNText as unknown as {
  (props: TextProps): JSX.Element;
  defaultProps?: { className?: string };
};

export default function AppText({
  children,
  className = "",
  style,
  ...props
}: TextProps & { className?: string }) {
  const { colorScheme } = useColorScheme();

  // Get the default text size from TextComponent.defaultProps if set, otherwise fallback to "text-base"
  const defaultSize = TextComponent.defaultProps?.className || "text-base";

  // Remove any explicit text size from the passed className
  const filteredClassName = className
    .split(" ")
    .filter((cls) => !["text-base", "text-lg", "text-xl"].includes(cls))
    .join(" ");

  // Determine text color if not provided
  const hasTextColor =
    className.includes("text-text-") ||
    className.includes("text-white") ||
    className.includes("text-black");
  const textColorClass = !hasTextColor
    ? colorScheme === "dark"
      ? "text-text-d-main"
      : "text-text-main"
    : "";

  // Merge defaultSize with filteredClassName so the dynamic size takes effect
  const finalClassName =
    `${defaultSize} ${textColorClass} ${filteredClassName}`.trim();

  return (
    <RNText className={finalClassName} style={style} {...props}>
      {children}
    </RNText>
  );
}
