import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Button,
  Switch,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "hide_onboarding";

const { width } = Dimensions.get("window");

const slides = [
  {
    key: "slide1",
    title: "Welcome 👋",
    text: "Track what you eat and stay on top of your nutrition goals.",
    image: require("@/assets/images/placeholder.jpg"),
  },
  {
    key: "slide2",
    title: "Scan Your Food 📸",
    text: "Take a picture and we'll recognize your meal automatically.",
    image: require("@/assets/images/placeholder.jpg"),
  },
  {
    key: "slide3",
    title: "View Your History 📊",
    text: "Easily check what you've eaten and track your habits.",
    image: require("@/assets/images/placeholder.jpg"),
  },
];

export default function OnboardingModal() {
  const [visible, setVisible] = useState(false);
  const [dontShow, setDontShow] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const check = async () => {
      const value = await AsyncStorage.getItem(STORAGE_KEY);
      if (value !== "true") {
        setVisible(true);
      }
    };
    check();
  }, []);

  const handleClose = async () => {
    if (dontShow) {
      await AsyncStorage.setItem(STORAGE_KEY, "true");
    }
    setVisible(false);
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentSlide + 1 });
    } else {
      handleClose();
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.slide}>
      <Text style={styles.title}>{item.title}</Text>
      <Image source={item.image} style={styles.image} resizeMode="contain" />
      <Text style={styles.text}>{item.text}</Text>
    </View>
  );

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.modal}>
          <FlatList
            ref={flatListRef}
            data={slides}
            keyExtractor={(item) => item.key}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={renderItem}
            onScroll={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setCurrentSlide(index);
            }}
          />

          <View style={styles.footer}>
            <View style={styles.switchRow}>
              <Switch value={dontShow} onValueChange={setDontShow} />
              <Text style={{ marginLeft: 10 }}>Don't show again</Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={handleClose}>
                <Text style={styles.skip}>Skip</Text>
              </TouchableOpacity>
              <Button
                title={
                  currentSlide === slides.length - 1 ? "Get Started" : "Next"
                }
                onPress={handleNext}
              />
            </View>
          </View>
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
    padding: 20,
  },
  modal: {
    width: "100%",
    maxWidth: 340,
    height: 450,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  slide: {
    width: width - 60,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    paddingHorizontal: 10,
    color: "#444",
  },
  image: {
    width: 200,
    height: 200,
  },
  footer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skip: {
    color: "#888",
    fontSize: 16,
  },
});
