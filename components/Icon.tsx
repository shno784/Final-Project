import { Ionicons } from "@expo/vector-icons";
import { IconProps } from "@/types/globalTypes";
import { cssInterop } from "nativewind";

cssInterop(Ionicons, {
  className: {
    target: "style",
    nativeStyleToProp: {
      color: true,
    },
  },
});
// This component is used to display an icon using Ionicons library while allowing for custom styling and size using Nativewind.
const Icon = ({ name, size, className }: IconProps) => {
  return (
    <Ionicons
      name={name}
      size={size}
      className={`text-text-head dark:text-text-d-head ${className ?? ""}`}
    />
  );
};

export default Icon;
