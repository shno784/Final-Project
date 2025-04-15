import React, { useState, useRef } from "react";
import { Text, View } from "react-native";
import AppButton from "@/components/AppButton";
import { CameraView, useCameraPermissions } from "expo-camera";
import OneTimeTip from "@/components/OneTimeTip";
import pickImage from "@/utils/pickImage";
import { processData } from "@/utils/ProcessData";
import { useFoodDatabase } from "@/utils/FoodDatabase";
import { BarcodeScan } from "@/service/OpenFoodFacts";
import { useRouter } from "expo-router";
import { BarcodeProps } from "@/types/CameraTypes";
import Icon from "@/components/Icon";
import ProccessBarcode from "@/utils/ProccessBarcode";
import { useAppState } from "@/utils/Globalstates";

const CameraScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState<boolean>(false);
  const cameraRef = useRef<CameraView>(null);
  const [hasScanned, setHasScanned] = useState<boolean>(false);
  const { insertFoodItem } = useFoodDatabase();
  const router = useRouter();
  let scanning = false;
  const { setLoading } = useAppState();

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
      setLoading(true);
      await processData(photo.uri);
      setLoading(false);
      router.replace("/History");
    }
  };

  // Helper to turn off torch before executing the action.
  const handlePress = (action: () => void) => () => {
    setTorch(false);
    action();
  };

  // Barcode scanning callback.
  const handleBarcodeScanned = ({ data }: BarcodeProps) => {
    if (scanning || hasScanned) return;
    scanning = true; // Block further barcode scans.
    if (!hasScanned) {
      setHasScanned(true);
      setLoading(true);
      ProccessBarcode(data, insertFoodItem);
      setLoading(false);
      router.replace("/History");
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
      <View className="p-4 bg-white dark:bg-black rounded-sm">
        <View className="flex-row justify-center gap-3 mb-4">
          <AppButton
            icon={
              <Icon
                name={torch ? "flashlight" : "flashlight-outline"}
                size={30}
                className="ml-1"
              />
            }
            variant="secondary"
            className="w-20 mt-4 rounded-full px-3 py-2"
            onPress={() => setTorch((prev) => !prev)}
          />
          <AppButton
            icon={<Icon name="camera-outline" size={32} className="ml-1" />}
            className="ml-2 h-24 w-24 mr-2 rounded-full"
            onPress={handlePress(takePicture)}
            variant="primary"
          />
          <AppButton
            icon={<Icon name="image-outline" size={32} className="ml-1" />}
            className="h-20 w-20 mt-4 rounded-full px-3 py-2"
            onPress={handlePress(async () => {
              pickImage();
              router.replace("/History");
            })}
            variant="secondary"
          />
        </View>
      </View>
    </View>
  );
};

export default CameraScreen;
