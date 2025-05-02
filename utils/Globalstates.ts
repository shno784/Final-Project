import { create } from "zustand";
import { persist, createJSONStorage  } from "zustand/middleware";
import { AppState } from "@/types/globalTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { capitaliseWords } from "./capitaliseWords";
import { TextSize } from "./textSize";

// This is the global state for the app. It uses Zustand for state management and AsyncStorage for persistence.
export const useAppState = create<AppState>()(
  persist(
    (set, get) => ({
      // Recent Searches
      recentSearches: [],
      addSearch: (query: string) => {

        const existing = get().recentSearches.filter(
          (item) => capitaliseWords(item) !== capitaliseWords(query)
        );

        set({ recentSearches: [capitaliseWords(query), ...existing].slice(0, 10) });
      },

      // Error Handling
      errorMessage: "",
      setError: (message: string) => set({ errorMessage: message }),
      clearError: () => set({ errorMessage: "" }),

      // Onboarding
      hasSeenOnboarding: false,
      setOnboardingSeen: () => set({ hasSeenOnboarding: true }),

      isLoading: false,
      setLoading: (loading: boolean) => set({ isLoading: loading }),

      //User data
      userData: null,
      setUserData: (data) => set({ userData: data }),
      reset: () => set({ userData: null }),

      // Text Size
      textSize: "text-base",
      setTextSize: (size: TextSize) => {
        set({ textSize: size });
      },
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        recentSearches: state.recentSearches,
        hasSeenOnboarding: state.hasSeenOnboarding,
        userData: state.userData,
        textSize: state.textSize,
      }),
    }
  )
);
