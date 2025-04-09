import AppButton from "@/components/AppButton";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import { Button, Text, View } from "react-native";
import ImagePicker from "@/utils/ImagePicker";
import { ProcessImage } from "@/utils/ProcessImage";
import { useFoodDatabase } from "@/utils/FoodDatabase";
import { BarcodeProps } from "@/types/CameraTypes";
import { BarcodeScan } from "@/service/OpenFoodFacts";
import { useRouter } from "expo-router";
import OneTimeTip from "@/components/OneTimeTip";

const camera = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState<boolean>(false);
  const ref = useRef<CameraView>(null);
  const [hasScanned, setHasScanned] = useState(false);
  const { insertFoodItem } = useFoodDatabase();

  const router = useRouter();
  let scanning = false;

  if (!permission) {
    // Still loading permissions
    return <View />;
  }

  if (!permission.granted) {
    // Permissions not yet granted
    return (
      <View className="flex-1 justify-center">
        <Text className="text-center pb-3">
          We need your permission to show the camera
        </Text>
        <Button title="Grant permission" onPress={requestPermission} />
      </View>
    );
  }

  const takePicture = async () => {
    console.log("pressed take picture");
    const photo = await ref.current?.takePictureAsync();
    if (photo) {
      console.log("Processing image...");
      await ProcessImage(photo.uri, insertFoodItem);
      router.push("/History");
    }
  };

  const handlePress = (action: () => void) => {
    return () => {
      setTorch(false);
      action();
    };
  };

  const handleBarcodeScanned = ({ type, data }: BarcodeProps) => {
    if (scanning || hasScanned) return;
    scanning = true; // block future calls

    if (!hasScanned) {
      setHasScanned(true);
      BarcodeScan(data);
      router.push("/History");
    }
  };

  return (
    <CameraView
      className="flex-1"
      facing="back"
      ref={ref}
      enableTorch={torch}
      barcodeScannerSettings={{
        barcodeTypes: ["ean13", "ean8", "upc_a", "code39", "code128", "itf14"],
      }}
      onBarcodeScanned={hasScanned ? undefined : handleBarcodeScanned}
    >
      <OneTimeTip
        tipKey="camera"
        title="Scan Mode"
        message="Point your camera at food and take a picture to start analysis."
      />
      {/* Show scanning indicator when barcode has not been scanned */}
      {!hasScanned && (
        <View className="absolute bottom-[50px] self-center bg-black/60 px-4 py-2 rounded">
          <Text className="text-white text-[16px]">
            Scanning for barcode...
          </Text>
        </View>
      )}
      {/* Overlay container for buttons */}
      <View className="absolute inset-0" pointerEvents="box-none">
        <View className="flex-1 justify-center">
          <View className="absolute top-[60px] right-[20px] items-center">
            {/* Toggle flashlight */}
            <AppButton
              label={torch ? "Turn Flashlight Off" : "Turn Flashlight On"}
              className="w-[120px] h-[200px] bg-black/50 rounded-[8px] justify-center items-center mx-[10px]"
              onPress={() => setTorch((prev: any) => !prev)}
            />
            {/* Upload an image */}
            <AppButton
              label="Add an Image"
              className="w-[120px] h-[200px] bg-black/50 rounded-[8px] justify-center items-center mx-[10px]"
              onPress={handlePress(() => {
                ImagePicker(insertFoodItem);
              })}
            />
            {/* Take picture */}
            <AppButton
              label="Take Picture"
              className="w-[120px] h-[200px] bg-black/50 rounded-[8px] justify-center items-center mx-[10px]"
              onPress={handlePress(takePicture)}
            />
          </View>
          <AppButton label="Back" variant="back" />
        </View>
      </View>
    </CameraView>
  );
};

export default camera;
