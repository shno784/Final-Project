import axios from "axios";
import axiosRetry from "axios-retry";

// Create an Axios instance
const axiosClient = axios.create();

// Attach retry logic
axiosRetry(axiosClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      error.response?.status === 429 || // Rate limit
      (error.response?.status !== undefined && error.response.status >= 500)
    );
  },
});

export default axiosClient;
