jest.mock("axios", () => ({
  isAxiosError: jest.fn(() => true),
  get: jest.fn(),
  post: jest.fn(),
}));

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("@/service/USDA", () => ({
  __esModule: true,
  fetchFoodData: jest.fn().mockResolvedValue({
    name: "Apple",
    imageUri: "mock-image-uri",
    nutrients: "[]",
    recipe: null,
  }),
}));
jest.mock("@/service/GoogleVision", () => ({
  __esModule: true,
  identifyFood: jest.fn(),
}));
jest.mock("@/utils/processData", () => ({
  __esModule: true,
  processData: jest.fn(),
}));

// 2️⃣ Stub native‐heavy UI
jest.mock("@/components/OnboardingModal", () => () => null);
jest.mock("react-native-gesture-handler", () => {
  const { View } = require("react-native");
  return {
    GestureHandlerRootView: ({ children }: any) => <View>{children}</View>,
  };
});
jest.mock("react-native-reanimated-carousel", () => ({
  __esModule: true,
  default: ({ children }: any) => <>{children}</>,
}));

// 3️⃣ Stub out SQLite entirely so no expo‑sqlite handles leak
jest.mock("@/utils/foodDatabase", () => ({
  FoodDatabase: () => ({
    insertFoodItem: jest.fn(),
    getAllFoodItems: jest.fn().mockResolvedValue([]),
    getFoodItemById: jest.fn(),
    updateFoodItem: jest.fn(),
    deleteFoodItem: jest.fn(),
    createTable: jest.fn(),
  }),
}));

import React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";
import Home from "@/app/index";
import { useAppState } from "@/utils/globalstates";
import { useRouter } from "expo-router";
import pickImage from "@/utils/pickImage";

// Silence console logs and errors during tests
beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  (console.log as jest.Mock).mockRestore();
  (console.error as jest.Mock).mockRestore();
});

// Mock Zustand, router, pickImage and the search box
jest.mock("@/utils/globalstates");
jest.mock("expo-router");
jest.mock("@/utils/pickImage");
jest.mock("@/components/USDAFoodSearch", () => {
  const { TextInput } = require("react-native");
  return {
    __esModule: true,
    default: ({ value, onChangeText }: any) => (
      <TextInput
        testID="search-input"
        value={value}
        onChangeText={onChangeText}
      />
    ),
  };
});

describe("Home Screen", () => {
  const setErrorMock = jest.fn();
  const clearErrorMock = jest.fn();
  const addSearchMock = jest.fn();
  const setLoadingMock = jest.fn();
  const routerPushMock = jest.fn();
  const routerNavigateMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppState as unknown as jest.Mock).mockReturnValue({
      errorMessage: "",
      setError: setErrorMock,
      clearError: clearErrorMock,
      addSearch: addSearchMock,
      setLoading: setLoadingMock,
    });
    (useRouter as jest.Mock).mockReturnValue({
      push: routerPushMock,
      navigate: routerNavigateMock,
    });
  });

  it("shows error when search is empty", async () => {
    const { getByText } = render(<Home />);
    await act(async () => {
      fireEvent.press(getByText("Search"));
    });
    expect(setErrorMock).toHaveBeenCalledWith("Search query cannot be empty");
  });

  it("performs search and navigates on valid query", async () => {
    // Setup process data to return something
    const { processData } = require("@/utils/processData") as {
      processData: jest.Mock;
    };
    processData.mockResolvedValue({
      name: "Apple",
      imageUri: "mock-apple-uri",
      nutrients: "[]",
    });

    // Get the existing mock from the top of the file - don't try to redefine it!
    // This gets the already-mocked module
    const foodDatabaseMock = require("@/utils/foodDatabase");
    const insertFoodItemMock = foodDatabaseMock.FoodDatabase().insertFoodItem;

    const { getByText, getByTestId } = render(<Home />);
    const input = getByTestId("search-input");

    // Set input value and wait for state update
    await act(async () => {
      fireEvent.changeText(input, "apple");
    });

    // Press search and wait for all promises to resolve
    await act(async () => {
      fireEvent.press(getByText("Search"));
      // Let all microtasks (promises) complete with a longer timeout
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(addSearchMock).toHaveBeenCalledWith("apple");
    expect(setLoadingMock).toHaveBeenCalledWith(true);
    expect(processData).toHaveBeenCalledWith("apple");
    expect(routerPushMock).toHaveBeenCalledWith("/History");
  });

  it("navigates to camera and history screens", async () => {
    const { getByText } = render(<Home />);
    await act(async () => fireEvent.press(getByText("Scan Food")));
    expect(routerNavigateMock).toHaveBeenCalledWith("/camera");
    await act(async () => fireEvent.press(getByText("Food History")));
    expect(routerNavigateMock).toHaveBeenCalledWith("/History");
  });

  it("calls pickImage when Add An Image is pressed", async () => {
    const { getByText } = render(<Home />);
    await act(async () => fireEvent.press(getByText("Add An Image")));
    expect(pickImage).toHaveBeenCalled();
  });
});
