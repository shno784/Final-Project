import { useEffect, useState } from "react";
import { Modal, View, Text, Switch } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppButton from "./AppButton";

interface Props {
  tipKey: string;
  title?: string;
  message: string;
  showSwitch?: boolean;
}

export default function OneTimeTip({
  tipKey,
  title = "Tip",
  message,
  showSwitch = true,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const check = async () => {
      const value = await AsyncStorage.getItem(`tip_${tipKey}`);
      if (value !== "true") {
        setVisible(true);
      }
    };
    check();
  }, [tipKey]);

  const dismiss = async () => {
    if (dontShowAgain) {
      await AsyncStorage.setItem(`tip_${tipKey}`, "true");
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="fade">
      <View className="flex-1 bg-black/40 justify-center items-center p-6">
        <View className="w-full max-w-[320px] bg-white dark:bg-black rounded-[16px] p-5 items-center">
          <Text className="text-xl font-semibold mb-[10px] text-text-head dark:text-text-d-head">
            {title}
          </Text>
          <Text className="text-base text-text-main dark:text-text-d-main text-center text-[#444] mb-5">
            {message}
          </Text>
          {showSwitch && (
            <View className="flex-row items-center mb-[15px]">
              <Switch value={dontShowAgain} onValueChange={setDontShowAgain} />
              <Text className="ml-2 text-text-main dark:text-text-d-main">
                Don't show again
              </Text>
            </View>
          )}
          <AppButton label="Got it" onPress={dismiss} className="mt-3" />
        </View>
      </View>
    </Modal>
  );
}
