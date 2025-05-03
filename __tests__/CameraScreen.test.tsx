import {
  act,
  fireEvent,
  render,
  RenderAPI,
} from "@testing-library/react-native";

jest.useFakeTimers(); // Use fake timers for async operations

// Mock database so it doesn't use real storage
jest.mock("expo-sqlite", () => ({
  openDatabaseAsync: jest.fn(),
}));

// Mock the async-storage so it doesn't use real storage
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// Load manual mock from zustand.ts
jest.mock("zustand");

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

//Auto‑mock Icon
jest.mock("@/components/Icon");

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

import CameraScreen from "@/app/camera";
import { useAppState } from "@/utils/globalstates";

describe("CameraScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAppState.setState({
      isLoading: false,
      errorMessage: "",
      recentSearches: [],
      addSearch: jest.fn(),
      hasSeenOnboarding: false,
      userData: null,
    });
    // Spy on the zustand store methods
    jest.spyOn(useAppState.getState(), "setLoading");
    jest.spyOn(useAppState.getState(), "setError");
    jest.spyOn(useAppState.getState(), "clearError");
    jest.spyOn(useAppState.getState(), "addSearch");
    jest.spyOn(useAppState.getState(), "setOnboardingSeen");
    jest.spyOn(useAppState.getState(), "setUserData");
    jest.spyOn(useAppState.getState(), "reset");
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
  });

  it("handles taking a picture from the camera", async () => {
    const screen = render(<CameraScreen />);
    await act(async () => {
      fireEvent.press(screen.getByTestId("take-picture-button"));
    });
  });
});
