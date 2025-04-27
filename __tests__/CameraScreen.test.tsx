import React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";
import type { RenderAPI } from "@testing-library/react-native";

jest.useFakeTimers(); // Use fake timers for async operations
jest.mock("expo-sqlite", () => ({
  openDatabaseAsync: jest.fn(),
}));

//Mock AsyncStorage (must come first)
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

//Mock expo-camera (forward testID & stub takePictureAsync)
jest.mock("expo-camera", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    useCameraPermissions: () => [{ granted: true }, jest.fn()],
    CameraView: React.forwardRef((props: any, ref: any) => {
      // expose a fake takePictureAsync on the ref
      React.useImperativeHandle(ref, () => ({
        takePictureAsync: jest.fn(async () => ({ uri: "fake-uri" })),
      }));
      return (
        <View ref={ref} testID={props.testID}>
          {props.children}
        </View>
      );
    }),
  };
});

//Mock expo‑router so router.replace / push are safe no‑ops
jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
  }),
}));

//Auto‑mock your Icon
jest.mock("@/components/Icon");

//Mock your Zustand store
jest.mock("@/utils/globalstates");

//Stub OneTimeTip & ErrorCard
jest.mock("@/components/OneTimeTip", () => () => null);
jest.mock("@/components/ErrorCard", () => () => null);

//Mock pickImage util so “Add An Image” doesn’t call real API
jest.mock("@/utils/pickImage", () =>
  jest.fn(async () => ({
    name: "MockImageFood",
    imageUri: "mock-image-uri",
    nutrients: "[]",
    recipe: null,
  }))
);

//Mock FoodDatabase so expo-sqlite never runs
jest.mock("@/utils/foodDatabase", () => ({
  FoodDatabase: () => ({
    insertFoodItem: jest.fn(),
  }),
}));

// 6️⃣ Import your screen (after all mocks)
import CameraScreen from "@/app/camera";
import * as globalStateModule from "@/utils/globalstates";

const useAppStateMock = jest.mocked(globalStateModule.useAppState);

describe("CameraScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAppStateMock.mockReturnValue({
      isLoading: false,
      errorMessage: "",
      setLoading: jest.fn(),
      setError: jest.fn(),
      clearError: jest.fn(),
      recentSearches: [],
      addSearch: jest.fn(),
      hasSeenOnboarding: false,
      setOnboardingSeen: jest.fn(),
      userData: null,
      setUserData: jest.fn(),
      reset: jest.fn(),
    } as any);
  });

  it("renders scan overlay", () => {
    const screen = render(<CameraScreen />) as RenderAPI;
    expect(screen.getByText("Scanning for barcode...")).toBeTruthy();
  });
});

describe("CameraScreen additional tests", () => {
  it("toggles the torch when pressed", () => {
    const screen = render(<CameraScreen />);
    fireEvent.press(screen.getByTestId("torch-button"));
  });

  it("scans a barcode successfully", async () => {
    const mockProcess = jest
      .spyOn(require("@/utils/processBarcode"), "default")
      .mockResolvedValue({
        name: "BC",
        imageUri: "",
        nutrients: "[]",
        recipe: null,
      });
    const screen = render(<CameraScreen />);
    await act(async () => {
      fireEvent(screen.getByTestId("mockCameraView"), "onBarcodeScanned", {
        data: "123456",
      });
    });
    expect(mockProcess).toHaveBeenCalledWith("123456");
  });

  it("picks an image from the gallery when tapped", async () => {
    const screen = render(<CameraScreen />);
    await act(async () => {
      fireEvent.press(screen.getByTestId("pick-image-button"));
    });
    // pickImage mock returns an object, you can assert insertFoodItem was called
  });

  it("handles taking a picture from the camera", async () => {
    const screen = render(<CameraScreen />);
    await act(async () => {
      fireEvent.press(screen.getByTestId("take-picture-button"));
    });
  });
});
