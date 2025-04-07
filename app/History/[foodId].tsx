import AppButton from "@/components/AppButton";
import React from "react";
import { View, Text } from "react-native";

const food = () => {
  return (
    <View>
      <Text>Food</Text>
      <AppButton label="Back" variant="back" />
    </View>
  );
};

export default food;
