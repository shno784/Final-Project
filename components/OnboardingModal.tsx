import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  Dimensions,
  Switch,
  TouchableOpacity,
} from "react-native";
import { useAppState } from "../utils/globalstates";
import Carousel from "react-native-reanimated-carousel";
import AppButton from "./AppButton";
import { ReduceMotion } from "react-native-reanimated";

const { width } = Dimensions.get("window");

const slides = [
  {
    key: "slide1",
    title: "Welcome 👋",
    text: "Track what you eat and stay on top of your nutrition goals.",
    image: require("../assets/images/onboardwelcome.png"),
  },
  {
    key: "slide2",
    title: "Scan Your Food 📸",
    text: "Take a picture and we'll recognise your meal automatically.",
    image: require("../assets/images/onboardscan.png"),
  },
  {
    key: "slide3",
    title: "View Your History 📊",
    text: "Easily check what you've eaten and track your habits.",
    image: require("../assets/images/onboardchart.png"),
  },
];

// Renders an instruction modal when someone first opens the app
export default function OnboardingModal() {
  const [visible, setVisible] = useState(false);
  const [dontShow, setDontShow] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { hasSeenOnboarding, setOnboardingSeen } = useAppState();
  const carouselRef = useRef<any>(null);

  // Check if the user has seen the onboarding screen before
  useEffect(() => {
    const check = async () => {
      if (hasSeenOnboarding !== true) {
        setVisible(true);
      }
    };
    check();
  }, []);

  // Set the onboarding screen as seen
  const handleClose = async () => {
    if (dontShow) {
      setOnboardingSeen();
    }
    setVisible(false);
  };

  // Handle the next button click, if user is on last slide, close modal
  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      carouselRef.current?.scrollTo({
        index: currentSlide + 1,
        animated: true,
      });
    } else {
      handleClose();
    }
  };

  const renderItem = ({ item }: { item: (typeof slides)[0] }) => (
    <View className="items-center justify-center">
      <Text className="text-lg text-text-head dark:text-text-d-head font-bold mb-2 text-center">
        {item.title}
      </Text>
      <Image
        source={item.image}
        className="w-[250px] h-[200px] mx-auto"
        resizeMode="contain"
      />
      <Text className="text-base text-center mt-3 mb-3 text-text-main dark:text-text-d-main">
        {item.text}
      </Text>
    </View>
  );

  if (!visible) return null;

  return (
    // Modal to show onboarding slides
    <Modal transparent animationType="fade" presentationStyle="overFullScreen">
      <View className="flex-1 bg-black/40 justify-center items-center p-5">
        <View className=" bg-white dark:bg-black  border border-primary rounded-[16px] py-5 px-2.5">
          <Carousel
            ref={carouselRef}
            data={slides}
            renderItem={renderItem}
            width={width - 80}
            height={300}
            loop={false}
            autoPlay={false}
            onSnapToItem={(index) => setCurrentSlide(index)}
            withAnimation={{
              type: "timing",
              config: {
                reduceMotion: ReduceMotion.Never,
              },
            }}
          />
          <View className="px-2.5">
            <View className="flex-row items-center mb-4">
              <Switch value={dontShow} onValueChange={setDontShow} />
              <Text className="ml-2 text-text-main dark:text-text-d-main">
                Don't show again
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <TouchableOpacity onPress={handleClose}>
                <Text className="text-base text-text-main dark:text-text-d-main">
                  Skip
                </Text>
              </TouchableOpacity>
              <AppButton
                label={
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
