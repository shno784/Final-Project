import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  Pressable,
} from "react-native";
import axios from "axios";
import { USDAFoodSearchProps, USDAFood } from "../types/FoodTypes";
import { useAppState } from "../utils/globalstates";

// This component is a search bar that fetches food suggestions from the USDA API based on user input.
export default function USDAFoodSearch({
  value,
  onChangeText,
  onSuggestionSelect,
  placeholder = "Search Food",
  inputClassName = "w-full border-[2px] border-primary rounded-lg py-3 px-5 text-xl placeholder:font-medium placeholder:text-text-head dark:placeholder:text-text-d-head",
}: USDAFoodSearchProps) {
  const [suggestions, setSuggestions] = useState<USDAFood[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const usdaBaseURL = "https://api.nal.usda.gov/fdc/v1";
  const usdaKey = process.env.EXPO_PUBLIC_USDA_API_KEY;

  const { addSearch, recentSearches } = useAppState();

  // This effect runs when the component mounts and whenever the value changes.
  useEffect(() => {
    // If the input is empty or has less than 3 characters, display recent searches.
    if (!value || value.length < 3) {
      const recentSuggestions: USDAFood[] = recentSearches.map(
        (query, index) => ({
          fdcId: Number(`9000${index}`), // dummy unique id (adjust as needed)
          description: query,
        })
      );
      setSuggestions(recentSuggestions);
      return;
    }

    // Otherwise, fetch suggestions from the USDA API.
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get(`${usdaBaseURL}/foods/search`, {
          params: {
            api_key: usdaKey,
            query: value,
            pageSize: 5,
          },
        });
        if (response.data.foods) {
          setSuggestions(response.data.foods);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    };

    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 300); // debounce time

    return () => clearTimeout(timer);
  }, [value, recentSearches]);

  // When a suggestion (or recent search) is selected:
  const handleSelect = (item: USDAFood) => {
    onChangeText(item.description);
    setSuggestions([]);
    addSearch(item.description);
    if (onSuggestionSelect) onSuggestionSelect(item);
    setIsFocused(false); // Dismiss the suggestions
  };

  return (
    <View className="relative w-full flex-1">
      <TextInput
        className={inputClassName}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
      />
      {isFocused && suggestions.length > 0 && (
        <>
          {/*
            This invisible Pressable overlay covers the whole container.
            Tapping it will dismiss the suggestions.
          */}
          <Pressable
            onPress={() => setIsFocused(false)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
          <FlatList
            className="absolute top-full left-0 right-0 z-10 bg-white dark:bg-black border border-gray-300 rounded-b-lg"
            data={suggestions}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            keyExtractor={(item) => item.fdcId.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelect(item)}
                className="py-2 px-4 border-b border-gray-200 dark:border-gray-600"
              >
                <Text className="text-lg text-text-head dark:text-text-d-head">
                  {item.description}
                </Text>
              </TouchableOpacity>
            )}
            style={{ maxHeight: 200 }}
          />
        </>
      )}
    </View>
  );
}
