import { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  Button,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  }, []);

  const dismiss = async () => {
    if (dontShowAgain) {
      await AsyncStorage.setItem(`tip_${tipKey}`, "true");
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {showSwitch && (
            <View style={styles.switchRow}>
              <Switch value={dontShowAgain} onValueChange={setDontShowAgain} />
              <Text style={{ marginLeft: 10 }}>Don't show again</Text>
            </View>
          )}

          <Button title="Got it" onPress={dismiss} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    color: "#444",
    marginBottom: 20,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
});
