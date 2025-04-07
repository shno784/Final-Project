import AppButton from "@/components/AppButton";
import { View, Text } from "react-native";

const options = () => {
  return (
    <View>
      <Text>Options</Text>
      <AppButton label="Back" variant="back" />
    </View>
  );
};

export default options;
