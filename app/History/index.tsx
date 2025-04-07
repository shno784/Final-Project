import { View, Text } from "react-native";
import AppButton from "@/components/AppButton";

const history = () => {
  return (
    <View>
      <Text>history</Text>
      <AppButton label="Back" variant="back" />
    </View>
  );
};

export default history;
