import React from "react";

// Mock axios so it doesn't make real network requests
jest.mock("axios", () => {
  const axiosInstance = {
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
    get: jest.fn(),
  };
  return {
    __esModule: true,
    default: {
      create: jest.fn(() => axiosInstance),
      isAxiosError: (err: any): err is Error & { code?: string } =>
        Boolean(err?.code),
    },
  };
});

// Mock axios-retry so it doesn't retry requests
jest.mock("axios-retry", () => ({
  __esModule: true,
  default: jest.fn(() => {
    /* no-op */
  }),
  exponentialDelay: jest.fn(),
  isNetworkOrIdempotentRequestError: jest.fn(() => false),
}));

// Mock react-native-async-storage/async-storage so it doesn't use real storage
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// Mock zustand with our custom mock
jest.mock("zustand");

import axiosClient from "@/service/Reconnect";
import { BarcodeScan } from "@/service/OpenFoodFacts";

// Mock the axios client to use our mocked version
const mockedAxiosClient = axiosClient as jest.Mocked<typeof axiosClient>;

describe("BarcodeScan()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("parses out nutrients and returns product details on success", async () => {
    // Arrange: fake a OpenFoodFacts "status:1" response
    mockedAxiosClient.get.mockResolvedValueOnce({
      data: {
        status: 1,
        product: {
          product_name: "Test Barley",
          image_url: "https://img.jpg",
          nutriments: {
            proteins_100g: 12.3,
            fat_100g: 4.5,
            carbohydrates_100g: 60,
          },
        },
      },
    });

    // Act
    const result = await BarcodeScan("0123456789");

    // Assert: correct endpoint & headers
    expect(mockedAxiosClient.get).toHaveBeenCalledWith(
      "https://world.openfoodfacts.org/api/v0/product/0123456789.json",
      {
        headers: {
          "User-Agent": "Food app - Version 1.0",
          Accept: "application/json",
        },
      }
    );

    // Should return parsed details
    expect(result).toEqual({
      name: "Test Barley",
      imageUri: "https://img.jpg",
      nutrients: JSON.stringify([
        { name: "proteins", value: 12.3 },
        { name: "fat", value: 4.5 },
        { name: "carbohydrates", value: 60 },
      ]),
    });
  });

  it("throws when product not found (status 0)", async () => {
    mockedAxiosClient.get.mockResolvedValueOnce({
      data: { status: 0 },
    });

    await expect(BarcodeScan("0000")).rejects.toThrow("Product not found.");
    expect(console.error).toHaveBeenCalledWith("Product not found.");
  });

  it("throws on network error", async () => {
    const netErr = new Error("fail");
    (netErr as any).code = "ERR_NETWORK";
    mockedAxiosClient.get.mockRejectedValueOnce(netErr);

    await expect(BarcodeScan("9999")).rejects.toThrow(
      "No internet connection. Please check your network."
    );
    expect(console.error).toHaveBeenCalledWith("No internet connection.");
  });

  it("throws for other axios errors with status & description", async () => {
    const err = new Error("oops");
    (err as any).code = "SOME_OTHER";
    // simulate .response.data.status.description
    (err as any).response = {
      status: 404,
      data: { status: { description: "Not found in OFF" } },
    };
    mockedAxiosClient.get.mockRejectedValueOnce(err);

    await expect(BarcodeScan("8888")).rejects.toThrow(
      "Request failed with status 404: Not found in OFF"
    );
  });
});
