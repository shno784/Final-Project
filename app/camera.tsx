import React, { useState, useRef } from "react";
import { Text, View, TouchableWithoutFeedback, Keyboard } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { processData } from "@/utils/processData";
import { FoodDatabase } from "@/utils/foodDatabase";
import { useRouter } from "expo-router";
import { BarcodeProps } from "@/types/CameraTypes";
import { useAppState } from "@/utils/globalstates";

import AppButton from "@/components/AppButton";
import OneTimeTip from "@/components/OneTimeTip";
import ErrorCard from "@/components/ErrorCard";
import pickImage from "@/utils/pickImage";
import Icon from "@/components/Icon";
import ProccessBarcode from "@/utils/processBarcode";

const CameraScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState<boolean>(false);
  const cameraRef = useRef<CameraView>(null);
  const scanningRef = useRef<boolean>(false);
  const [hasScanned, setHasScanned] = useState<boolean>(false);
  const { insertFoodItem } = FoodDatabase();
  const router = useRouter();
  const { setLoading, errorMessage, setError, clearError } = useAppState();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center dark:bg-black">
        <Text className="text-center pb-3 text-text-head dark:text-text-d-head text-xl">
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

  // Handle taking a picture and processing the image
  const takePicture = async () => {
    try {
      const photo = await cameraRef.current?.takePictureAsync();
      if (photo) {
        setLoading(true);
        const food = await processData(photo.uri);

        await insertFoodItem(food);
        router.replace("/History");
      }
    } catch (error) {
      console.error("Scan workflow error:", error);
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePress = (action: () => void) => () => {
    setTorch(false);
    action();
  };

  // helper that both clears the error *and* re‑enables scanning:
  const onDismissError = () => {
    clearError();
    scanningRef.current = false;
    setHasScanned(false);
  };

  const handleBarcodeScanned = async ({ data }: BarcodeProps) => {
    if (scanningRef.current || hasScanned) return;

    scanningRef.current = true;
    setLoading(true);
    try {
      const food = await ProccessBarcode(data);
      await insertFoodItem(food);

      setHasScanned(true);
      router.replace("/History");
    } catch (error) {
      console.error("Scan workflow error:", error);
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={true}>
        <View className="flex-1 relative">
          {/* Top portion: Camera view */}
          <View className="flex-1">
            <CameraView
              testID="mockCameraView"
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
              accessibilityHint="Camera preview for scanning food or barcodes"
            >
              <OneTimeTip
                tipKey="camera"
                title="Tip"
                message="Point your camera at food and take a picture to start analysis."
              />
              {/* Barcode Text */}
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
                testID="torch-button"
                icon={
                  <Icon
                    name={torch ? "flashlight" : "flashlight-outline"}
                    size={30}
                    className="ml-1"
                  />
                }
                variant="secondary"
                accessibilityHint="Toggles the camera flash"
                className="w-20 mt-4 rounded-full px-3 py-2"
                onPress={() => setTorch((prev) => !prev)}
              />
              <AppButton
                testID="take-picture-button"
                icon={<Icon name="camera-outline" size={32} className="ml-1" />}
                className="ml-2 h-24 w-24 mr-2 rounded-full"
                onPress={handlePress(takePicture)}
                variant="primary"
                accessibilityHint="Captures a photo for food processing"
              />
              <AppButton
                testID="pick-image-button"
                icon={<Icon name="image-outline" size={32} className="ml-1" />}
                className="h-20 w-20 mt-4 rounded-full px-3 py-2"
                onPress={handlePress(async () => {
                  pickImage();
                  router.replace("/History");
                })}
                variant="secondary"
                accessibilityHint="Opens image library to select a photo"
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* Error overlay */}
      {errorMessage !== "" && (
        <View className="absolute inset-0 z-50 justify-center items-center">
          <ErrorCard message={errorMessage} onDismiss={onDismissError} />
        </View>
      )}
    </>
  );
};

export default CameraScreen;
