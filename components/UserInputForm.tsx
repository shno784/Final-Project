import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { UserFormInputProps } from "../types/globalTypes";
import { useColorScheme } from "nativewind";
import Icon from "./Icon";
import AppButton from "./AppButton";

type Props = {
  onSubmit: (data: UserFormInputProps) => void;
};

const UserInputForm: React.FC<Props> = ({ onSubmit }) => {
  const [unitType, setUnitType] =
    useState<UserFormInputProps["unitType"]>("metric");
  const [gender, setGender] = useState<UserFormInputProps["gender"]>("");
  const [age, setAge] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [heightFt, setHeightFt] = useState<string>("");
  const [heightIn, setHeightIn] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [activityMultiplier, setActivityMultiplier] = useState<string>("");
  const [isActivityOpen, setIsActivityOpen] = useState(false);

  const { colorScheme } = useColorScheme();
  const inputColor = colorScheme === "dark" ? "#FFFFFF" : "#1C1C1C";

  const isMetricValid =
    unitType === "metric" ? !!height : !!heightFt && !!heightIn;
  // determine if submit should be disabled
  const isFormValid =
    !!gender && !!age && isMetricValid && !!weight && !!activityMultiplier;

  const handleSubmit = () => {
    if (!isFormValid) return;

    // Convert height and weight to metric if unitType is imperial
    const finalHeight =
      unitType === "metric"
        ? Number(height)
        : (Number(heightFt) * 12 + Number(heightIn)) * 2.54;

    const finalWeight =
      unitType === "metric" ? Number(weight) : Number(weight) * 0.45359237;

    onSubmit({
      gender,
      age: Number(age),
      height: finalHeight,
      weight: finalWeight,
      activityMultiplier: Number(activityMultiplier),
      unitType,
    });
  };

  return (
    <View className="p-4 bg-white dark:bg-black">
      {/* Units */}
      <Text className="mt-4 text-base font-medium text-text-head dark:text-text-d-head">
        Units
      </Text>
      <View className="border border-primary rounded-md mt-1">
        <Picker
          selectedValue={unitType}
          onValueChange={(value) => setUnitType(value)}
          onFocus={() => setIsActivityOpen(true)}
          onBlur={() => setIsActivityOpen(false)}
          className="h-full text-text-head dark:text-text-d-head"
        >
          <Picker.Item label="Metric" value="metric" color={inputColor} />
          <Picker.Item label="Imperial" value="imperial" color={inputColor} />
        </Picker>
      </View>

      {/* Gender */}
      <Text className="mt-4 text-base font-medium text-text-head dark:text-text-d-head">
        Gender
      </Text>
      <View className="border border-primary rounded-md mt-1">
        <Picker
          selectedValue={gender}
          onValueChange={(value) => setGender(value)}
          onFocus={() => setIsActivityOpen(true)}
          onBlur={() => setIsActivityOpen(false)}
          className="h-12 text-text-head dark:text-text-d-head"
        >
          <Picker.Item label="Select gender" value="" color={inputColor} />
          <Picker.Item label="Male" value="male" color={inputColor} />
          <Picker.Item label="Female" value="female" color={inputColor} />
        </Picker>
      </View>

      {/* Age */}
      <Text className="mt-4 text-base font-medium text-text-head dark:text-text-d-head">
        Age
      </Text>
      <TextInput
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        placeholder="Enter your age"
        placeholderTextColor={inputColor}
        className="border border-primary rounded-md px-3 py-2 mt-1 text-text-head dark:text-text-d-head placeholder:text-text-head dark:placeholder:text-text-d-head"
      />

      {/* Height & Weight */}
      {unitType === "metric" ? (
        <>
          <Text className="mt-4 text-base font-medium text-text-head dark:text-text-d-head">
            Height (cm)
          </Text>
          <TextInput
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
            placeholder="e.g. 170"
            placeholderTextColor={inputColor}
            className="border border-primary rounded-md px-3 py-2 mt-1 text-text-head dark:text-text-d-head placeholder:text-text-head dark:placeholder:text-text-d-head"
          />
          <Text className="mt-4 text-base font-medium text-text-head dark:text-text-d-head">
            Weight (kg)
          </Text>
          <TextInput
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            placeholder="e.g. 65"
            placeholderTextColor={inputColor}
            className="border border-primary rounded-md px-3 py-2 mt-1 text-text-head dark:text-text-d-head placeholder:text-text-head dark:placeholder:text-text-d-head"
          />
        </>
      ) : (
        <>
          <Text className="mt-4 text-base font-medium text-text-head dark:text-text-d-head">
            Height ft & in
          </Text>
          <View className="flex-row space-x-2 mt-1">
            <TextInput
              value={heightFt}
              onChangeText={setHeightFt}
              keyboardType="numeric"
              placeholder="Feet"
              placeholderTextColor={inputColor}
              className="flex-1 border border-primary rounded-md px-3 py-2 text-text-head dark:text-text-d-head placeholder:text-text-head dark:placeholder:text-text-d-head"
            />
            <TextInput
              value={heightIn}
              onChangeText={setHeightIn}
              keyboardType="numeric"
              placeholder="Inches"
              placeholderTextColor={inputColor}
              className="flex-1 border border-primary rounded-md px-3 py-2 text-text-head dark:text-text-d-head placeholder:text-text-head dark:placeholder:text-text-d-head"
            />
          </View>
          <Text className="mt-4 text-base font-medium text-text-head dark:text-text-d-head">
            Weight (lbs)
          </Text>
          <TextInput
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            placeholder="e.g. 150"
            placeholderTextColor={inputColor}
            className="border border-primary rounded-md px-3 py-2 mt-1 text-text-head dark:text-text-d-head placeholder:text-text-head dark:placeholder:text-text-d-head"
          />
        </>
      )}

      {/* Activity Level */}
      <Text className="mt-4 text-base font-medium text-text-head dark:text-text-d-head">
        Activity Level
      </Text>
      <View className="border border-primary rounded-md mt-1">
        <Picker
          mode="dropdown"
          selectedValue={activityMultiplier}
          onValueChange={(value) => setActivityMultiplier(value)}
          onFocus={() => setIsActivityOpen(true)}
          onBlur={() => setIsActivityOpen(false)}
          className="h-12 text-text-head dark:text-text-d-head"
        >
          <Picker.Item
            label="Select activity level"
            value=""
            color={inputColor}
          />
          <Picker.Item
            label="Sedentary (little/no exercise)"
            value="1.2"
            color={inputColor}
          />
          <Picker.Item
            label="Lightly active (1–3 days/week)"
            value="1.375"
            color={inputColor}
          />
          <Picker.Item
            label="Moderately active (3–5 days/week)"
            value="1.55"
            color={inputColor}
          />
          <Picker.Item
            label="Very active (6–7 days/week)"
            value="1.725"
            color={inputColor}
          />
          <Picker.Item
            label="Super active (physical job/training)"
            value="1.9"
            color={inputColor}
          />
        </Picker>
      </View>

      <AppButton
        label="Submit"
        onPress={handleSubmit}
        disabled={!isFormValid}
        icon={
          !isFormValid ? (
            <Icon name="lock-closed-outline" size={24} className="mr-2" />
          ) : null
        }
        className={`${!isFormValid ? "bg-gray-400" : ""} mt-6`}
        haptic="notificationSuccess"
      />
    </View>
  );
};
export default UserInputForm;
