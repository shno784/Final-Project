import { ErrorCardProps } from "../types/globalTypes";
import { View, Text, TouchableOpacity } from "react-native";

// This component is used to display an error message in a card format.
const ErrorCard = ({ message, onDismiss }: ErrorCardProps) => {
  return (
    <View className="bg-white dark:bg-black border-[2px] border-danger p-4 rounded-lg flex-row justify-between items-center my-4">
      <View>
        <Text className="text-danger font-bold mb-1">Error</Text>
        <Text className="text-danger">{message}</Text>
      </View>
      <TouchableOpacity onPress={onDismiss} className="p-2">
        <Text className="text-danger font-bold">X</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ErrorCard;
