// Mock axios so it doesn't make real network requests
jest.mock("axios", () => {
  const axiosInstance = {
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
    post: jest.fn(),
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
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// Mock zustand with our custom mock
jest.mock("zustand");

jest.mock("@/utils/foodLabels", () => jest.fn().mockReturnValue("banana"));

import axiosClient from "@/service/Reconnect";
import getBestMeaningfulLabel from "@/utils/foodLabels";
import { identifyFood } from "@/service/GoogleVision";

// Use types from the mocked axios client
const mockedAxiosClient = axiosClient as jest.Mocked<typeof axiosClient>;
const mockedLabelFn = getBestMeaningfulLabel as jest.MockedFunction<
  typeof getBestMeaningfulLabel
>;

describe("identifyFood()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("returns the label from Google Vision", async () => {
    mockedAxiosClient.post.mockResolvedValueOnce({
      data: {
        responses: [
          {
            labelAnnotations: [
              { description: "banana" },
              { description: "fruit" },
            ],
          },
        ],
      },
    });
    mockedLabelFn.mockReturnValueOnce("banana");

    const result = await identifyFood("fake-base64-image");

    expect(mockedAxiosClient.post).toHaveBeenCalledWith(
      expect.stringContaining("vision.googleapis.com/v1/images:annotate"),
      { requests: expect.any(Array) }
    );
    expect(result).toBe("banana");
  });

  it("throws on network error", async () => {
    const networkErr = new Error("Network failed");
    (networkErr as any).code = "ERR_NETWORK";
    mockedAxiosClient.post.mockRejectedValueOnce(networkErr);

    await expect(identifyFood("img")).rejects.toThrow(
      "No internet connection. Please check your network."
    );
    expect(console.error).toHaveBeenCalledWith("No internet connection.");
  });
});
