import AppButton from "@/components/AppButton";
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  FlashMode,
} from "expo-camera";
import { useState, useRef, useEffect } from "react";
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ImagePicker from "@/utils/ImagePicker";
import { ProcessImage } from "@/utils/ProcessImage";
import { useFoodDatabase } from "@/utils/FoodDatabase";
import { BarcodeProps } from "@/types/CameraTypes";
import { BarcodeScan } from "@/service/OpenFoodFacts";

const camera = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState<boolean>(false);
  const ref = useRef<CameraView>(null);
  const [hasScanned, setHasScanned] = useState(false);
  const { insertFoodItem } = useFoodDatabase();
  let scanning = false;

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
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
    scanning = true; // immediately block future calls

    if (!hasScanned) {
      setHasScanned(true);
      BarcodeScan(data);
      // Do something with the barcode data, like:
      // navigate to another screen, process it, etc.
    }
  };
  return (
    <CameraView
      style={styles.camera}
      facing={"back"}
      ref={ref}
      enableTorch={torch}
      barcodeScannerSettings={{
        barcodeTypes: ["ean13", "ean8", "upc_a", "code39", "code128", "itf14"],
      }}
      onBarcodeScanned={hasScanned ? undefined : handleBarcodeScanned}
    >
      {/* Only show if scanner hasn't scanned */}
      {!hasScanned && (
        <View style={styles.scannerIndicator}>
          <Text style={styles.scannerText}>Scanning for barcode...</Text>
        </View>
      )}
      {/* Overlay container for buttons */}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            {/* Use a button to toggle flashlight on/off */}
            <AppButton
              label={torch ? "Turn Flashlight Off" : "Turn Flashlight On"}
              style={styles.button}
              textStyle={styles.text}
              onPress={() => setTorch((prev: any) => !prev)}
            />
            {/* Upload an Image */}
            <AppButton
              label="Add an Image"
              style={styles.button}
              textStyle={styles.text}
              onPress={handlePress(() => {
                ImagePicker(insertFoodItem);
              })}
            />
            {/* Take Picture */}
            <AppButton
              label="Take Picture"
              textStyle={styles.text}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  // Position the button container absolutely near the top
  buttonContainer: {
    position: "absolute",
    top: 60,
    right: 20,
    alignItems: "center",
  },
  // Style each button to be smaller and more transparent
  button: {
    width: 120, // set a fixed width for smaller buttons
    height: 200, // fixed height for a compact look
    backgroundColor: "rgba(0, 0, 0, 0.5)", // black with 50% opacity
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  text: {
    fontSize: 16, // smaller font size
    fontWeight: "bold",
    color: "white",
  },
  scannerIndicator: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  scannerText: {
    color: "#fff",
    fontSize: 16,
  },
});
