import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import UserInputForm from "@/components/UserInputForm";
import AppButton from "@/components/AppButton";
import { UserFormInputProps } from "@/types/globalTypes";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAppState } from "@/utils/globalstates";

export default function BMIScreen() {
  const { userData, setUserData, reset } = useAppState();

  const [bmr, setBmr] = useState<number | null>(null);
  const [tdee, setTdee] = useState<number | null>(null);
  const [calorieGoals, setCalorieGoals] = useState<{
    maintain: number;
    lose: number;
    gain: number;
  } | null>(null);

  // Calculation helpers
  const calculateBMR = ({ gender, weight, height, age }: UserFormInputProps) =>
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  const calculateTDEE = (bmrValue: number, activityMultiplier: number) =>
    bmrValue * activityMultiplier;
  const getCalorieGoals = (tdeeValue: number) => ({
    maintain: tdeeValue,
    lose: tdeeValue - 500,
    gain: tdeeValue + 500,
  });

  // Recompute when userData changes
  useEffect(() => {
    if (userData) {
      const bmrValue = calculateBMR(userData);
      const tdeeValue = calculateTDEE(bmrValue, userData.activityMultiplier);
      setBmr(bmrValue);
      setTdee(tdeeValue);
      setCalorieGoals(getCalorieGoals(tdeeValue));
    } else {
      setBmr(null);
      setTdee(null);
      setCalorieGoals(null);
    }
  }, [userData]);

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-white dark:bg-black p-4"
      enableOnAndroid
      enableAutomaticScroll
      extraScrollHeight={200}
      keyboardOpeningTime={0}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
      accessible={true}
    >
      {!userData ? (
        <UserInputForm onSubmit={setUserData} />
      ) : (
        <View className="flex-1 justify-center items-center">
          <View className="w-full bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <Text className="text-2xl font-bold text-head dark:text-text-d-head mb-6 text-center">
              Your Results
            </Text>
            <View className="space-y-4 mb-6">
              <Text className="text-lg text-head dark:text-text-d-head text-center">
                BMR: {bmr?.toFixed(0)} kcal/day
              </Text>
            </View>
            <View className="flex-row justify-between space-x-4">
              <View className="flex-1 bg-white dark:bg-gray-700 rounded-lg p-4 items-center">
                <Text className="text-base font-medium text-red-500 mb-1">
                  Lose
                </Text>
                <Text className="text-xl font-bold text-head dark:text-text-d-head">
                  {calorieGoals?.lose.toFixed(0)}
                </Text>
                <Text className="text-base text-text-d-head dark:text-text-d-head">
                  cal/day
                </Text>
              </View>
              <View className="flex-1 bg-white dark:bg-gray-700 rounded-lg p-4 items-center">
                <Text className="text-base font-medium text-yellow-500 mb-1">
                  Maintain
                </Text>
                <Text className="text-xl font-bold text-head dark:text-text-d-head">
                  {calorieGoals?.maintain.toFixed(0)}
                </Text>
                <Text className="text-base text-text-d-head dark:text-text-d-head">
                  cal/day
                </Text>
              </View>
              <View className="flex-1 bg-white dark:bg-gray-700 rounded-lg p-4 items-center">
                <Text className="text-base font-medium text-green-500 mb-1">
                  Gain
                </Text>
                <Text className="text-xl font-bold text-head dark:text-text-d-head">
                  {calorieGoals?.gain.toFixed(0)}
                </Text>
                <Text className="text-base text-text-d-head dark:text-text-d-head">
                  cal/day
                </Text>
              </View>
            </View>
            <AppButton
              label="Reset"
              onPress={reset}
              className="mt-6 bg-red-500"
              accessibilityHint="Clears your BMI settings and returns to input form"
            />
          </View>
        </View>
      )}
    </KeyboardAwareScrollView>
  );
}
