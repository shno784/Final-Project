// components/USDAFoodSearch.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import axios from "axios";
import { USDAFoodSearchProps, USDAFood } from "@/types/FoodTypes";

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

  useEffect(() => {
    if (!value || value.length < 3) {
      setSuggestions([]);
      return;
    }

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
    }, 300); // simple debounce of 300ms

    return () => clearTimeout(timer);
  }, [value]);

  const handleSelect = (item: USDAFood) => {
    onChangeText(item.description);
    setSuggestions([]);
    if (onSuggestionSelect) onSuggestionSelect(item);
  };

  return (
    // This container is positioned relative so the absolute FlatList is positioned relative to it
    <View className="relative w-full flex-1">
      <TextInput
        className={inputClassName}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        // Delay clearing focus to allow onPress events from the suggestions to register
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
      />
      {isFocused && suggestions.length > 0 && (
        <FlatList
          // Absolute positioning so the suggestion list overlays other content rather than pushing it down
          className="absolute top-full left-0 right-0 z-10 bg-white dark:bg-black border border-gray-300 rounded-b-lg"
          data={suggestions}
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
          style={{ maxHeight: 200 }} // limiting height if there are many suggestions
        />
      )}
    </View>
  );
}
