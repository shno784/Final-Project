import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import CameraScreen from "@/app/camera";
import { useCameraPermissions } from "expo-camera";

// Mock modules
jest.mock("expo-camera");
jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: jest.fn() }),
}));
jest.mock("@/utils/Globalstates", () => ({
  useAppState: () => ({ setLoading: jest.fn() }),
}));
jest.mock("@/utils/FoodDatabase", () => ({
  useFoodDatabase: () => ({ insertFoodItem: jest.fn() }),
}));

describe("CameraScreen", () => {
  const requestPermissionMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing when permission is undefined", () => {
    (useCameraPermissions as jest.Mock).mockReturnValue([
      undefined,
      requestPermissionMock,
    ]);
    const { toJSON } = render(<CameraScreen />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("prompts for permission when not granted", () => {
    (useCameraPermissions as jest.Mock).mockReturnValue([
      { granted: false },
      requestPermissionMock,
    ]);
    const { getByText } = render(<CameraScreen />);
    const grantBtn = getByText("Grant Permission");
    expect(grantBtn).toBeTruthy();
    fireEvent.press(grantBtn);
    expect(requestPermissionMock).toHaveBeenCalled();
  });

  it("shows scanning UI when permission granted", () => {
    (useCameraPermissions as jest.Mock).mockReturnValue([
      { granted: true },
      requestPermissionMock,
    ]);
    const { getByText } = render(<CameraScreen />);
    expect(getByText("Scanning for barcode...")).toBeTruthy();
  });
});
