import { create } from "zustand";
import { persist, createJSONStorage  } from "zustand/middleware";
import { AppState } from "@/types/globalTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";


export const useAppState = create<AppState>()(
  persist(
    (set, get) => ({
      // Recent Searches
      recentSearches: [],
      addSearch: (query: string) => {
        const trimmed = query.trim();
        if (!trimmed) return;

        const existing = get().recentSearches.filter(
          (item) => item.toLowerCase() !== trimmed.toLowerCase()
        );

        set({ recentSearches: [trimmed, ...existing].slice(0, 10) });
      },
      clearSearches: () => set({ recentSearches: [] }),

      // Error Handling
      errorMessage: "",
      setError: (message: string) => set({ errorMessage: message }),
      clearError: () => set({ errorMessage: "" }),

      // Onboarding
      hasSeenOnboarding: false,
      setOnboardingSeen: () => set({ hasSeenOnboarding: true }),

      isLoading: false,
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        recentSearches: state.recentSearches,
        hasSeenOnboarding: state.hasSeenOnboarding,
      }),
    }
  )
);
