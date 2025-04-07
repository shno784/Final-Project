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
import pickImage from "@/utils/ImagePicker";
import ProcessImage from "@/utils/ProcessImage";

const camera = () => {
  const [facing, setfacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [uri, setUri] = useState<string | null>(null);

  const [torch, setTorch] = useState<boolean>(false);
  const [cameraIsReady, setCameraIsReady] = useState<boolean>(false);

  const ref = useRef<CameraView>(null);

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
    setUri(photo?.uri ?? null);
    ProcessImage({ uri: photo.uri });
  };
  return (
    <CameraView
      style={styles.camera}
      facing={"back"}
      ref={ref}
      enableTorch={torch}
    >
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
              onPress={pickImage}
            />
            {/* Take Picture */}
            <AppButton
              label="Take Picture"
              textStyle={styles.text}
              onPress={takePicture}
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
});
