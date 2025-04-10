import React, { useState, useRef } from "react";
import { Text, View } from "react-native";
import AppButton from "@/components/AppButton";
import { CameraView, useCameraPermissions } from "expo-camera";
import OneTimeTip from "@/components/OneTimeTip";
import ImagePicker from "@/utils/ImagePicker";
import { ProcessImage } from "@/utils/ProcessImage";
import { useFoodDatabase } from "@/utils/FoodDatabase";
import { BarcodeScan } from "@/service/OpenFoodFacts";
import { useRouter } from "expo-router";
import { BarcodeProps } from "@/types/CameraTypes";
import { Ionicons } from "@expo/vector-icons";

const CameraScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState<boolean>(false);
  const cameraRef = useRef<CameraView>(null);
  const [hasScanned, setHasScanned] = useState<boolean>(false);
  const { insertFoodItem } = useFoodDatabase();
  const router = useRouter();
  let scanning = false;

  if (!permission) {
    // While permissions are loading, return an empty view.
    return <View />;
  }

  if (!permission.granted) {
    // Ask for permission if not already granted.
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-center pb-3 text-text-head text-xl">
          We need your permission to show the camera
        </Text>
        <AppButton
          label="Grant Permission"
          onPress={requestPermission}
          className="w-fit mx-auto block px-4 py-2"
        />
      </View>
    );
  }

  // Function to capture a photo.
  const takePicture = async () => {
    console.log("pressed take picture");
    const photo = await cameraRef.current?.takePictureAsync();
    if (photo) {
      console.log("Processing image...");
      await ProcessImage(photo.uri, insertFoodItem);
      router.push("/History");
    }
  };

  // Helper to turn off torch before executing the action.
  const handlePress = (action: () => void) => () => {
    setTorch(false);
    action();
  };

  // Barcode scanning callback.
  const handleBarcodeScanned = ({ type, data }: BarcodeProps) => {
    if (scanning || hasScanned) return;
    scanning = true; // Block further barcode scans.
    if (!hasScanned) {
      setHasScanned(true);
      BarcodeScan(data);
      router.push("/History");
    }
  };

  return (
    <View className="flex-1">
      {/* Top portion: Camera view */}
      <View className="flex-1">
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          ref={cameraRef}
          enableTorch={torch}
          barcodeScannerSettings={{
            barcodeTypes: [
              "ean13",
              "ean8",
              "upc_a",
              "code39",
              "code128",
              "itf14",
            ],
          }}
          onBarcodeScanned={hasScanned ? undefined : handleBarcodeScanned}
        >
          <AppButton label="Back" variant="back" className="top-20" />
          <OneTimeTip
            tipKey="camera"
            title="Scan Mode"
            message="Point your camera at food and take a picture to start analysis."
          />
          {/* Optionally overlay a scanning indicator */}
          {!hasScanned && (
            <View className="absolute bottom-[50px] self-center bg-black/60 px-4 py-2 rounded">
              <Text className="text-white text-[16px]">
                Scanning for barcode...
              </Text>
            </View>
          )}
        </CameraView>
      </View>

      {/* Bottom portion: Button container */}
      <View className="p-4 bg-body-light dark:bg-body-dark rounded-sm">
        <View className="flex-row justify-center gap-3 mb-4">
          <AppButton
            label={
              <Ionicons
                name={torch ? "flashlight" : "flashlight-outline"}
                size={30}
                color="white"
              />
            }
            variant="secondary"
            className="bg-black/50 -20 w-20 mt-4 rounded-full px-3 py-2"
            onPress={() => setTorch((prev) => !prev)}
          />
          <AppButton
            label={<Ionicons name="camera-outline" size={32} color="white" />}
            className="bg-black/50 ml-2 h-24 w-24 mr-2 rounded-full"
            onPress={handlePress(takePicture)}
            variant="danger"
          />
          <AppButton
            label={<Ionicons name="image-outline" size={32} color="white" />}
            className="bg-black/50 h-20 w-20 mt-4 rounded-full px-3 py-2"
            variant="tertiary"
            onPress={handlePress(() => {
              ImagePicker(insertFoodItem);
            })}
          />
        </View>
      </View>
    </View>
  );
};

export default CameraScreen;
