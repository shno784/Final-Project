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
  default: jest.fn(),
  exponentialDelay: jest.fn(),
  isNetworkOrIdempotentRequestError: jest.fn(() => false),
}));

// Mock react-native-async-storage/async-storage so it doesn't use real storage
jest.mock("@/utils/capitaliseWords", () => ({
  capitaliseWords: (s: string) => s,
}));

import axiosClient from "@/service/Reconnect";
import { fetchFoodData } from "@/service/USDA";

const mockedAxiosClient = axiosClient as jest.Mocked<typeof axiosClient>;

describe("fetchFoodData()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("fetches search, details, and image then returns formatted data", async () => {
    const fakeFood = { fdcId: 123, description: "apple" };

    // 1st GET: search
    mockedAxiosClient.get
      .mockResolvedValueOnce({ data: { foods: [fakeFood] } })
      // 2nd GET: details
      .mockResolvedValueOnce({
        data: {
          labelNutrients: { protein: { value: 5 }, fat: { value: 2 } },
          recipe: "Mix well",
        },
      })
      // 3rd GET: Unsplash
      .mockResolvedValueOnce({
        data: { results: [{ urls: { regular: "https://img" } }] },
      });

    const result = await fetchFoodData("apple");

    expect(mockedAxiosClient.get).toHaveBeenNthCalledWith(
      1,
      "https://api.nal.usda.gov/fdc/v1/foods/search",
      {
        params: {
          api_key: process.env.EXPO_PUBLIC_USDA_API_KEY,
          query: "apple",
        },
      }
    );
    expect(mockedAxiosClient.get).toHaveBeenNthCalledWith(
      2,
      "https://api.nal.usda.gov/fdc/v1/food/123",
      { params: { api_key: process.env.EXPO_PUBLIC_USDA_API_KEY } }
    );
    expect(mockedAxiosClient.get).toHaveBeenNthCalledWith(
      3,
      "https://api.unsplash.com/search/photos",
      {
        params: {
          query: "apple",
          client_id: process.env.EXPO_PUBLIC_UNSPLASH_ACCESS_KEY,
          per_page: 1,
        },
      }
    );

    expect(result).toEqual({
      name: "apple",
      imageUri: "https://img",
      nutrients: JSON.stringify([
        { name: "protein", value: 5 },
        { name: "fat", value: 2 },
      ]),
    });
  });

  it("throws when no foods are found", async () => {
    mockedAxiosClient.get.mockResolvedValueOnce({ data: { foods: [] } });
    await expect(fetchFoodData("nothing")).rejects.toThrow(
      "No food found for the query."
    );
  });

  it("throws when nutrients missing", async () => {
    // 1st GET: search returns a food
    mockedAxiosClient.get
      .mockResolvedValueOnce({
        data: { foods: [{ fdcId: 1, description: "foo" }] },
      })
      // 2nd GET: details returns null nutrients
      .mockResolvedValueOnce({ data: { labelNutrients: null } })
      // 3rd GET: Unsplash stub so code continues to nutrient check
      .mockResolvedValueOnce({ data: {} });

    await expect(fetchFoodData("foo")).rejects.toThrow(
      "No nutrients found for the food item."
    );
  });

  it("handles network errors", async () => {
    const netErr = new Error("fail");
    (netErr as any).code = "ERR_NETWORK";
    mockedAxiosClient.get.mockRejectedValueOnce(netErr);

    await expect(fetchFoodData("bar")).rejects.toThrow(
      "No internet connection. Please check your network."
    );
    expect(console.error).toHaveBeenCalledWith("No internet connection.");
  });

  it("handles other axios errors with status & message", async () => {
    const err = new Error("oops");
    (err as any).code = "OTHER";
    (err as any).response = {
      status: 401,
      data: { error: { message: "Invalid key" } },
    };
    mockedAxiosClient.get.mockRejectedValueOnce(err);

    await expect(fetchFoodData("baz")).rejects.toThrow(
      "Request failed with status 401: Invalid key"
    );
    expect(console.error).toHaveBeenCalledWith("Axios Error Details: ", {
      code: 401,
      message: "Invalid key",
    });
  });
});
