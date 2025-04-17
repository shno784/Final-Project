// tests/ui/USDAFoodSearch.test.tsx
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import USDAFoodSearch from "@/components/USDAFoodSearch";
import * as api from "@/service/Usda";

jest.mock("@/service/Usda");

describe("<USDAFoodSearch />", () => {
  it("shows suggestions and calls onSuggestionSelect", async () => {
    (api.fetchFoodData as jest.Mock).mockResolvedValue([
      { fdcId: 1, description: "Apple" },
      { fdcId: 2, description: "Banana" },
    ]);

    const onChange = jest.fn();
    const onSelect = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <USDAFoodSearch
        value=""
        onChangeText={onChange}
        onSuggestionSelect={onSelect}
      />
    );

    fireEvent.changeText(getByPlaceholderText("Search Food"), "Ap");
    await waitFor(() => {
      expect(getByText("Apple")).toBeTruthy();
    });

    fireEvent.press(getByText("Apple"));
    expect(onSelect).toHaveBeenCalledWith({ fdcId: 1, description: "Apple" });
  });
});
