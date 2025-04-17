import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Home from "@/app/index";
import { useAppState } from "@/utils/Globalstates";
import { useRouter } from "expo-router";
import { processData } from "@/utils/ProcessData";
import pickImage from "@/utils/pickImage";

// Mock everything
jest.mock("@/utils/Globalstates");
jest.mock("expo-router");
jest.mock("@/utils/ProcessData");
jest.mock("@/utils/pickImage");
jest.mock("@/components/USDAFoodSearch", () => ({
  __esModule: true,
  default: ({
    value,
    onChangeText,
  }: {
    value: string;
    onChangeText: (text: string) => void;
  }) => (
    <TextInput
      testID="search-input"
      value={value}
      onChangeText={onChangeText}
      placeholder="Search Food"
    />
  ),
}));

import { TextInput } from "react-native";

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

  it("shows error when search is empty", () => {
    const { getByText } = render(<Home />);
    fireEvent.press(getByText("Search"));
    expect(setErrorMock).toHaveBeenCalledWith("Search query cannot be empty");
  });

  it("performs search and navigates on valid query", async () => {
    (processData as jest.Mock).mockResolvedValue({
      name: "Apple",
      nutrients: "[]",
    });

    const { getByText, getByTestId } = render(<Home />);
    const input = getByTestId("search-input");
    fireEvent.changeText(input, "apple");
    await fireEvent.press(getByText("Search"));

    expect(addSearchMock).toHaveBeenCalledWith("apple");
    expect(setLoadingMock).toHaveBeenCalledWith(true);
    expect(processData).toHaveBeenCalledWith("apple");
    expect(routerPushMock).toHaveBeenCalledWith("/History");
  });

  it("navigates to camera and history screens", () => {
    const { getByText } = render(<Home />);
    fireEvent.press(getByText("Scan Food"));
    expect(routerNavigateMock).toHaveBeenCalledWith("/camera");
    fireEvent.press(getByText("Food History"));
    expect(routerNavigateMock).toHaveBeenCalledWith("/History");
  });

  it("calls pickImage when Add An Image is pressed", () => {
    const { getByText } = render(<Home />);
    fireEvent.press(getByText("Add An Image"));
    expect(pickImage).toHaveBeenCalled();
  });
});
