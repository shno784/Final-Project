import axios from "axios";
import axiosClient from "./Reconnect";
import getBestMeaningfulLabel from "@/utils/FoodLabels";

const apiKey = process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY;

export async function identifyFood(base64Image: string) {
  if (!apiKey) {
    console.log("Google Vision API key is missing");
  }
  try {
    const endpoint = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

    const response = await axiosClient.post(endpoint, {
      requests: [
        {
          image: { content: base64Image },
          features: [{ type: "LABEL_DETECTION", maxResults: 5 }],
        },
      ],
    });
    // Get labels
    const labels = response.data.responses[0].labelAnnotations;
    //Filter label by common words like "food", "fruit", etc.
    const label = getBestMeaningfulLabel(labels);
    return label;
  } catch (error) {
    // Handle Axios errors
    if (axios.isAxiosError(error)) {
      const code = error.response?.status;
      const message = error.response?.data?.error?.message || error.message;
      console.error("Axios Error Details: ", { code, message });
      throw new Error(`Request failed with status ${code}: ${message}`);
    } else {
      throw error;
    }
  }
}
